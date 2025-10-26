import 'package:auth_microsservice_users/services/auth_service.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _auth = AuthService();

  bool _loading = false;
  String? _errorMessage;

  void _login() async {
    setState(() {
      _loading = true;
      _errorMessage = null;
    });

    try {
      final result = await _auth.login(
        _emailController.text,
        _passwordController.text,
      );
      print('Token: ${result['token']}');

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Login bem-sucedido!')),
      );

      // TODO: redirecionar para próxima tela
    } catch (e) {
      setState(() => _errorMessage = e.toString());
    } finally {
      setState(() => _loading = false);
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
                padding:
                    const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
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
                              controller: _emailController,
                              style: const TextStyle(color: Colors.white),
                              decoration: const InputDecoration(
                                hintText: 'Insira seu email',
                                hintStyle: TextStyle(color: Colors.white70),
                                icon: Icon(Icons.email_outlined,
                                    color: Colors.white),
                                border: InputBorder.none,
                              ),
                            ),
                            const Divider(color: Colors.white54, thickness: 1),
                            TextField(
                              controller: _passwordController,
                              obscureText: true,
                              style: const TextStyle(color: Colors.white),
                              decoration: const InputDecoration(
                                hintText: 'Insira sua senha',
                                hintStyle: TextStyle(color: Colors.white70),
                                icon: Icon(Icons.lock_outline_rounded,
                                    color: Colors.white),
                                border: InputBorder.none,
                              ),
                            ),
                            const SizedBox(height: 15),
                            if (_errorMessage != null)
                              Text(
                                _errorMessage!,
                                style: const TextStyle(
                                    color: Colors.red, fontSize: 14),
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
                                        ? const CircularProgressIndicator()
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
                                    onPressed: () {
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
