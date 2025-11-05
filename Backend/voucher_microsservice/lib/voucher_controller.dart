import 'dart:convert';
import 'package:shelf/shelf.dart';
import 'package:voucher_microsservice/voucher_service.dart';

class VoucherController {
  final VoucherService service;
  VoucherController(this.service);

  Future<Response> create(Request req) async {
    try {
      final body = jsonDecode(await req.readAsString());
      final userId = body['userId'];
      final foodId = body['foodId'];
      final cost = body['cost'] ?? 25;

      if (userId == null || foodId == null) {
        return Response(400, body: 'userId e foodId são obrigatórios');
      }

      final qr = await service.createVoucher(userId as int, foodId as int, cost as int);

      return Response.ok(
        jsonEncode({'qrCode': qr}),
        headers: {'content-type': 'application/json'},
      );
    } catch (e) {
      return Response.internalServerError(body: e.toString());
    }
  }

  Future<Response> getByQr(Request req, String qr) async {
    try {
      final data = await service.getVoucherByQr(qr);
      return Response.ok(
        jsonEncode(data),
        headers: {'content-type': 'application/json'},
      );
    } catch (e) {
      return Response(404, body: e.toString());
    }
  }

  Future<Response> markUsed(Request req, String qr) async {
    try {
      await service.markUsed(qr);
      return Response.ok('OK');
    } catch (e) {
      return Response(404, body: e.toString());
    }
  }
}
