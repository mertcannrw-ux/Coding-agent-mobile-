import 'package:flutter/material.dart';
import 'screens/home.dart';

void main() {
  runApp(const CodingAgentMobile());
}

class CodingAgentMobile extends StatelessWidget {
  const CodingAgentMobile({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Coding Agent Mobile',
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark(),
      home: const HomeScreen(),
    );
  }
}
