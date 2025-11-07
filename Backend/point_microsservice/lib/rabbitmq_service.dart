import 'dart:convert';
import 'package:dart_amqp/dart_amqp.dart';
import 'package:dotenv/dotenv.dart';

class RabbitMQService {
  final Client _client;
  final Exchange _exchange;

  RabbitMQService._(this._client, this._exchange);

  static Future<RabbitMQService> connect({
    String? url,
    String exchangeName = 'events',
  }) async {
    final env = DotEnv(includePlatformEnvironment: true)..load();
    final rabbitUrl = url ?? env['RABBITMQ_URL'] ?? '';

    ConnectionSettings settings;
    if (rabbitUrl.isNotEmpty && rabbitUrl.startsWith('amqp')) {
      final uri = Uri.parse(rabbitUrl);
      final parts = uri.userInfo.split(':');
      final username = parts.isNotEmpty ? parts.first : null;
      final password = parts.length > 1 ? parts[1] : null;
      if (username != null && password != null) {
        settings = ConnectionSettings(
          host: uri.host,
          port: uri.hasPort ? uri.port : 5672,
          authProvider: PlainAuthenticator(username, password),
        );
      } else {
        settings = ConnectionSettings(
          host: uri.host,
          port: uri.hasPort ? uri.port : 5672,
        );
      }
    } else {
      settings = ConnectionSettings(
        host: 'rabbitmq',
        port: 5672,
      );
    }

    final client = Client(settings: settings);
    final channel = await client.channel();
    final exchange =
        await channel.exchange(exchangeName, ExchangeType.TOPIC, durable: true);

    return RabbitMQService._(client, exchange);
  }

  Future<void> publish(String routingKey, Map<String, dynamic> payload) async {
    final body = jsonEncode(payload);
    final props = MessageProperties()..deliveryMode = 2;
    _exchange.publish(body, routingKey, properties: props);
  }

  Future<void> close() async {
    await _client.close();
  }
}
