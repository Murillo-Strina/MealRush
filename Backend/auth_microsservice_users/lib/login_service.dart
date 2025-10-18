import 'dart:convert';
import 'package:crypto/crypto.dart';
import 'package:mysql1/mysql1.dart';
import 'package:dart_jsonwebtoken/dart_jsonwebtoken.dart';
import 'package:auth_microsservice_users/rabbitmq_service.dart';

class LoginService {
  final ConnectionSettings dbSettings;
  final String jwtSecret;
  final RabbitMQService? rabbit;

  LoginService(this.dbSettings, this.jwtSecret, [this.rabbit]);

  // Usa Base64 para caber no VARCHAR(45) do campo `password`
  String hashPassword(String password) {
    final key = utf8.encode(jwtSecret);
    final bytes = utf8.encode(password);
    final hmacSha256 = Hmac(sha256, key);
    final digestBytes = hmacSha256.convert(bytes).bytes; // 32 bytes
    return base64Encode(digestBytes); // 44 chars (com "=="), cabe em 45
  }

  Future<Results> _query(String sql, [List<Object?>? params]) async {
    final conn = await MySqlConnection.connect(dbSettings);
    try {
      return await conn.query(sql, params);
    } finally {
      await conn.close();
    }
  }

  Future<Map<String, dynamic>> login(String username, String password) async {
    final hashed = hashPassword(password);
    final rows = await _query(
      'SELECT id_user, username FROM users WHERE username = ? AND password = ?',
      [username, hashed],
    );
    if (rows.isEmpty) {
      throw Exception('Usuário ou senha inválidos');
    }
    final row = rows.first;
    final jwt = JWT({'id_user': row['id_user'], 'username': row['username']});
    final token = jwt.sign(SecretKey(jwtSecret), expiresIn: const Duration(hours: 1));
    return {
      'token': token,
      'user': {'id_user': row['id_user'], 'username': row['username']}
    };
  }

  Future<void> register(String username, String password) async {
    final hashed = hashPassword(password);
    final exists = await _query(
      'SELECT id_user FROM users WHERE username = ?',
      [username],
    );
    if (exists.isNotEmpty) throw Exception('Usuário já existe');

    await _query(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashed],
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
      'SELECT id_user FROM users WHERE username = ? AND password = ?',
      [username, hashed],
    );
    if (found.isEmpty) throw Exception('Usuário ou senha inválidos');

    await _query('DELETE FROM users WHERE username = ?', [username]);

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
      'UPDATE users SET password = ? WHERE username = ?',
      [hashed, username],
    );
  }

  Future<Map<String, dynamic>?> findUserByUsername(String username) async {
    final rows = await _query(
      'SELECT id_user, username FROM users WHERE username = ?',
      [username],
    );
    if (rows.isEmpty) return null;
    final r = rows.first;
    return {'id_user': r['id_user'], 'username': r['username']};
  }
}
