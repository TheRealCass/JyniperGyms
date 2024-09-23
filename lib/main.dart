import 'package:flutter/material.dart';
import 'package:gymapp/home.dart';

void main() {
  runApp(const MaterialApp(

    home: Home()

  ));
}

class SandBox extends StatelessWidget{
  const SandBox({super.key});

  Widget build(BuildContext context) {
    return Scaffold(

      appBar: AppBar(

        title: const Text('Sandbox Envr.'),
        backgroundColor: Colors.red

      ),

      body: Column(

        crossAxisAlignment: CrossAxisAlignment.stretch,
        mainAxisAlignment: MainAxisAlignment.center  ,
        children: [

          Container(

            width: 100,
            color: Colors.red,
            child: const Text('Óne')

          ),

          Container(

            width: 200,
            color: Colors.green,
            child: const Text('two')

          ),

          Container(

            width: 300,
            color: Colors.blue,
            child: const Text('three')

          )
        ],
      ),
    );
  }
}
