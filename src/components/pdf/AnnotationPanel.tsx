import { useState } from 'react';
import { MessageSquare, Trash2, Edit, Reply } from 'lucide-react';
import { useAnnotationStore } from '../../stores/annotationStore';
import { usePDFStore } from '../../stores/pdfStore';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Annotation } from '../../types';

export function AnnotationPanel() {
  const { annotations, removeAnnotation, updateAnnotation } = useAnnotationStore();
  const { currentDocument, setCurrentPage } = usePDFStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const handleAnnotationClick = (annotation: Annotation) => {
    const pageNumber = parseInt(annotation.pageId.replace('page_', ''));
    setCurrentPage(pageNumber);
  };

  const startEdit = (annotation: Annotation) => {
    setEditingId(annotation.id);
    setEditText(annotation.properties.text || '');
  };

  const saveEdit = () => {
    if (editingId) {
      const currentAnnotation = annotations.find(a => a.id === editingId);
      if (currentAnnotation) {
        updateAnnotation(editingId, {
          properties: {
            ...currentAnnotation.properties,
            text: editText,
            color: currentAnnotation.properties.color,
          }
        });
      }
      setEditingId(null);
      setEditText('');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const getAnnotationTypeLabel = (type: string) => {
    const labels = {
      text: 'Text',
      highlight: 'Highlight',
      note: 'Note',
      rectangle: 'Rectangle',
      circle: 'Circle',
      line: 'Line',
      arrow: 'Arrow',
      freehand: 'Drawing',
      stamp: 'Stamp',
      image: 'Image'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getAnnotationColor = (annotation: Annotation) => {
    return annotation.properties.color || '#000000';
  };

  if (!currentDocument) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <p>No document loaded</p>
      </div>
    );
  }

  const textAnnotations = annotations.filter(ann => 
    ann.type === 'text' || ann.type === 'note' || ann.properties.text
  );

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b">
        <h3 className="text-sm font-medium">Annotations</h3>
        <p className="text-xs text-muted-foreground">
          {textAnnotations.length} text annotations
        </p>
      </div>
      
      <div className="flex-1 overflow-auto custom-scrollbar">
        {textAnnotations.length > 0 ? (
          <div className="p-2 space-y-2">
            {textAnnotations.map((annotation) => (
              <div
                key={annotation.id}
                className="border rounded p-3 hover:bg-accent/50 group cursor-pointer"
                onClick={() => handleAnnotationClick(annotation)}
              >
                <div className="flex items-start gap-2">
                  <div 
                    className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                    style={{ backgroundColor: getAnnotationColor(annotation) }}
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-muted-foreground">
                        {getAnnotationTypeLabel(annotation.type)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Page {annotation.pageId.replace('page_', '')}
                      </span>
                    </div>
                    
                    {editingId === annotation.id ? (
                      <div className="space-y-2">
                        <Input
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') saveEdit();
                            if (e.key === 'Escape') cancelEdit();
                          }}
                          className="text-sm"
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={saveEdit}
                            className="h-6 text-xs"
                          >
                            Save
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={cancelEdit}
                            className="h-6 text-xs"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm">
                        {annotation.properties.text || 'No text content'}
                      </div>
                    )}
                    
                    <div className="text-xs text-muted-foreground mt-2">
                      {annotation.createdAt.toLocaleDateString()} {annotation.createdAt.toLocaleTimeString()}
                    </div>
                  </div>
                  
                  <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        startEdit(annotation);
                      }}
                      className="h-6 w-6"
                      title="Edit annotation"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Reply to annotation:', annotation.id);
                      }}
                      className="h-6 w-6"
                      title="Reply to annotation"
                    >
                      <Reply className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeAnnotation(annotation.id);
                      }}
                      className="h-6 w-6 hover:text-destructive"
                      title="Delete annotation"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No annotations yet</p>
            <p className="text-xs">Add text or notes to see them here</p>
          </div>
        )}
      </div>
    </div>
  );
}