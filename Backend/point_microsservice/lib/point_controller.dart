import 'dart:convert';
import 'package:http/http.dart' as http;

class PointController {
  final String baseUrl = 'http://localhost:8082'; // altere conforme necessário

  Future<int> getPoints(String userId) async {
    final response = await http.get(
      Uri.parse('$baseUrl/points/$userId'),
      headers: {'Content-Type': 'application/json'},
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['points'];
    } else {
      final error = jsonDecode(response.body)['error'];
      throw Exception(error ?? 'Erro ao obter pontos');
    }
  }

  Future<void> addPoints(String userId, int points) async {
    final response = await http.post(
      Uri.parse('$baseUrl/points/add'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'userId': userId, 'points': points}),
    );

    if (response.statusCode != 200) {
      final error = jsonDecode(response.body)['error'];
      throw Exception(error ?? 'Erro ao adicionar pontos');
    }
  }

  Future<void> updatePoints(String userId, int points) async{
    final response = await http.put(
      Uri.parse('$baseUrl/points/update'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'userId': userId, 'points': points}),
    );

    if (response.statusCode != 200) {
      final error = jsonDecode(response.body)['error'];
      throw Exception(error ?? 'Erro ao atualizar pontos');
    }
  }

  Future<void> deletePoints(String userId) async {
    final response = await http.delete(
      Uri.parse('$baseUrl/points/delete/$userId'),
      headers: {'Content-Type': 'application/json'},
    );

    if (response.statusCode != 200) {
      final error = jsonDecode(response.body)['error'];
      throw Exception(error ?? 'Erro ao deletar pontos');
    }
  }
}
