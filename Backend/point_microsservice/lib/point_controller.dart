import 'dart:convert';
import 'package:http/http.dart' as http;

class PointController {
  final String baseUrl;

  PointController({this.baseUrl = 'http://localhost:8082'});

  Future<int> getPoints(int userId) async {
    final res = await http.get(Uri.parse('$baseUrl/points/$userId'));
    if (res.statusCode != 200) {
      throw Exception('failed');
    }
    return int.parse(res.body.trim());
  }

  Future<void> addPoints(int userId, int points) async {
    final res = await http.post(Uri.parse('$baseUrl/points/$userId/add/$points'));
    if (res.statusCode != 200) {
      throw Exception('failed');
    }
  }

  Future<void> removePoints(int userId, int points) async {
    final res = await http.post(Uri.parse('$baseUrl/points/$userId/remove/$points'));
    if (res.statusCode != 200) {
      throw Exception('failed');
    }
  }

  Future<void> resetPoints(int userId) async {
    final res = await http.post(Uri.parse('$baseUrl/points/$userId/reset'));
    if (res.statusCode != 200) {
      throw Exception('failed');
    }
  }

  Future<void> deletePoints(int userId) async {
    final res = await http.delete(Uri.parse('$baseUrl/points/$userId'));
    if (res.statusCode != 200) {
      throw Exception('failed');
    }
  }
}
