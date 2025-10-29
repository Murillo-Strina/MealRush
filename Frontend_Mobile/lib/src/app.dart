import 'package:flutter/material.dart';
import 'package:device_preview/device_preview.dart';
import 'package:mealrush_club/src/screens/home_screen.dart';
import 'package:mealrush_club/src/screens/registration_screen.dart';
import 'screens/login_screen.dart';

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      useInheritedMediaQuery: true,
      locale: DevicePreview.locale(context),
      builder: DevicePreview.appBuilder,

      title: 'MealRush Club',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      
      routes: {
        '/login': (_) => const LoginScreen(),
        '/home': (_) => const HomeScreen(),
        '/register': (_) => const RegistrationScreen(),
      },

      initialRoute: '/login',
    );
  }
}