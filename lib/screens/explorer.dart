import 'package:flutter/material.dart';

class ExplorerScreen extends StatelessWidget {
  const ExplorerScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Project Explorer")),
      body: ListView(
        children: const [
          ListTile(
            leading: Icon(Icons.insert_drive_file),
            title: Text("index.html"),
          ),
          ListTile(
            leading: Icon(Icons.insert_drive_file),
            title: Text("style.css"),
          ),
          ListTile(
            leading: Icon(Icons.insert_drive_file),
            title: Text("main.js"),
          ),
        ],
      ),
    );
  }
}