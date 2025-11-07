import 'dart:io';
import 'package:dotenv/dotenv.dart';
import 'package:mysql_client/mysql_client.dart';
import 'package:point_microsservice/point_service.dart';
import 'package:point_microsservice/rabbitmq_service.dart';
import 'package:shelf/shelf.dart';
import 'package:shelf/shelf_io.dart';
import 'package:shelf_router/shelf_router.dart';

final _router = Router();
late final PointService pointService;

Future<Response> _root(Request req) async {
  return Response.ok('points service\n');
}

void main(List<String> args) async {
  final dot = DotEnv(includePlatformEnvironment: true)..load();

  final dbHost = dot['DB_HOST'] ?? '127.0.0.1';
  final dbPort = int.tryParse(dot['DB_PORT'] ?? '3306') ?? 3306;
  final dbUser = dot['DB_USER'] ?? 'root';
  final dbPassword = dot['DB_PASSWORD'] ?? '';
  final dbName = dot['DB_NAME'] ?? 'mealrush';
  final useSSL = (dot['DB_SSL'] ?? 'true').toLowerCase() == 'true';

  final pool = MySQLConnectionPool(
    host: dbHost,
    port: dbPort,
    userName: dbUser,
    password: dbPassword,
    databaseName: dbName,
    maxConnections: 10,
    secure: useSSL,
  );

  RabbitMQService? rabbit;
  try {
    rabbit = await RabbitMQService.connect();
  } catch (_) {
    rabbit = null;
  }

  pointService = PointService(pool, rabbit);

  _router.get('/', _root);

  _router.get('/points/<userId>', (Request req, String userId) async {
    final uid = int.tryParse(userId);
    if (uid == null) return Response.badRequest(body: 'invalid userId');
    try {
      final data = await pointService.getPointsByUserId(uid);
      return Response.ok(data['points'].toString());
    } catch (e) {
      return Response.internalServerError(body: e.toString());
    }
  });

  _router.post('/points/<userId>/add/<points>', (
    Request req,
    String userId,
    String points,
  ) async {
    final uid = int.tryParse(userId);
    final pts = int.tryParse(points);
    if (uid == null || pts == null) return Response.badRequest(body: 'invalid params');
    try {
      await pointService.addPoints(uid, pts);
      return Response.ok('ok');
    } catch (e) {
      return Response.internalServerError(body: e.toString());
    }
  });

  _router.post('/points/<userId>/remove/<points>', (
    Request req,
    String userId,
    String points,
  ) async {
    final uid = int.tryParse(userId);
    final pts = int.tryParse(points);
    if (uid == null || pts == null) return Response.badRequest(body: 'invalid params');
    try {
      await pointService.removePoints(uid, pts);
      return Response.ok('ok');
    } catch (e) {
      return Response.internalServerError(body: e.toString());
    }
  });

  _router.post('/points/<userId>/reset', (Request req, String userId) async {
    final uid = int.tryParse(userId);
    if (uid == null) return Response.badRequest(body: 'invalid userId');
    try {
      await pointService.resetPoints(uid);
      return Response.ok('ok');
    } catch (e) {
      return Response.internalServerError(body: e.toString());
    }
  });

  _router.delete('/points/<userId>', (Request req, String userId) async {
    final uid = int.tryParse(userId);
    if (uid == null) return Response.badRequest(body: 'invalid userId');
    try {
      await pointService.deleteUserPoints(uid);
      return Response.ok('ok');
    } catch (e) {
      return Response.internalServerError(body: e.toString());
    }
  });

  final handler = Pipeline().addMiddleware(logRequests()).addHandler(_router.call);
  final ip = InternetAddress.anyIPv4;
  final port = int.parse(Platform.environment['PORT'] ?? '8082');
  final server = await serve(handler, ip, port);
  print('points service running on ${server.port}');
}
