import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { UIState, ViewMode, Tool, ToolType } from '@/types';

interface UIStore extends UIState {
  // Actions
  setSidebarVisible: (visible: boolean) => void;
  setPropertiesVisible: (visible: boolean) => void;
  toggleSidebar: () => void;
  toggleProperties: () => void;
  
  // Tool management
  setCurrentTool: (toolId: string) => void;
  getCurrentTool: () => Tool | null;
  
  // Selection
  setSelectedAnnotations: (annotationIds: string[]) => void;
  addSelectedAnnotation: (annotationId: string) => void;
  removeSelectedAnnotation: (annotationId: string) => void;
  clearSelection: () => void;
  
  // View controls
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  fitToWidth: () => void;
  fitToPage: () => void;
  setViewMode: (mode: ViewMode) => void;
  
  // Panel controls
  setShowThumbnails: (show: boolean) => void;
  setShowOutline: (show: boolean) => void;
  toggleThumbnails: () => void;
  toggleOutline: () => void;
  
  // Page navigation
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  
  // Loading and error states
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Reset
  reset: () => void;
}

const tools: Tool[] = [
  {
    id: 'select',
    name: 'Select',
    icon: 'Mouse',
    type: 'select',
    isActive: true,
    properties: {},
  },
  {
    id: 'text',
    name: 'Text',
    icon: 'Type',
    type: 'text',
    isActive: false,
    properties: {
      color: '#000000',
      fontSize: 14,
    },
  },
  {
    id: 'highlight',
    name: 'Highlight',
    icon: 'Highlighter',
    type: 'highlight',
    isActive: false,
    properties: {
      color: '#ffff00',
      opacity: 0.3,
    },
  },
  {
    id: 'rectangle',
    name: 'Rectangle',
    icon: 'Square',
    type: 'shape',
    isActive: false,
    properties: {
      color: '#000000',
      strokeWidth: 2,
      shape: 'rectangle',
    },
  },
  {
    id: 'circle',
    name: 'Circle',
    icon: 'Circle',
    type: 'shape',
    isActive: false,
    properties: {
      color: '#000000',
      strokeWidth: 2,
      shape: 'circle',
    },
  },
  {
    id: 'line',
    name: 'Line',
    icon: 'Minus',
    type: 'line',
    isActive: false,
    properties: {
      color: '#000000',
      strokeWidth: 2,
    },
  },
  {
    id: 'arrow',
    name: 'Arrow',
    icon: 'ArrowRight',
    type: 'line',
    isActive: false,
    properties: {
      color: '#000000',
      strokeWidth: 2,
      shape: 'arrow',
    },
  },
  {
    id: 'freehand',
    name: 'Freehand',
    icon: 'Pen',
    type: 'freehand',
    isActive: false,
    properties: {
      color: '#000000',
      strokeWidth: 2,
    },
  },
  {
    id: 'eraser',
    name: 'Eraser',
    icon: 'Eraser',
    type: 'eraser',
    isActive: false,
    properties: {},
  },
  {
    id: 'signature',
    name: 'Signature',
    icon: 'PenTool',
    type: 'signature',
    isActive: false,
    properties: {},
  },
];

const initialState: UIState = {
  sidebarVisible: true,
  propertiesVisible: true,
  currentTool: 'select',
  selectedAnnotations: [],
  zoom: 100,
  viewMode: 'single',
  showThumbnails: true,
  showOutline: false,
  currentPage: 1,
  loading: false,
  error: null,
};

export const useUIStore = create<UIStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setSidebarVisible: (visible) => set({ sidebarVisible: visible }),
      setPropertiesVisible: (visible) => set({ propertiesVisible: visible }),
      toggleSidebar: () => set((state) => ({ sidebarVisible: !state.sidebarVisible })),
      toggleProperties: () => set((state) => ({ propertiesVisible: !state.propertiesVisible })),

      setCurrentTool: (toolId) => set({ currentTool: toolId }),
      getCurrentTool: () => {
        const { currentTool } = get();
        return tools.find(tool => tool.id === currentTool) || null;
      },

      setSelectedAnnotations: (annotationIds) => set({ selectedAnnotations: annotationIds }),
      addSelectedAnnotation: (annotationId) => set((state) => ({
        selectedAnnotations: [...state.selectedAnnotations, annotationId],
      })),
      removeSelectedAnnotation: (annotationId) => set((state) => ({
        selectedAnnotations: state.selectedAnnotations.filter(id => id !== annotationId),
      })),
      clearSelection: () => set({ selectedAnnotations: [] }),

      setZoom: (zoom) => set({ zoom: Math.max(25, Math.min(500, zoom)) }),
      zoomIn: () => set((state) => ({ zoom: Math.min(500, state.zoom + 25) })),
      zoomOut: () => set((state) => ({ zoom: Math.max(25, state.zoom - 25) })),
      fitToWidth: () => set({ zoom: 100 }), // Placeholder implementation
      fitToPage: () => set({ zoom: 100 }), // Placeholder implementation
      setViewMode: (mode) => set({ viewMode: mode }),

      setShowThumbnails: (show) => set({ showThumbnails: show }),
      setShowOutline: (show) => set({ showOutline: show }),
      toggleThumbnails: () => set((state) => ({ showThumbnails: !state.showThumbnails })),
      toggleOutline: () => set((state) => ({ showOutline: !state.showOutline })),

      goToPage: (page) => set({ currentPage: page }),
      nextPage: () => set((state) => ({ currentPage: state.currentPage + 1 })),
      previousPage: () => set((state) => ({ currentPage: Math.max(1, state.currentPage - 1) })),

      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      reset: () => set(initialState),
    }),
    {
      name: 'ui-store',
    }
  )
);

export { tools };