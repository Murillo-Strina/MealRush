import 'dart:convert';
import 'package:shelf/shelf.dart';
import 'point_service.dart';

class PointController {
  final PointService service;

  PointController(this.service);

  Future<Response> health(Request req) async {
    return Response.ok(
      jsonEncode({'status': 'ok'}),
      headers: {'content-type': 'application/json'},
    );
  }

  Future<Response> getPoints(Request req, String userId) async {
    final uid = int.tryParse(userId);
    if (uid == null) {
      return Response(400, body: 'userId inválido');
    }
    try {
      final data = await service.getPointsByUserId(uid);
      return Response.ok(
        jsonEncode(data),
        headers: {'content-type': 'application/json'},
      );
    } catch (e) {
      return Response.internalServerError(body: e.toString());
    }
  }

  Future<Response> addPoints(Request req, String userId, String points) async {
    final uid = int.tryParse(userId);
    final pts = int.tryParse(points);
    if (uid == null || pts == null) {
      return Response(400, body: 'parâmetros inválidos');
    }
    try {
      await service.addPoints(uid, pts);
      return Response.ok(
        jsonEncode({'status': 'ok'}),
        headers: {'content-type': 'application/json'},
      );
    } catch (e) {
      return Response.internalServerError(body: e.toString());
    }
  }

  Future<Response> removePoints(Request req, String userId, String points) async {
    final uid = int.tryParse(userId);
    final pts = int.tryParse(points);
    if (uid == null || pts == null) {
      return Response(400, body: 'parâmetros inválidos');
    }
    try {
      await service.removePoints(uid, pts);
      return Response.ok(
        jsonEncode({'status': 'ok'}),
        headers: {'content-type': 'application/json'},
      );
    } catch (e) {
      return Response.internalServerError(body: e.toString());
    }
  }

  Future<Response> resetPoints(Request req, String userId) async {
    final uid = int.tryParse(userId);
    if (uid == null) {
      return Response(400, body: 'userId inválido');
    }
    try {
      await service.resetPoints(uid);
      return Response.ok(
        jsonEncode({'status': 'ok'}),
        headers: {'content-type': 'application/json'},
      );
    } catch (e) {
      return Response.internalServerError(body: e.toString());
    }
  }

  Future<Response> deletePoints(Request req, String userId) async {
    final uid = int.tryParse(userId);
    if (uid == null) {
      return Response(400, body: 'userId inválido');
    }
    try {
      await service.deleteUserPoints(uid);
      return Response.ok(
        jsonEncode({'status': 'ok'}),
        headers: {'content-type': 'application/json'},
      );
    } catch (e) {
      return Response.internalServerError(body: e.toString());
    }
  }
}
