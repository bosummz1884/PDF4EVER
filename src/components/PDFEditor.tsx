import React from 'react';
import { Header } from './toolbar/Header';
import { Sidebar } from './Sidebar';
import { PDFViewer } from './pdf/PDFViewer';
import { PropertiesPanel } from './PropertiesPanel';
import { FileUploader } from './FileUploader';
import { usePDFStore } from '../stores/pdfStore';
import { useUIStore } from '../stores/uiStore';

export function PDFEditor() {
  const { currentDocument } = usePDFStore();
  const { sidebarVisible, propertiesVisible } = useUIStore();

  if (!currentDocument) {
    return (
      <div className="h-full flex items-center justify-center">
        <FileUploader />
      </div>
    );
  }

  return (
    <div className="pdf-editor-layout">
      <div className="grid-area-[header]">
        <Header />
      </div>
      
      {sidebarVisible && (
        <div className="grid-area-[sidebar] border-r bg-card">
          <Sidebar />
        </div>
      )}
      
      <div className="grid-area-[viewer] pdf-viewer-container">
        <PDFViewer />
      </div>
      
      {propertiesVisible && (
        <div className="grid-area-[properties] border-l bg-card">
          <PropertiesPanel />
        </div>
      )}
    </div>
  );
}