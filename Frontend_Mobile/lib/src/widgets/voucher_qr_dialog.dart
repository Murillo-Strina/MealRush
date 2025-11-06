import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';

class VoucherQrDialog extends StatelessWidget {
  final String qrCode;

  const VoucherQrDialog({
    super.key,
    required this.qrCode,
  });

  @override
  Widget build(BuildContext context) {
    final hasCode = qrCode.trim().isNotEmpty;

    return AlertDialog(
      title: const Text('Seu voucher'),
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (hasCode)
              QrImageView(
                data: qrCode,
                size: 200,
              )
            else
              const Icon(
                Icons.error_outline,
                size: 48,
                color: Colors.red,
              ),
            const SizedBox(height: 12),
            Text(
              hasCode
                  ? qrCode
                  : 'Não foi possível gerar o código.',
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 12, color: Colors.grey),
            ),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('Fechar'),
        ),
      ],
    );
  }
}
