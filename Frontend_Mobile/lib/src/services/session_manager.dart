import 'package:shared_preferences/shared_preferences.dart';

class SessionManager {
  static const _ktokenKey = 'auth_token';
  static const _kUserIdKey = 'auth_user_id';
  static const _kUserNameKey = 'auth_user_name';

  static Future<void> saveSession({
    required String token,
    required int? userId,
    required String? username,
  }) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_ktokenKey, token);
    if (userId != null) await prefs.setInt(_kUserIdKey, userId);
    if (username != null) await prefs.setString(_kUserNameKey, username);
  }

  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_ktokenKey);
  }

  static Future<int?> getUserId() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getInt(_kUserIdKey);
  }

  static Future<String?> getUsername() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_kUserNameKey);
  }

  static Future<void> clearSession() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_ktokenKey);
    await prefs.remove(_kUserIdKey);
    await prefs.remove(_kUserNameKey);
  }
}

