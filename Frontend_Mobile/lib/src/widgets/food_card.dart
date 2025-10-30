import 'package:flutter/material.dart';

class FoodCard extends StatelessWidget {
  final String imagePath;      
  final String title;          
  final String buttonText;     
  final VoidCallback onPress;  
  final double imageWidth;
  final double imageHeight;
  final String price;

  const FoodCard({
    super.key,
    required this.imagePath,
    required this.title,
    required this.buttonText,
    required this.onPress,
    this.price = "25 pontos",
    this.imageWidth = 200.0,
    this.imageHeight = 200.0,
  });

  bool get _isNetwork => imagePath.startsWith('http');

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12.0),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.2), 
            spreadRadius: 2,
            blurRadius: 5,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(8.0),
            child: _isNetwork
                ? Image.network(
                    imagePath,
                    height: imageHeight,
                    width: imageWidth,
                    fit: BoxFit.cover,
                    loadingBuilder: (context, child, progress) {
                      if (progress == null) return child;
                      return Container(
                        height: imageHeight,
                        width: imageWidth,
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
                      height: imageHeight,
                      width: imageWidth,
                      color: Colors.orange.shade100,
                      alignment: Alignment.center,
                      child: const Icon(
                        Icons.broken_image,
                        size: 48,
                        color: Colors.orange,
                      ),
                    ),
                  )
                : Image.asset(
                    imagePath,
                    height: imageHeight,
                    width: imageWidth,
                    fit: BoxFit.contain,
                  ),
          ),

          const SizedBox(height: 12),

          SizedBox(
            width: imageWidth,
            child: Text(
              title,
              textAlign: TextAlign.center,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),

          const SizedBox(height: 5),

          if (price.isNotEmpty) ...[
            const SizedBox(height: 12),
            SizedBox(
              width: imageWidth,
              child: Text(
                price,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ],

          const SizedBox(height: 20),

          ElevatedButton(
            onPressed: onPress,
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.deepOrange,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 15),
              textStyle: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(10),
              ),
            ),
            child: Text(buttonText),
          ),
        ],
      ),
    );
  }
}
