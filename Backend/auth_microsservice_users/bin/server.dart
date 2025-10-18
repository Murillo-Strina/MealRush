import 'dart:convert';
import 'dart:io';

import 'package:shelf/shelf.dart';
import 'package:shelf/shelf_io.dart';
import 'package:shelf_router/shelf_router.dart';
import 'package:mysql1/mysql1.dart';
import 'package:dotenv/dotenv.dart';
import 'package:auth_microsservice_users/login_service.dart';
import 'package:auth_microsservice_users/rabbitmq_service.dart';

final _router = Router();

Future<Response> _rootHandler(Request req) async {
  return Response.ok('Hello, World!\n');
}

Response _echoHandler(Request request) {
  final message = request.params['message'];
  return Response.ok('$message\n');
}

late final LoginService loginService;

void main(List<String> args) async {
  final dot = DotEnv(includePlatformEnvironment: true)..load();

  final dbHost = dot['DB_HOST'] ?? '127.0.0.1';
  final dbPort = int.tryParse(dot['DB_PORT'] ?? '3306') ?? 3306;
  final dbUser = dot['DB_USER'] ?? 'root';
  final dbPassword = dot['DB_PASSWORD'] ?? '';
  final dbName = dot['DB_NAME'] ?? 'mealrush';

  final jwtSecret = dot['LOGIN_PASSWORD_JWT_SECRET'] ?? 'secret';

  final dbSettings = ConnectionSettings(
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPassword,
    db: dbName,
    useSSL: true,
    timeout: const Duration(seconds: 5),
  );

  RabbitMQService? rabbit;
  try {
    rabbit = await RabbitMQService.connect();
  } catch (e) {
    print('Aviso: não foi possível conectar ao RabbitMQ: $e');
    rabbit = null;
  }

  loginService = LoginService(dbSettings, jwtSecret, rabbit);

  _router.get('/', _rootHandler);
  _router.get('/echo/<message>', _echoHandler);

  _router.post('/register', (Request req) async {
    final body = jsonDecode(await req.readAsString());
    try {
      await loginService.register(body['username'], body['password']);
      return Response.ok(
        jsonEncode({'message': 'Usuário registrado com sucesso'}),
        headers: {'content-type': 'application/json'},
      );
    } catch (e) {
      return Response(
        400,
        body: jsonEncode({'error': e.toString()}),
        headers: {'content-type': 'application/json'},
      );
    }
  });

  _router.post('/login', (Request req) async {
    final body = jsonDecode(await req.readAsString());
    try {
      final res = await loginService.login(body['username'], body['password']);
      return Response.ok(
        jsonEncode(res),
        headers: {'content-type': 'application/json'},
      );
    } catch (e) {
      return Response(
        401,
        body: jsonEncode({'error': e.toString()}),
        headers: {'content-type': 'application/json'},
      );
    }
  });

  _router.post('/update-password', (Request req) async {
    final body = jsonDecode(await req.readAsString());
    try {
      await loginService.updatePassword(body['username'], body['newPassword']);
      return Response.ok(
        jsonEncode({'message': 'Senha atualizada'}),
        headers: {'content-type': 'application/json'},
      );
    } catch (e) {
      return Response(
        400,
        body: jsonEncode({'error': e.toString()}),
        headers: {'content-type': 'application/json'},
      );
    }
  });

  _router.post('/delete', (Request req) async {
    final body = jsonDecode(await req.readAsString());
    try {
      await loginService.deleteUser(body['username'], body['password']);
      return Response.ok(
        jsonEncode({'message': 'Usuário excluído'}),
        headers: {'content-type': 'application/json'},
      );
    } catch (e) {
      return Response(
        400,
        body: jsonEncode({'error': e.toString()}),
        headers: {'content-type': 'application/json'},
      );
    }
  });

  // Bind
  final ip = InternetAddress.anyIPv4;
  final handler = Pipeline()
      .addMiddleware(logRequests())
      .addHandler(_router.call);

  // Respeita a env PORT (seus testes setam 8080)
  final port = int.parse(Platform.environment['PORT'] ?? '8081');
  final server = await serve(handler, ip, port);
  print('Server listening on port ${server.port}');
}
