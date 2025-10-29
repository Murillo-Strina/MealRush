import 'dart:io';

import 'package:dotenv/dotenv.dart';
import 'package:mysql_client/mysql_client.dart';
import 'package:point_microsservice/point_service.dart';
import 'package:point_microsservice/rabbitmq_service.dart';
import 'package:shelf/shelf.dart';
import 'package:shelf/shelf_io.dart';
import 'package:shelf_router/shelf_router.dart';

final _router = Router();

Future<Response> _rootHandler(Request req) async {
  return Response.ok('Hello, World!\n');
}

Response _echoHandler(Request request) {
  final message = request.params['message'];
  return Response.ok('$message\n');
}

late final PointService pointService;

void main(List<String> args) async {
  final dot = DotEnv(includePlatformEnvironment: true)..load();

  final dbHost = dot['DB_HOST'] ?? '127.0.0.1';
  final dbPort = int.tryParse(dot['DB_PORT'] ?? '3306') ?? 3306;
  final dbUser = dot['DB_USER'] ?? 'root';
  final dbPassword = dot['DB_PASSWORD'] ?? '';
  final dbName = dot['DB_NAME'] ?? 'mealrush';

    final useSSL = (dot['DB_SSL'] ?? 'true').toLowerCase() == 'true';

  final dbPool = MySQLConnectionPool(
    host: dbHost,
    port: dbPort,
    userName: dbUser,
    password: dbPassword,
    databaseName: dbName,
    maxConnections: 10,
    secure: useSSL,
  );
  
  try {
    await dbPool.execute('SELECT 1;');
  } catch (e) {
    stderr.writeln('Erro ao conectar ao MySQL: $e');
    exit(1);
  }

  RabbitMQService? rabbit;
  try {
    rabbit = await RabbitMQService.connect();
  } catch (e) {
    print('Aviso: não foi possível conectar ao RabbitMQ: $e');
    rabbit = null;
  }

  pointService = PointService(dbPool, rabbit);

  _router.get('/', _rootHandler);
  _router.get('/echo/<message>', _echoHandler);

  _router.post('/points/<userId>/add/<points>', (Request request, String userId, String points) async {
    final uid = int.tryParse(userId);
    final pts = int.tryParse(points);
    if (uid == null || pts == null) {
      return Response.badRequest(body: 'Parâmetros inválidos\n');
    }
    try {
      await pointService.addPoints(uid, pts);
      return Response.ok('Pontos adicionados com sucesso\n');
    } catch (e) {
      return Response.internalServerError(body: 'Erro ao adicionar pontos: $e\n');
    }
  });

  _router.post('/points/<userId>/remove/<points>', (Request request, String userId, String points) async {
    final uid = int.tryParse(userId);
    final pts = int.tryParse(points);
    if (uid == null || pts == null) {
      return Response.badRequest(body: 'Parâmetros inválidos\n');
    }
    try {
      await pointService.removePoints(uid, pts);
      return Response.ok('Pontos removidos com sucesso\n');
    } catch (e) {
      return Response.internalServerError(body: 'Erro ao remover pontos: $e\n');
    }
  });

  _router.get('/points/<userId>', (Request request, String userId) async {
    final uid = int.tryParse(userId);
    if (uid == null) {
      return Response.badRequest(body: 'Parâmetros inválidos\n');
    }
    try {
      final pointsData = await pointService.getPointsByUserId(uid);
      return Response.ok('${pointsData['points']}\n');
    } catch (e) {
      return Response.internalServerError(body: 'Erro ao obter pontos: $e\n');
    }
  });

  _router.post('/points/<userId>/reset', (Request request, String userId) async {
    final uid = int.tryParse(userId);
    if (uid == null) {
      return Response.badRequest(body: 'Parâmetros inválidos\n');
    }
    try {
      await pointService.resetPoints(uid);
      return Response.ok('Pontos resetados com sucesso\n');
    } catch (e) {
      return Response.internalServerError(body: 'Erro ao resetar pontos: $e\n');
    }
  });

  _router.delete('/points/<userId>', (Request request, String userId) async {
    final uid = int.tryParse(userId);
    if (uid == null) {
      return Response.badRequest(body: 'Parâmetros inválidos\n');
    }
    try {
      await pointService.deleteUserPoints(uid);
      return Response.ok('Pontos do usuário deletados com sucesso\n');
    } catch (e) {
      return Response.internalServerError(body: 'Erro ao deletar pontos do usuário: $e\n');
    }
  });

  final ip = InternetAddress.anyIPv4;
  final handler = Pipeline().addMiddleware(logRequests()).addHandler(_router.call);

  final port = int.parse(Platform.environment['PORT'] ?? '8082');
  final server = await serve(handler, ip, port);
  print('Server listening on port ${server.port}');

  ProcessSignal.sigint.watch().listen((_) async {
    print('Encerrando...');
    await dbPool.close();
    await server.close(force: true);
    exit(0);
  });
}