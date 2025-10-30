import 'package:mysql_client/mysql_client.dart';
import 'package:point_microsservice/rabbitmq_service.dart';

class PointService{
  final MySQLConnectionPool pool;
  final RabbitMQService? rabbit;

  PointService(this.pool, [this.rabbit]);

  Future <IResultSet> _query(String sql, [Map<String, Object?> params = const {}]) async {
    try {
      return await pool.execute(sql, params);
    } catch (e) {
      throw Exception('Erro de banco de dados: $e');
    }
  }

  Future <Map<String, dynamic>> getPointsByUserId(int userId) async {
    final rs = await _query(
      'SELECT points FROM user_points WHERE id_user = :u LIMIT 1',
      {'u': userId},
    );
    if (rs.rows.isEmpty) {
      throw Exception('Usuário não encontrado');
    }
    final row = rs.rows.first;
    final pointsStr = row.colByName('points');
    final points = (pointsStr == null) ? 0 : int.tryParse(pointsStr) ?? 0;
    return {
      'id_user': userId,
      'points': points,
    };
  }

  Future<void> addPoints(int userId, int pointsToAdd) async {
    final rs = await _query(
      'INSERT INTO user_points (id_user, points) VALUES (:u, :p) '
          'ON DUPLICATE KEY UPDATE points = points + :p',
      {'u': userId, 'p': pointsToAdd},
    );
    if (rs.affectedRows == 0) {
      throw Exception('Falha ao adicionar pontos');
    }
  }

  Future<void> removePoints(int userId, int pointsToRemove) async {
    final rs = await _query(
      'UPDATE user_points SET points = GREATEST(points - :p, 0) WHERE id_user = :u',
      {'u': userId, 'p': pointsToRemove},
    );
    if (rs.affectedRows == 0) {
      throw Exception('Falha ao remover pontos ou usuário não encontrado');
    }
  }

  Future<void> resetPoints(int userId) async {
    final rs = await _query(
      'UPDATE user_points SET points = 0 WHERE id_user = :u',
      {'u': userId},
    );
    if (rs.affectedRows == 0) {
      throw Exception('Falha ao resetar pontos ou usuário não encontrado');
    }
  }

  Future <void> deleteUserPoints(int userId) async {
    final rs = await _query(
      'DELETE FROM user_points WHERE id_user = :u',
      {'u': userId},
    );
    if (rs.affectedRows == 0) {
      throw Exception('Falha ao deletar pontos ou usuário não encontrado');
    }
  }
}