import 'package:flutter/material.dart';

class RoundedImage extends StatelessWidget {
  final String imagePath;
  final double radius;
  final Color borderColor;
  final double borderWidth;

  const RoundedImage({
    super.key,
    required this.imagePath,
    this.radius = 20.0,
    this.borderColor = Colors.transparent,
    this.borderWidth = 2.0,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        shape: BoxShape.rectangle,
        borderRadius: BorderRadius.circular(radius),
        border: Border.all(color: borderColor, width: borderWidth),
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(radius),
        child: Image.asset(imagePath, width: 250),
      ),
    );
  }
}
