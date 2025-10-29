import 'package:flutter/material.dart';
import 'package:mealrush_club/src/screens/home_screen.dart';
import 'package:mealrush_club/src/screens/registration_screen.dart';
import 'package:mealrush_club/src/services/auth_service.dart';
import 'package:mealrush_club/src/services/session_manager.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();
  final _auth = AuthService();

  bool _loading = false;
  String? _errorMessage;

  @override
  void dispose() {
    _usernameController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _login() async {
    setState(() {
      _loading = true;
      _errorMessage = null;
    });

    if (_usernameController.text.trim().isEmpty ||
        _passwordController.text.trim().isEmpty) {
      setState(() {
        _loading = false;
        _errorMessage = 'Preencha usuário e senha';
      });
      return;
    }

    try {
      final result = await _auth.login(
        _usernameController.text,
        _passwordController.text,
      );
      
      final token = result['token'] as String?;
      final user = result['user'] as Map<String, dynamic>?;
      final idUser = user?['id_user'] as int?;
      final username = user?['username'] as String?;

      if(token == null) throw Exception('Token não recebido');

      await SessionManager.saveSession(
        token: token,
        userId: idUser,
        username: username,
      );

      if (!mounted) return;
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Login bem-sucedido!')));

      Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(builder: (context) => const HomeScreen()),
        (route) => false,
      );
    } catch (e) {
      setState(
        () => _errorMessage = e.toString().replaceFirst('Exception: ', ''),
      );
    } finally {
      if (mounted) {
        setState(() => _loading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[200],
      body: LayoutBuilder(
        builder: (BuildContext context, BoxConstraints viewportConstraints) {
          return SingleChildScrollView(
            child: ConstrainedBox(
              constraints: BoxConstraints(
                minHeight: viewportConstraints.maxHeight,
              ),
              child: Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 24,
                ),
                child: Align(
                  alignment: const Alignment(0.0, -0.2),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Image.asset(
                        'assets/images/logo_mealrush_transparent.png',
                        width: 300,
                      ),
                      const SizedBox(height: 24),
                      Container(
                        constraints: const BoxConstraints(maxWidth: 400),
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.orange,
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Column(
                          children: [
                            TextField(
                              controller: _usernameController,
                              style: const TextStyle(color: Colors.white),
                              decoration: const InputDecoration(
                                hintText: 'Insira seu usuário',
                                hintStyle: TextStyle(color: Colors.white70),
                                icon: Icon(
                                  Icons.account_circle_outlined,
                                  color: Colors.white,
                                ),
                                border: InputBorder.none,
                              ),
                              keyboardType: TextInputType.text,
                            ),
                            const Divider(color: Colors.white54, thickness: 1),
                            TextField(
                              controller: _passwordController,
                              obscureText: true,
                              style: const TextStyle(color: Colors.white),
                              decoration: const InputDecoration(
                                hintText: 'Insira sua senha',
                                hintStyle: TextStyle(color: Colors.white70),
                                icon: Icon(
                                  Icons.lock_outline_rounded,
                                  color: Colors.white,
                                ),
                                border: InputBorder.none,
                              ),
                            ),
                            const SizedBox(height: 15),
                            if (_errorMessage != null)
                              Padding(
                                padding: const EdgeInsets.only(bottom: 10.0),
                                child: Text(
                                  _errorMessage!,
                                  style: const TextStyle(
                                    color: Colors.redAccent,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 14,
                                  ),
                                  textAlign: TextAlign.center,
                                ),
                              ),
                            Row(
                              children: [
                                Expanded(
                                  child: ElevatedButton(
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: Colors.white,
                                      foregroundColor: Colors.orange,
                                      minimumSize: const Size(0, 48),
                                    ),
                                    onPressed: _loading ? null : _login,
                                    child: _loading
                                        ? const CircularProgressIndicator(
                                            valueColor:
                                                AlwaysStoppedAnimation<Color>(
                                                  Colors.orange,
                                                ),
                                          )
                                        : const Text('Entrar'),
                                  ),
                                ),
                                const SizedBox(width: 10),
                                Expanded(
                                  child: ElevatedButton(
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: Colors.white,
                                      foregroundColor: Colors.orange,
                                      minimumSize: const Size(0, 48),
                                    ),
                                    onPressed: _loading
                                        ? null
                                        : () {
                                            Navigator.push(
                                              context,
                                              MaterialPageRoute(
                                                builder: (context) =>
                                                    const RegistrationScreen(),
                                              ),
                                            );
                                          },
                                    child: const Text('Criar conta'),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
