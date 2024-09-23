import 'package:flutter/material.dart';

class Home extends StatelessWidget {
  const Home({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(

      appBar: AppBar(

        title: const Text("Gym rat"),
        backgroundColor: Colors.green[300],
        centerTitle: true,

      ),

      body: const Text('Hello World')

    );
  }
}