import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Annotation, AnnotationType, AnnotationProperties } from '@/types';

interface AnnotationStore {
  // State
  annotations: Annotation[];
  selectedAnnotations: string[];
  activeAnnotation: string | null;
  isDrawing: boolean;
  currentProperties: AnnotationProperties;
  
  // Actions
  addAnnotation: (annotation: Annotation) => void;
  updateAnnotation: (id: string, updates: Partial<Annotation>) => void;
  removeAnnotation: (id: string) => void;
  removeAnnotations: (ids: string[]) => void;
  
  // Selection
  selectAnnotation: (id: string) => void;
  selectAnnotations: (ids: string[]) => void;
  addToSelection: (id: string) => void;
  removeFromSelection: (id: string) => void;
  clearSelection: () => void;
  
  // Active annotation
  setActiveAnnotation: (id: string | null) => void;
  
  // Drawing state
  setIsDrawing: (drawing: boolean) => void;
  
  // Properties
  setCurrentProperties: (properties: AnnotationProperties) => void;
  updateCurrentProperty: <K extends keyof AnnotationProperties>(
    key: K,
    value: AnnotationProperties[K]
  ) => void;
  
  // Bulk operations
  duplicateAnnotations: (ids: string[]) => void;
  moveAnnotations: (ids: string[], deltaX: number, deltaY: number) => void;
  resizeAnnotation: (id: string, width: number, height: number) => void;
  
  // Filtering
  getAnnotationsByPage: (pageId: string) => Annotation[];
  getAnnotationsByType: (type: AnnotationType) => Annotation[];
  
  // Reset
  reset: () => void;
}

const defaultProperties: AnnotationProperties = {
  color: '#000000',
  fontSize: 14,
  fontFamily: 'Arial',
  fontWeight: 'normal',
  backgroundColor: 'transparent',
  borderWidth: 1,
  borderColor: '#000000',
  opacity: 1,
};

export const useAnnotationStore = create<AnnotationStore>()(
  devtools(
    (set, get) => ({
      annotations: [],
      selectedAnnotations: [],
      activeAnnotation: null,
      isDrawing: false,
      currentProperties: defaultProperties,

      addAnnotation: (annotation) => set((state) => ({
        annotations: [...state.annotations, annotation],
      })),

      updateAnnotation: (id, updates) => set((state) => ({
        annotations: state.annotations.map(ann =>
          ann.id === id 
            ? { ...ann, ...updates, updatedAt: new Date() }
            : ann
        ),
      })),

      removeAnnotation: (id) => set((state) => ({
        annotations: state.annotations.filter(ann => ann.id !== id),
        selectedAnnotations: state.selectedAnnotations.filter(selId => selId !== id),
        activeAnnotation: state.activeAnnotation === id ? null : state.activeAnnotation,
      })),

      removeAnnotations: (ids) => set((state) => ({
        annotations: state.annotations.filter(ann => !ids.includes(ann.id)),
        selectedAnnotations: state.selectedAnnotations.filter(selId => !ids.includes(selId)),
        activeAnnotation: ids.includes(state.activeAnnotation || '') ? null : state.activeAnnotation,
      })),

      selectAnnotation: (id) => set({
        selectedAnnotations: [id],
        activeAnnotation: id,
      }),

      selectAnnotations: (ids) => set({
        selectedAnnotations: ids,
        activeAnnotation: ids[0] || null,
      }),

      addToSelection: (id) => set((state) => ({
        selectedAnnotations: [...state.selectedAnnotations, id],
      })),

      removeFromSelection: (id) => set((state) => ({
        selectedAnnotations: state.selectedAnnotations.filter(selId => selId !== id),
        activeAnnotation: state.activeAnnotation === id ? null : state.activeAnnotation,
      })),

      clearSelection: () => set({
        selectedAnnotations: [],
        activeAnnotation: null,
      }),

      setActiveAnnotation: (id) => set({ activeAnnotation: id }),

      setIsDrawing: (drawing) => set({ isDrawing: drawing }),

      setCurrentProperties: (properties) => set({ currentProperties: properties }),

      updateCurrentProperty: (key, value) => set((state) => ({
        currentProperties: {
          ...state.currentProperties,
          [key]: value,
        },
      })),

      duplicateAnnotations: (ids) => set((state) => {
        const annotationsToDuplicate = state.annotations.filter(ann => ids.includes(ann.id));
        const duplicatedAnnotations = annotationsToDuplicate.map(ann => ({
          ...ann,
          id: `${ann.id}_copy_${Date.now()}`,
          x: ann.x + 20,
          y: ann.y + 20,
          createdAt: new Date(),
          updatedAt: new Date(),
        }));
        
        return {
          annotations: [...state.annotations, ...duplicatedAnnotations],
        };
      }),

      moveAnnotations: (ids, deltaX, deltaY) => set((state) => ({
        annotations: state.annotations.map(ann =>
          ids.includes(ann.id)
            ? { ...ann, x: ann.x + deltaX, y: ann.y + deltaY, updatedAt: new Date() }
            : ann
        ),
      })),

      resizeAnnotation: (id, width, height) => set((state) => ({
        annotations: state.annotations.map(ann =>
          ann.id === id
            ? { ...ann, width, height, updatedAt: new Date() }
            : ann
        ),
      })),

      getAnnotationsByPage: (pageId) => {
        const { annotations } = get();
        return annotations.filter(ann => ann.pageId === pageId);
      },

      getAnnotationsByType: (type) => {
        const { annotations } = get();
        return annotations.filter(ann => ann.type === type);
      },

      reset: () => set({
        annotations: [],
        selectedAnnotations: [],
        activeAnnotation: null,
        isDrawing: false,
        currentProperties: defaultProperties,
      }),
    }),
    {
      name: 'annotation-store',
    }
  )
);