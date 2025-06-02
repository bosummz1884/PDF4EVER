import 'package:flutter/material.dart';
import 'dart:ui' as ui;

class AnnotationCanvas extends StatefulWidget {
  final void Function(ui.Image)? onCapture;

  const AnnotationCanvas({super.key, this.onCapture});

  @override
  State<AnnotationCanvas> createState() => _AnnotationCanvasState();
}

class _AnnotationCanvasState extends State<AnnotationCanvas> {
  final _points = <Offset>[];
  final _color = Colors.red;
  final _strokeWidth = 3.0;

  final _repaintKey = GlobalKey();

  Future<void> _captureImage() async {
    final boundary = _repaintKey.currentContext?.findRenderObject() as RenderRepaintBoundary?;
    if (boundary != null) {
      final image = await boundary.toImage(pixelRatio: 3.0);
      widget.onCapture?.call(image);
    }
  }

  void _clearCanvas() {
    setState(() => _points.clear());
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        RepaintBoundary(
          key: _repaintKey,
          child: GestureDetector(
            onPanUpdate: (details) {
              setState(() {
                final renderBox = context.findRenderObject() as RenderBox;
                _points.add(renderBox.globalToLocal(details.globalPosition));
              });
            },
            onPanEnd: (_) => _points.add(Offset.zero),
            child: CustomPaint(
              painter: _DrawingPainter(points: _points, color: _color, strokeWidth: _strokeWidth),
              size: Size.infinite,
            ),
          ),
        ),
        Positioned(
          right: 10,
          top: 10,
          child: Column(
            children: [
              ElevatedButton(onPressed: _clearCanvas, child: const Text("Clear")),
              const SizedBox(height: 10),
              ElevatedButton(onPressed: _captureImage, child: const Text("Save")),
            ],
          ),
        ),
      ],
    );
  }
}

class _DrawingPainter extends CustomPainter {
  final List<Offset> points;
  final Color color;
  final double strokeWidth;

  _DrawingPainter({required this.points, required this.color, required this.strokeWidth});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round;

    for (var i = 0; i < points.length - 1; i++) {
      if (points[i] != Offset.zero && points[i + 1] != Offset.zero) {
        canvas.drawLine(points[i], points[i + 1], paint);
      }
    }
  }

  @override
  bool shouldRepaint(_DrawingPainter oldDelegate) => true;
}
