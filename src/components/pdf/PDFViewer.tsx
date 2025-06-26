import { useState, useRef, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { usePDFStore } from '../../stores/pdfStore';
import { useUIStore } from '../../stores/uiStore';
import { useAnnotationStore } from '../../stores/annotationStore';
import { AnnotationOverlay } from './AnnotationOverlay';
import { PageControls } from './PageControls';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ErrorMessage } from '../ui/ErrorMessage';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

export function PDFViewer() {
  const { currentDocument, currentPage, setCurrentPage } = usePDFStore();
  const { zoom, viewMode } = useUIStore();
  const { annotations } = useAnnotationStore();
  const [numPages, setNumPages] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  }, []);

  const onDocumentLoadError = useCallback((error: Error) => {
    console.error('PDF loading error:', error);
    setError(`Failed to load PDF: ${error.message}`);
    setLoading(false);
  }, []);

  const onPageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, [setCurrentPage]);

  if (!currentDocument) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-muted-foreground">
          <p>No document loaded</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <ErrorMessage message={error} />
      </div>
    );
  }

  const pageAnnotations = annotations.filter(ann => 
    ann.pageId === `page_${currentPage}`
  );

  const renderPage = (pageNumber: number) => (
    <div key={pageNumber} className="relative mb-6">
      <Page
        pageNumber={pageNumber}
        scale={zoom / 100}
        className="pdf-page mx-auto"
        renderTextLayer={true}
        renderAnnotationLayer={false}
        loading={<LoadingSpinner />}
        error={<ErrorMessage message="Failed to load page" />}
      />
      <AnnotationOverlay
        pageNumber={pageNumber}
        annotations={pageAnnotations}
        scale={zoom / 100}
      />
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      <PageControls
        currentPage={currentPage}
        totalPages={numPages}
        onPageChange={onPageChange}
      />
      
      <div 
        ref={containerRef}
        className="flex-1 overflow-auto custom-scrollbar"
        style={{ backgroundColor: '#f5f5f5' }}
      >
        <Document
          file={currentDocument.file}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={<LoadingSpinner />}
          error={<ErrorMessage message="Failed to load document" />}
        >
          <div className="py-6">
            {viewMode === 'single' && renderPage(currentPage)}
            
            {viewMode === 'continuous' && 
              Array.from({ length: numPages }, (_, i) => renderPage(i + 1))
            }
            
            {viewMode === 'facing' && (
              <div className="flex justify-center gap-4">
                {currentPage % 2 === 1 ? (
                  <>
                    {renderPage(currentPage)}
                    {currentPage < numPages && renderPage(currentPage + 1)}
                  </>
                ) : (
                  <>
                    {currentPage > 1 && renderPage(currentPage - 1)}
                    {renderPage(currentPage)}
                  </>
                )}
              </div>
            )}
          </div>
        </Document>
      </div>
    </div>
  );
}