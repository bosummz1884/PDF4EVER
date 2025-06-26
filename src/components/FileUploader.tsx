import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { usePDFStore } from '../stores/pdfStore';
import { useFileStore } from '../stores/fileStore';
import { PDFDocument, FileItem } from '../types';

export function FileUploader() {
  const { addDocument, setCurrentDocument, setLoading, setError } = usePDFStore();
  const { addFile, setFileUploading, setUploadProgress } = useFileStore();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setError(null);
    
    for (const file of acceptedFiles) {
      if (file.type !== 'application/pdf') {
        setError(`File ${file.name} is not a PDF file`);
        continue;
      }

      const fileItem: FileItem = {
        id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: new Date(file.lastModified),
        isUploading: true,
      };

      addFile(fileItem);
      setFileUploading(fileItem.id, true);

      try {
        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 10) {
          setUploadProgress(fileItem.id, progress);
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Create PDF document from file
        const pdfDocument: PDFDocument = {
          id: `pdf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          file,
          pages: [],
          metadata: {
            pageCount: 0,
            fileSize: file.size,
          },
          annotations: [],
          forms: [],
          signatures: [],
          isEncrypted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        addDocument(pdfDocument);
        setCurrentDocument(pdfDocument);
        setFileUploading(fileItem.id, false);
      } catch (error) {
        setError(`Failed to load PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setFileUploading(fileItem.id, false);
      }
    }
  }, [addDocument, setCurrentDocument, setError, addFile, setFileUploading, setUploadProgress]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    multiple: true,
  });

  return (
    <div className="w-full max-w-2xl mx-auto p-8">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
          ${isDragActive && !isDragReject ? 'border-primary bg-primary/5' : ''}
          ${isDragReject ? 'border-destructive bg-destructive/5' : ''}
          ${!isDragActive ? 'border-muted-foreground/25 hover:border-primary hover:bg-primary/5' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 rounded-full bg-primary/10">
            {isDragReject ? (
              <AlertCircle className="h-8 w-8 text-destructive" />
            ) : (
              <Upload className="h-8 w-8 text-primary" />
            )}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">
              {isDragActive
                ? isDragReject
                  ? 'Invalid file type'
                  : 'Drop PDF files here'
                : 'Upload PDF Files'
              }
            </h3>
            
            <p className="text-muted-foreground">
              {isDragReject
                ? 'Only PDF files are supported'
                : 'Drag and drop PDF files here, or click to browse'
              }
            </p>
          </div>
          
          {!isDragActive && (
            <Button variant="outline" className="gap-2">
              <File className="h-4 w-4" />
              Choose Files
            </Button>
          )}
        </div>
      </div>
      
      <div className="mt-6 text-center text-sm text-muted-foreground">
        <p>Supports multiple PDF files • Files are processed locally in your browser</p>
      </div>
    </div>
  );
}