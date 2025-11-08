import 'dart:io';
import 'package:dotenv/dotenv.dart';
import 'package:mysql_client/mysql_client.dart';
import 'package:point_microsservice/point_controller.dart';
import 'package:point_microsservice/point_service.dart';
import 'package:point_microsservice/rabbitmq_service.dart';
import 'package:shelf/shelf.dart';
import 'package:shelf/shelf_io.dart';
import 'package:shelf_router/shelf_router.dart';

void main() async {
  final env = DotEnv(includePlatformEnvironment: true)..load();

  final db = MySQLConnectionPool(
    host: env['DB_HOST'] ?? '127.0.0.1',
    port: int.tryParse(env['DB_PORT'] ?? '3306') ?? 3306,
    userName: env['DB_USER'] ?? 'root',
    password: env['DB_PASSWORD'] ?? '',
    databaseName: env['DB_NAME'] ?? 'mealrush',
    maxConnections: 10,
    secure: (env['DB_SSL'] ?? 'false') == 'true',
  );

  RabbitMQService? rabbit;
  try {
    rabbit = await RabbitMQService.connect();
  } catch (_) {
    rabbit = null;
  }

  final pointService = PointService(db, rabbit);
  final pointController = PointController(pointService);

  final router = Router();
  router.get('/', pointController.health);
  router.get('/points/<userId>', pointController.getPoints);
  router.post('/points/<userId>/add/<points>', pointController.addPoints);
  router.post('/points/<userId>/remove/<points>', pointController.removePoints);
  router.post('/points/<userId>/reset', pointController.resetPoints);
  router.delete('/points/<userId>', pointController.deletePoints);

  final handler = Pipeline().addMiddleware(logRequests()).addHandler(router);

  final port = int.tryParse(env['PORT'] ?? '8082') ?? 8082;
  final server = await serve(handler, InternetAddress.anyIPv4, port);
  print('points_microsservice listening on $port');

  ProcessSignal.sigint.watch().listen((_) async {
    await db.close();
    if (rabbit != null) {
      await rabbit.close();
    }
    await server.close(force: true);
    exit(0);
  });
}
