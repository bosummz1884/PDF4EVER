import { useCallback } from 'react';
import { Annotation } from '../../types';
import { useAnnotationStore } from '../../stores/annotationStore';
import { useUIStore } from '../../stores/uiStore';
import { AnnotationRenderer } from './AnnotationRenderer';
import { cn } from '../../utils/cn';

interface AnnotationOverlayProps {
  pageNumber: number;
  annotations: Annotation[];
  scale: number;
}

export function AnnotationOverlay({  
  annotations, 
  scale 
}: AnnotationOverlayProps) {
  const { selectedAnnotations, selectAnnotation, clearSelection } = useAnnotationStore();
  const { currentTool } = useUIStore();

  const handleAnnotationClick = useCallback((annotation: Annotation, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (event.ctrlKey || event.metaKey) {
      // Add to selection
      if (selectedAnnotations.includes(annotation.id)) {
        // Remove from selection if already selected
        return;
      }
      selectAnnotation(annotation.id);
    } else {
      // Single selection
      selectAnnotation(annotation.id);
    }
  }, [selectedAnnotations, selectAnnotation]);

  const handleOverlayClick = useCallback((_event: React.MouseEvent) => {
    if (currentTool === 'select') {
      clearSelection();
    }
  }, [currentTool, clearSelection]);

  return (
    <div 
      className={cn(
        'annotation-overlay',
        currentTool !== 'select' && 'pointer-events-none'
      )}
      onClick={handleOverlayClick}
    >
      {annotations.map((annotation) => (
        <AnnotationRenderer
          key={annotation.id}
          annotation={annotation}
          scale={scale}
          isSelected={selectedAnnotations.includes(annotation.id)}
          onClick={(event) => handleAnnotationClick(annotation, event)}
        />
      ))}
    </div>
  );
}