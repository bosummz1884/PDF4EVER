import React from 'react';
import { PDFEditor } from './components/PDFEditor';
import { usePDFStore } from './stores/pdfStore';
import { useUIStore } from './stores/uiStore';

function App() {
  const { currentDocument } = usePDFStore();
  const { error } = useUIStore();

  return (
    <div className="h-screen bg-background text-foreground">
      {error && (
        <div className="bg-destructive/10 border-destructive/20 text-destructive border-b p-3 text-center">
          {error}
        </div>
      )}
      <PDFEditor />
    </div>
  );
}

export default App;