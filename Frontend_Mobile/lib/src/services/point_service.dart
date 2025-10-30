import 'dart:convert';
import 'package:http/http.dart' as http;

class PointService {
  final String baseUrl = 'http://localhost:31108';

  Future<int> getPointsByUserId(int userId) async {
    final response = await http.get(
      Uri.parse('$baseUrl/points/$userId'),
      headers: {'Content-Type': 'application/json'},
    );

    if (response.statusCode == 200) {
      return int.parse(response.body.trim());
    }
    final err = jsonDecode(response.body)['error'];
    throw Exception(err ?? 'Erro ao buscar pontos do usuário');
  }

  Future<void> addPoints(int userId, int points) async {
    final response = await http.post(
      Uri.parse('$baseUrl/points/$userId/add/$points'),
      headers: {'Content-Type': 'application/json'},
    );

    if (response.statusCode == 200) {
      return;
    }
    else{
      final err = jsonDecode(response.body)['error'];
      throw Exception(err ?? 'Erro ao adicionar pontos');
    }
  }

  Future<void> removePoints(int userId, int points) async {
    final response = await http.post(
      Uri.parse('$baseUrl/points/$userId/remove/$points'),
      headers: {'Content-Type': 'application/json'},
    );

    if (response.statusCode == 200) {
      return;
    } else {
      final err = jsonDecode(response.body)['error'];
      throw Exception(err ?? 'Erro ao remover pontos');
    }
  }
}
