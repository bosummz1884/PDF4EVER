import { PDFEditor } from './components/PDFEditor';
import { usePDFStore } from './stores/pdfStore';
import { useUIStore } from './stores/uiStore';
import { useEffect } from 'react';

function App() {
  const { currentDocument } = usePDFStore();
  const { error } = useUIStore();

  // You could add an effect to handle document loading or other initialization
  useEffect(() => {
    // Set document title based on the current document
    if (currentDocument) {
      document.title = `${currentDocument.name} - PDF4EVER`;
    } else {
      document.title = 'PDF4EVER';
    }
  }, [currentDocument]);

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