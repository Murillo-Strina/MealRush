import 'package:flutter/material.dart';
import 'package:mealrush_club/src/services/session_manager.dart';
import 'package:mealrush_club/src/services/point_service.dart'; // <-- ajuste o import se necessário
import '../widgets/food_card.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final _pointsApi = PointService();

  String _username = '';
  int? _points;
  bool _loadingPoints = true;
  String? _pointsError;

  @override
  void initState() {
    super.initState();
    _loadUserAndPoints();
  }

  Future<void> _loadUserAndPoints() async {
    try {
      final uname = await SessionManager.getUsername() ?? '';
      final uid = await SessionManager.getUserId();

      setState(() {
        _username = uname;
      });

      if (uid == null) {
        setState(() {
          _pointsError = 'Usuário não identificado';
          _loadingPoints = false;
        });
        return;
      }

      final p = await _pointsApi.getPointsByUserId(uid);
      setState(() {
        _points = p;
        _loadingPoints = false;
      });
    } catch (e) {
      setState(() {
        _pointsError = e.toString().replaceFirst('Exception: ', '');
        _loadingPoints = false;
      });
    }
  }

  String _initialOf(String name) {
    if (name.trim().isEmpty) return '?';
    return name.trim()[0].toUpperCase();
  }

  Future<void> _logout() async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Sair'),
        content: const Text('Tem certeza que deseja sair?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Cancelar')),
          TextButton(onPressed: () => Navigator.pop(ctx, true), child: const Text('Sair')),
        ],
      ),
    );
    if (confirm != true) return;

    await SessionManager.clearSession();

    if (!mounted) return;
    Navigator.pushNamedAndRemoveUntil(context, '/login', (route) => false);
  }

  PopupMenuItem _profileCard(BuildContext context) {
    return PopupMenuItem(
      padding: EdgeInsets.zero,
      child: Container(
        width: 280,
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Image.asset(
                  'assets/images/logo_mealrush_transparent.png',
                  height: 36,
                ),
                const Spacer(),
                IconButton(
                  visualDensity: VisualDensity.compact,
                  icon: const Icon(Icons.close),
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),
            const SizedBox(height: 8),
            // avatar + nome
            Row(
              children: [
                CircleAvatar(
                  radius: 22,
                  backgroundColor: Colors.orange.shade700,
                  child: Text(
                    _initialOf(_username),
                    style: const TextStyle(
                      fontSize: 18, color: Colors.white, fontWeight: FontWeight.bold),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    _username.isEmpty ? 'Usuário' : _username,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            // cartão de pontos
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.orange.shade50,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.orange.shade200),
              ),
              child: _loadingPoints
                  ? const Row(
                      children: [
                        SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2)),
                        SizedBox(width: 8),
                        Text('Carregando pontos...'),
                      ],
                    )
                  : (_pointsError != null)
                      ? Text('Erro ao buscar pontos, tente novamente mais tarde.', style: const TextStyle(color: Colors.red))
                      : Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text('Seus pontos', style: TextStyle(fontWeight: FontWeight.w500)),
                            Text(
                              '${_points ?? 0}',
                              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                            ),
                          ],
                        ),
            ),
            const SizedBox(height: 12),
            // ação de logout
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: _logout,
                    icon: const Icon(Icons.logout),
                    label: const Text('Sair'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final initial = _initialOf(_username);

    return Scaffold(
      backgroundColor: Colors.grey[200],
      appBar: AppBar(
        title: const Text('MealRush', style: TextStyle(color: Colors.white)),
        backgroundColor: Colors.orange,
        actions: [
          PopupMenuButton(
            tooltip: 'Perfil',
            position: PopupMenuPosition.under, // abre embaixo, alinhado à direita
            offset: const Offset(0, 8),
            itemBuilder: (ctx) => [_profileCard(ctx)],
            child: Padding(
              padding: const EdgeInsets.only(right: 8.0),
              child: CircleAvatar(
                radius: 16,
                backgroundColor: Colors.white,
                child: CircleAvatar(
                  radius: 14,
                  backgroundColor: const Color(0xFFFF9800),
                  child: Text(
                    initial,
                    style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Estes são os pratos que você pode pedir hoje! Troque seus pontos por deliciosas refeições.',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: Colors.black87,
                ),
              ),
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(12.0),
                decoration: BoxDecoration(
                  color: Colors.orange,
                  borderRadius: BorderRadius.circular(16.0),
                ),
                child: GridView.count(
                  crossAxisCount: 2,
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  crossAxisSpacing: 24,
                  mainAxisSpacing: 24,
                  children: List.generate(4, (index) {
                    return FoodCard(
                      title: 'Marmita ${index + 1}',
                      imagePath: 'assets/images/foodplaceholder.png',
                      buttonText: 'Pedir',
                      onPress: () {

                      },
                    );
                  }),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
