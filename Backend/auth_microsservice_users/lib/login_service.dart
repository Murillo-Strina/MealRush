import 'dart:convert';
import 'package:crypto/crypto.dart';
import 'package:mysql1/mysql1.dart';
import 'package:dart_jsonwebtoken/dart_jsonwebtoken.dart';

class LoginService {
  final ConnectionSettings dbSettings;
  final String jwtSecret;

  LoginService(this.dbSettings, this.jwtSecret);

  String hashPassword(String password) {
    final key = utf8.encode(jwtSecret);
    final bytes = utf8.encode(password);
    final hmacSha256 = Hmac(sha256, key);
    return hmacSha256.convert(bytes).toString();
  }

  Future<Results> _query(String sql, [List<Object?>? params]) async {
    final conn = await MySqlConnection.connect(dbSettings);
    try {
      return await conn.query(sql, params);
    } finally {
      await conn.close();
    }
  }

  Future<Map<String, dynamic>> login(String email, String password) async {
    final hashed = hashPassword(password);
    final rows = await _query('SELECT id, email FROM users WHERE email = ? AND hashedPassword = ?', [email, hashed]);
    if (rows.isEmpty) {
      throw Exception('Usuário ou senha inválidos');
    }
    final row = rows.first;
    final jwt = JWT({'id': row['id'], 'email': row['email']});
    final token = jwt.sign(SecretKey(jwtSecret), expiresIn: const Duration(hours: 1));
    return {'token': token, 'user': {'id': row['id'], 'email': row['email']}};
  }

  Future<void> register(String email, String password) async {
    final hashed = hashPassword(password);
    final exists = await _query('SELECT id FROM users WHERE email = ?', [email]);
    if (exists.isNotEmpty) throw Exception('Usuário já existe');
    await _query('INSERT INTO users (email, hashedPassword) VALUES (?, ?)', [email, hashed]);
  }

  Future<void> deleteUser(String email, String password) async {
    final hashed = hashPassword(password);
    final found = await _query('SELECT id FROM users WHERE email = ? AND hashedPassword = ?', [email, hashed]);
    if (found.isEmpty) throw Exception('Usuário ou senha inválidos');
    await _query('DELETE FROM users WHERE email = ?', [email]);
  }

  Future<void> updatePassword(String email, String newPassword) async {
    final hashed = hashPassword(newPassword);
    await _query('UPDATE users SET hashedPassword = ? WHERE email = ?', [hashed, email]);
  }

  Future<Map<String, dynamic>?> findUserByEmail(String email) async {
    final rows = await _query('SELECT id, email FROM users WHERE email = ?', [email]);
    if (rows.isEmpty) return null;
    final r = rows.first;
    return {'id': r['id'], 'email': r['email']};
  }
}
