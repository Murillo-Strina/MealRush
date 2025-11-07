import 'dart:convert';
import 'package:crypto/crypto.dart';
import 'package:mysql_client/mysql_client.dart';
import 'package:dart_jsonwebtoken/dart_jsonwebtoken.dart';
import 'package:auth_microsservice_users/rabbitmq_service.dart';

class LoginService {
  final MySQLConnectionPool pool;
  final String jwtSecret;
  final RabbitMQService? rabbit;

  LoginService(this.pool, this.jwtSecret, [this.rabbit]);

  String hashPassword(String password) {
    final key = utf8.encode(jwtSecret);
    final bytes = utf8.encode(password);
    final hmacSha256 = Hmac(sha256, key);
    final digestBytes = hmacSha256.convert(bytes).bytes;
    return base64Encode(digestBytes); 
  }

  Future<IResultSet> _query(String sql, [Map<String, Object?> params = const {}]) async {
    try {
      return await pool.execute(sql, params);
    } catch (e) {
      throw Exception('Erro de banco de dados: $e');
    }
  }

  Future<Map<String, dynamic>> login(String username, String password) async {
    final hashed = hashPassword(password);

    final rs = await _query(
      'SELECT id_user, username FROM app_users WHERE username = :u AND password = :p LIMIT 1',
      {'u': username, 'p': hashed},
    );

    if (rs.rows.isEmpty) {
      throw Exception('Usuário ou senha inválidos');
    }

    final row = rs.rows.first;
    final idUserStr = row.colByName('id_user');
    final uname = row.colByName('username');

    final idUser = (idUserStr == null) ? null : int.tryParse(idUserStr);
    final jwt = JWT({'id_user': idUser, 'username': uname});
    final token = jwt.sign(SecretKey(jwtSecret), expiresIn: const Duration(hours: 1));

    return {
      'token': token,
      'user': {'id_user': idUser, 'username': uname}
    };
  }

  Future<void> register(String username, String password) async {
    final hashed = hashPassword(password);

    final exists = await _query(
      'SELECT id_user FROM app_users WHERE username = :u LIMIT 1',
      {'u': username},
    );
    if (exists.rows.isNotEmpty) throw Exception('Usuário já existe');

    await _query(
      'INSERT INTO app_users (username, password) VALUES (:u, :p)',
      {'u': username, 'p': hashed},
    );

    try {
      if (rabbit != null) {
        await rabbit!.publish('user.registered', {'username': username});
      }
    } catch (e) {
      print('Aviso: falha ao publicar evento user.registered: $e');
    }
  }

  Future<void> deleteUser(String username, String password) async {
    final hashed = hashPassword(password);

    final found = await _query(
      'SELECT id_user FROM app_users WHERE username = :u AND password = :p LIMIT 1',
      {'u': username, 'p': hashed},
    );
    if (found.rows.isEmpty) throw Exception('Usuário ou senha inválidos');

    await _query(
      'DELETE FROM app_users WHERE username = :u',
      {'u': username},
    );

    try {
      if (rabbit != null) {
        await rabbit!.publish('user.deleted', {'username': username});
      }
    } catch (e) {
      print('Aviso: falha ao publicar evento user.deleted: $e');
    }
  }

  Future<void> updatePassword(String username, String newPassword) async {
    final hashed = hashPassword(newPassword);
    await _query(
      'UPDATE app_users SET password = :p WHERE username = :u',
      {'p': hashed, 'u': username},
    );
  }

  Future<Map<String, dynamic>?> findUserByUsername(String username) async {
    final rs = await _query(
      'SELECT id_user, username FROM app_users WHERE username = :u LIMIT 1',
      {'u': username},
    );

    if (rs.rows.isEmpty) return null;

    final r = rs.rows.first;
    final idStr = r.colByName('id_user');
    final name = r.colByName('username');

    return {
      'id_user': idStr == null ? null : int.tryParse(idStr),
      'username': name,
    };
  }
}
