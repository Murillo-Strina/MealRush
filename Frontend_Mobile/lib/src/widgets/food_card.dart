import 'package:flutter/material.dart';

class FoodCard extends StatelessWidget {
  final String imagePath;
  final String title;
  final String buttonText;
  final VoidCallback onPress;
  final String price;
  final double imageWidth;
  final double imageHeight;

  const FoodCard({
    super.key,
    required this.imagePath,
    required this.title,
    required this.buttonText,
    required this.onPress,
    required this.price,
    this.imageWidth = 200.0,
    this.imageHeight = 200.0,
  });

  bool get _isNetwork => imagePath.startsWith('http');

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final double maxW = constraints.maxWidth;
        final double imgH = (maxW * 0.55).clamp(110, 180);

        Widget imageWidget;
        if (_isNetwork) {
          imageWidget = Image.network(
            imagePath,
            fit: BoxFit.cover,
            loadingBuilder: (context, child, progress) {
              if (progress == null) return child;
              return Container(
                color: Colors.orange.shade50,
                alignment: Alignment.center,
                child: const SizedBox(
                  height: 28,
                  width: 28,
                  child: CircularProgressIndicator(strokeWidth: 2),
                ),
              );
            },
            errorBuilder: (_, __, ___) => Container(
              color: Colors.orange.shade100,
              alignment: Alignment.center,
              child: const Icon(
                Icons.broken_image,
                size: 48,
                color: Colors.orange,
              ),
            ),
          );
        } else {
          imageWidget = Image.asset(
            imagePath,
            fit: BoxFit.cover,
          );
        }

        return SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(12.0),
                child: SizedBox(
                  height: imgH,
                  width: double.infinity,
                  child: imageWidget,
                ),
              ),
              const SizedBox(height: 10),
              Text(
                title,
                textAlign: TextAlign.left,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              if (price.isNotEmpty) ...[
                const SizedBox(height: 6),
                Text(
                  price,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: Colors.black87,
                  ),
                ),
              ],
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: onPress,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.deepOrange,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    textStyle: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                  child: Text(buttonText),
                ),
              ),
              const SizedBox(height: 4), 
            ],
          ),
        );
      },
    );
  }
}