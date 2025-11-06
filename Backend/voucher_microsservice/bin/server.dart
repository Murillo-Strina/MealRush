import 'dart:io';
import 'package:dotenv/dotenv.dart';
import 'package:mysql_client/mysql_client.dart';
import 'package:shelf/shelf.dart';
import 'package:shelf/shelf_io.dart';
import 'package:shelf_router/shelf_router.dart';

import 'package:voucher_microsservice/voucher_service.dart';
import 'package:voucher_microsservice/voucher_controller.dart';

void main() async {
  final dot = DotEnv(includePlatformEnvironment: true)..load();

  final db = MySQLConnectionPool(
    host: dot['DB_HOST'] ?? '127.0.0.1',
    port: int.tryParse(dot['DB_PORT'] ?? '3306') ?? 3306,
    userName: dot['DB_USER'] ?? 'root',
    password: dot['DB_PASSWORD'] ?? '',
    databaseName: dot['DB_NAME'] ?? 'mealrush',
    maxConnections: 10,
    secure: (dot['DB_SSL'] ?? 'false') == 'true',
  );

  final voucherService = VoucherService(
    db,
    pointsBaseUrl: dot['POINTS_BASE_URL'] ?? 'http://point-microsservice:8083',
  );
  final voucherController = VoucherController(voucherService);

  final router = Router();

  router.post('/vouchers', voucherController.create);
  router.get('/vouchers/<qr>', voucherController.getByQr);
  router.post('/vouchers/<qr>/use', voucherController.markUsed);

  final handler = Pipeline().addMiddleware(logRequests()).addHandler(router);

  final port = 8083; // <<-- aqui
  final server = await serve(handler, InternetAddress.anyIPv4, port);
  print('voucher_microsservice listening on $port');

  ProcessSignal.sigint.watch().listen((_) async {
    await db.close();
    await server.close(force: true);
    exit(0);
  });
}
