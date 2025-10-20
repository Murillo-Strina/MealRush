import 'dart:async';
import 'dart:convert';

import 'package:dart_amqp/dart_amqp.dart';
import 'package:dotenv/dotenv.dart';

class RabbitMQService {
  final Client _client;
  final Exchange _exchange;

  RabbitMQService._(this._client, this._exchange);

  static Future<RabbitMQService> connect({String? url, String exchangeName = 'events'}) async {
    // url format amqp://user:pass@host:port
    final dot = DotEnv(includePlatformEnvironment: true)..load();
    final rabbitUrl = url ?? dot['RABBITMQ_URL'] ?? '';

    // parse basic parts if provided as amqp://
    ConnectionSettings settings;
    if (rabbitUrl.isNotEmpty && rabbitUrl.startsWith('amqp')) {
      // dart_amqp accepts host/user/password/port separately; we'll do a naive parse
      final uri = Uri.parse(rabbitUrl);
      final username = uri.userInfo.isNotEmpty ? uri.userInfo.split(':').first : null;
      final password = uri.userInfo.isNotEmpty && uri.userInfo.split(':').length > 1 ? uri.userInfo.split(':')[1] : null;
      if (username != null && password != null) {
        settings = ConnectionSettings(
          host: uri.host,
          port: uri.hasPort ? uri.port : 5672,
          authProvider: PlainAuthenticator(username, password),
        );
      } else {
        settings = ConnectionSettings(host: uri.host, port: uri.hasPort ? uri.port : 5672);
      }
    } else {
      // fallback to localhost cluster
      settings = ConnectionSettings(host: 'rabbitmq', port: 5672);
    }

    final client = Client(settings: settings);
    final channel = await client.channel();
    final exchange = await channel.exchange(exchangeName, ExchangeType.TOPIC, durable: true);
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
