import 'package:mysql_client/mysql_client.dart';
import 'package:http/http.dart' as http;

class VoucherService {
  final MySQLConnectionPool pool;
  final String pointsBaseUrl;

  VoucherService(this.pool, {required this.pointsBaseUrl});

  Future<int> _getPoints(int userId) async {
    final res = await http.get(
      Uri.parse('$pointsBaseUrl/points/$userId'),
      headers: {'Content-Type': 'application/json'},
    );
    if (res.statusCode != 200) {
      throw Exception('Não foi possível consultar pontos');
    }
    return int.tryParse(res.body.trim()) ?? 0;
  }

  Future<void> _removePoints(int userId, int cost) async {
    final res = await http.post(
      Uri.parse('$pointsBaseUrl/points/$userId/remove/$cost'),
      headers: {'Content-Type': 'application/json'},
    );
    if (res.statusCode != 200) {
      throw Exception('Falha ao debitar pontos');
    }
  }

  Future<String> createVoucher(int userId, int foodId, int cost) async {
    final currentPoints = await _getPoints(userId);
    if (currentPoints < cost) {
      throw Exception('Pontos insuficientes');
    }

    await _removePoints(userId, cost);

    final qr = 'VCH-${DateTime.now().millisecondsSinceEpoch}-$userId-$foodId';

    await pool.execute(
      'INSERT INTO user_vouchers (id_user, food_id, qr_code) VALUES (:u, :f, :q)',
      {'u': userId, 'f': foodId, 'q': qr},
    );

    return qr;
  }

  Future<Map<String, dynamic>> getVoucherByQr(String qr) async {
    final rs = await pool.execute(
      'SELECT id_user, food_id, status FROM user_vouchers WHERE qr_code = :qr LIMIT 1',
      {'qr': qr},
    );
    if (rs.rows.isEmpty) {
      throw Exception('Voucher não encontrado');
    }
    final row = rs.rows.first;
    return {
      'userId': row.colByName('id_user'),
      'foodId': row.colByName('food_id'),
      'status': row.colByName('status'),
    };
  }

  Future<void> markUsed(String qr) async {
    final rs = await pool.execute(
      'UPDATE user_vouchers SET status = "USED" WHERE qr_code = :qr',
      {'qr': qr},
    );
    if (rs.affectedRows == 0) {
      throw Exception('Voucher não encontrado');
    }
  }
}
