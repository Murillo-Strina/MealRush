import 'dart:convert';
import 'dart:io';

import 'package:shelf/shelf.dart';
import 'package:shelf/shelf_io.dart';
import 'package:shelf_router/shelf_router.dart';
import 'package:mysql1/mysql1.dart';
import 'package:dotenv/dotenv.dart';
import 'package:auth_microsservice_users/login_service.dart';

// Router
final _router = Router();

Future<Response> _rootHandler(Request req) async {
  // precisa ser "Hello, World!\n" para bater com seu teste
  return Response.ok('Hello, World!\n');
}

Response _echoHandler(Request request) {
  final message = request.params['message'];
  return Response.ok('$message\n');
}

// Service instance will be initialized in main
late final LoginService loginService;

void main(List<String> args) async {
  // Cria uma instância do DotEnv e carrega o .env
  // (inclui variáveis do SO; útil em Docker/CI)
  final dot = DotEnv(includePlatformEnvironment: true)
    // se seu .env não estiver no diretório de execução, passe o caminho absoluto:
    // ..load(['C:/Maua/4o/arq-lp2/MealRush/Backend/auth_microsservice_users/.env']);
    ..load();

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
  );

  loginService = LoginService(dbSettings, jwtSecret);

  // Rotas
  _router.get('/', _rootHandler);
  _router.get('/echo/<message>', _echoHandler);

  _router.post('/register', (Request req) async {
    final body = jsonDecode(await req.readAsString());
    try {
      await loginService.register(body['email'], body['password']);
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
      final res = await loginService.login(body['email'], body['password']);
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
      await loginService.updatePassword(body['email'], body['newPassword']);
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
      await loginService.deleteUser(body['email'], body['password']);
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
  final handler = Pipeline().addMiddleware(logRequests()).addHandler(_router.call);

  // Respeita a env PORT (seus testes setam 8080)
  final port = int.parse(Platform.environment['PORT'] ?? '8081');
  final server = await serve(handler, ip, port);
  print('Server listening on port ${server.port}');
}
