import 'dart:convert';

import 'package:http/http.dart' as http;

class Food {
  final int id;
  final String name;
  final String imageUrl;

  Food({required this.id, required this.name, required this.imageUrl});

  static Food fromJson(Map<String, dynamic> json) {
    final rawId = json['Id'] ?? json['id'];
    final idParsed = rawId is int ? rawId : int.tryParse('$rawId') ?? 0;

    final img = json['imageUrl'] ?? json['image_url'] ?? json['image'] ?? '';
    
    return Food(
      id: idParsed,
      name: json['name'] as String,
      imageUrl: img as String, 
    );
  }
}

class FoodService {
  final String baseUrl = 'http://localhost:32718';

  Future<List<Food>> fetchFoods() async {
    final response = await http.get(
      Uri.parse('$baseUrl/foods'),
      headers: {'Content-Type': 'application/json'},
    );

    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      return data.map((item) => Food.fromJson(item)).toList();
    } else {
      throw Exception('Erro ao buscar alimentos');
    }
  }
}
