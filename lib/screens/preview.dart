import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

class HtmlPreviewScreen extends StatefulWidget {
  const HtmlPreviewScreen({super.key});

  @override
  State<HtmlPreviewScreen> createState() => _HtmlPreviewScreenState();
}

class _HtmlPreviewScreenState extends State<HtmlPreviewScreen> {
  late final WebViewController controller;

  @override
  void initState() {
    super.initState();

    controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..loadHtmlString('''
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial; background: #111; color: white; }
  </style>
</head>
<body>
  <h1>OpenCode Mobile Preview</h1>
  <p>Your generated site will show here.</p>
</body>
</html>
''');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("HTML Preview")),
      body: WebViewWidget(controller: controller),
    );
  }
}