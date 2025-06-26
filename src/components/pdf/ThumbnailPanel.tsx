import { useState } from 'react';
import { Document, Page } from 'react-pdf';
import { usePDFStore } from '../../stores/pdfStore';
import { useUIStore } from '../../stores/uiStore';
import { cn } from '../../utils/cn';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Trash2, RotateCcw, RotateCw, Copy } from 'lucide-react';
import { Button } from '../ui/button';

export function ThumbnailPanel() {
  const { currentDocument, currentPage, setCurrentPage } = usePDFStore();
  const { } = useUIStore();
  const [draggedPage, setDraggedPage] = useState<number | null>(null);

  if (!currentDocument) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <p>No document loaded</p>
      </div>
    );
  }

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleDragStart = (e: React.DragEvent, pageNumber: number) => {
    setDraggedPage(pageNumber);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetPage: number) => {
    e.preventDefault();
    if (draggedPage && draggedPage !== targetPage) {
      // Implement page reordering logic here
      console.log(`Moving page ${draggedPage} to position ${targetPage}`);
    }
    setDraggedPage(null);
  };

  const renderThumbnail = (pageNumber: number) => (
    <div
      key={pageNumber}
      className={cn(
        'thumbnail-item group relative',
        currentPage === pageNumber && 'active'
      )}
      onClick={() => handlePageClick(pageNumber)}
      draggable
      onDragStart={(e) => handleDragStart(e, pageNumber)}
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, pageNumber)}
    >
      <div className="relative w-full h-full bg-white rounded overflow-hidden">
        <Page
          pageNumber={pageNumber}
          scale={0.2}
          renderAnnotationLayer={false}
          renderTextLayer={false}
          loading={<LoadingSpinner size="sm" />}
          className="w-full h-full"
        />
        
        {/* Page overlay controls */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-white hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              console.log(`Rotate page ${pageNumber} left`);
            }}
          >
            <RotateCcw className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-white hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              console.log(`Rotate page ${pageNumber} right`);
            }}
          >
            <RotateCw className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-white hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              console.log(`Duplicate page ${pageNumber}`);
            }}
          >
            <Copy className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-white hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              console.log(`Delete page ${pageNumber}`);
            }}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      {/* Page number */}
      <div className="absolute bottom-1 left-1 right-1 text-center">
        <span className="text-xs bg-black/70 text-white px-1 rounded">
          {pageNumber}
        </span>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b">
        <h3 className="text-sm font-medium">Pages</h3>
      </div>
      
      <div className="flex-1 overflow-auto custom-scrollbar">
        {currentDocument.file && (
          <Document
            file={currentDocument.file}
            loading={<LoadingSpinner />}
          >
            <div className="thumbnail-grid p-3">
              {Array.from({ length: currentDocument.metadata.pageCount || 0 }, (_, i) => 
                renderThumbnail(i + 1)
              )}
            </div>
          </Document>
        )}
      </div>
    </div>
  );
}