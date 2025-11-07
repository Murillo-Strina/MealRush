import 'package:mysql_client/mysql_client.dart';
import 'rabbitmq_service.dart';

class PointService {
  final MySQLConnectionPool pool;
  final RabbitMQService? rabbit;

  PointService(this.pool, [this.rabbit]);

  Future<Map<String, dynamic>> getPointsByUserId(int userId) async {
    final rs = await pool.execute(
      'SELECT points FROM user_points WHERE id_user = :u LIMIT 1',
      {'u': userId},
    );

    if (rs.rows.isEmpty) {
      return {'userId': userId, 'points': 0};
    }

    final pointsStr = rs.rows.first.colByName('points');
    final points = pointsStr == null ? 0 : int.tryParse(pointsStr) ?? 0;

    return {
      'userId': userId,
      'points': points,
    };
  }

  Future<void> addPoints(int userId, int pointsToAdd) async {
    final rs = await pool.execute(
      'INSERT INTO user_points (id_user, points) VALUES (:u, :p) '
      'ON DUPLICATE KEY UPDATE points = points + :p',
      {
        'u': userId,
        'p': pointsToAdd,
      },
    );

    if (rs.affectedRows == 0) {
      throw Exception('Não foi possível adicionar pontos');
    }

    if (rabbit != null) {
      await rabbit!.publish('points.added', {
        'userId': userId,
        'points': pointsToAdd,
      });
    }
  }

  Future<void> removePoints(int userId, int pointsToRemove) async {
    final rs = await pool.execute(
      'UPDATE user_points '
      'SET points = GREATEST(points - :p, 0) '
      'WHERE id_user = :u',
      {
        'u': userId,
        'p': pointsToRemove,
      },
    );

    if (rs.affectedRows == 0) {
      throw Exception('Não foi possível remover pontos');
    }

    if (rabbit != null) {
      await rabbit!.publish('points.removed', {
        'userId': userId,
        'points': pointsToRemove,
      });
    }
  }

  Future<void> resetPoints(int userId) async {
    final rs = await pool.execute(
      'UPDATE user_points SET points = 0 WHERE id_user = :u',
      {'u': userId},
    );

    if (rs.affectedRows == 0) {
      throw Exception('Não foi possível resetar os pontos');
    }

    if (rabbit != null) {
      await rabbit!.publish('points.reset', {
        'userId': userId,
      });
    }
  }

  Future<void> deleteUserPoints(int userId) async {
    final rs = await pool.execute(
      'DELETE FROM user_points WHERE id_user = :u',
      {'u': userId},
    );

    if (rs.affectedRows == 0) {
      throw Exception('Não foi possível excluir os pontos do usuário');
    }

    if (rabbit != null) {
      await rabbit!.publish('points.deleted', {
        'userId': userId,
      });
    }
  }
}
