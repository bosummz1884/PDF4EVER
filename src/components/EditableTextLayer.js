import 'package:flutter/material.dart';

class EditableTextLayer extends StatefulWidget {
  final void Function(String text, Offset position)? onSubmit;

  const EditableTextLayer({super.key, this.onSubmit});

  @override
  State<EditableTextLayer> createState() => _EditableTextLayerState();
}

class _EditableTextLayerState extends State<EditableTextLayer> {
  final List<_TextBox> _textBoxes = [];

  void _addTextBox(Offset position) {
    setState(() {
      _textBoxes.add(_TextBox(position: position));
    });
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (details) => _addTextBox(details.localPosition),
      child: Stack(
        children: _textBoxes.map((box) {
          return Positioned(
            left: box.position.dx,
            top: box.position.dy,
            child: Draggable(
              feedback: Material(
                child: box.build(context, readOnly: true),
              ),
              childWhenDragging: const SizedBox.shrink(),
              onDragEnd: (details) {
                setState(() {
                  box.position = details.offset;
                });
              },
              child: box.build(context),
            ),
          );
        }).toList(),
      ),
    );
  }
}

class _TextBox {
  Offset position;
  final TextEditingController controller = TextEditingController();

  _TextBox({required this.position});

  Widget build(BuildContext context, {bool readOnly = false}) {
    return SizedBox(
      width: 200,
      child: TextField(
        controller: controller,
        readOnly: readOnly,
        maxLines: null,
        decoration: InputDecoration(
          hintText: 'Enter text...',
          border: OutlineInputBorder(),
          filled: true,
          fillColor: Colors.white.withOpacity(0.8),
        ),
        style: const TextStyle(fontSize: 16),
      ),
    );
  }
}
