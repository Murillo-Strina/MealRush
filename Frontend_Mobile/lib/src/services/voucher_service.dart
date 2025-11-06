import 'dart:convert';
import 'package:http/http.dart' as http;

class VoucherService {
  final String baseUrl = 'http://localhost:32557';

  Future<String> criarVoucher({
    required int userId,
    required int foodId,
    int cost = 25,
  }) async {
    final url = Uri.parse('$baseUrl/vouchers');

    final res = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'userId': userId,
        'foodId': foodId,
        'cost': cost,
      }),
    );

    if (res.statusCode == 200) {
      final data = jsonDecode(res.body);
      return data['qrCode'] as String;
    } else {
      throw Exception('Erro ao gerar voucher: ${res.body}');
    }
  }
}
