import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import 'dart:typed_data';

class CloudImportWidget extends StatefulWidget {
  final void Function(Uint8List fileBytes, String fileName) onImport;

  const CloudImportWidget({super.key, required this.onImport});

  @override
  State<CloudImportWidget> createState() => _CloudImportWidgetState();
}

class _CloudImportWidgetState extends State<CloudImportWidget> {
  Future<void> _pickCloudFile() async {
    final result = await FilePicker.platform.pickFiles(
      allowMultiple: false,
      type: FileType.custom,
      allowedExtensions: ['pdf'],
      withData: true,
    );

    if (result != null && result.files.single.bytes != null) {
      final file = result.files.single;
      widget.onImport(file.bytes!, file.name);
    }
  }

  @override
  Widget build(BuildContext context) {
    return ElevatedButton.icon(
      icon: const Icon(Icons.cloud_download),
      label: const Text("Import from Cloud"),
      onPressed: _pickCloudFile,
    );
  }
}
