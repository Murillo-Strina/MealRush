import 'package:flutter/material.dart';

class RegistrationScreen extends StatelessWidget {
  const RegistrationScreen({super.key});

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
                  horizontal: 16.0,
                  vertical: 24.0,
                ),
                child: Align(
                  alignment: Alignment(0.0, -0.2),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Image.asset(
                        'assets/images/logo_mealrush_transparent.png',
                        width: 300,
                      ),
                      const SizedBox(height: 24.0),
                      Container(
                        constraints: BoxConstraints(maxWidth: 400),
                        padding: const EdgeInsets.all(12.0),
                        decoration: BoxDecoration(
                          color: Colors.orange,
                          borderRadius: BorderRadius.circular(16.0),
                        ),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            TextFormField(
                              keyboardType: TextInputType.emailAddress,
                              style: TextStyle(color: Colors.white),
                              decoration: InputDecoration(
                                hintText: 'Insira seu nome',
                                hintStyle: TextStyle(color: Colors.white70),
                                icon: Icon(
                                  Icons.account_circle_outlined,
                                  color: Colors.white,
                                ),
                                border: InputBorder.none,
                              ),
                            ),
                            Divider(
                              color: Colors.white54,
                              thickness: 1,
                              height: 20,
                            ),
                            TextFormField(
                              keyboardType: TextInputType.emailAddress,
                              style: TextStyle(color: Colors.white),
                              decoration: InputDecoration(
                                hintText: 'Insira seu email',
                                hintStyle: TextStyle(color: Colors.white70),
                                icon: Icon(
                                  Icons.email_outlined,
                                  color: Colors.white,
                                ),
                                border: InputBorder.none,
                              ),
                            ),
                            Divider(
                              color: Colors.white54,
                              thickness: 1,
                              height: 20,
                            ),
                            TextFormField(
                              obscureText: true,
                              style: TextStyle(color: Colors.white),
                              decoration: InputDecoration(
                                hintText: 'Insira sua senha',
                                hintStyle: TextStyle(color: Colors.white70),
                                icon: Icon(
                                  Icons.lock_outline_rounded,
                                  color: Colors.white,
                                ),
                                border: InputBorder.none,
                              ),
                            ),
                            SizedBox(height: 15),
                            SizedBox(
                              width: double.infinity,
                              child: ElevatedButton(
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.white,
                                  foregroundColor: Colors.orange,
                                  minimumSize: Size(0, 48),
                                ),
                                onPressed: () {},
                                child: Text('Criar conta'),
                              ),
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

