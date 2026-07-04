import 'package:flutter/material.dart';
import 'explorer.dart';
import 'preview.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int index = 0;

  final pages = const [
    ExplorerScreen(),
    HtmlPreviewScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: pages[index],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: index,
        onTap: (i) => setState(() => index = i),
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.folder), label: "Explorer"),
          BottomNavigationBarItem(icon: Icon(Icons.web), label: "Preview"),
        ],
      ),
    );
  }
}
