import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { PDFDocument, PDFPage, Annotation, FormField, Signature } from '@/types';

interface PDFStore {
  // State
  documents: PDFDocument[];
  currentDocument: PDFDocument | null;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  isProcessing: boolean;

  // Actions
  setDocuments: (documents: PDFDocument[]) => void;
  addDocument: (document: PDFDocument) => void;
  removeDocument: (documentId: string) => void;
  setCurrentDocument: (document: PDFDocument | null) => void;
  updateDocument: (documentId: string, updates: Partial<PDFDocument>) => void;
  
  // Page management
  setCurrentPage: (page: number) => void;
  addPage: (page: PDFPage, index?: number) => void;
  removePage: (pageId: string) => void;
  reorderPages: (fromIndex: number, toIndex: number) => void;
  rotatePage: (pageId: string, rotation: number) => void;
  
  // Annotations
  addAnnotation: (annotation: Annotation) => void;
  updateAnnotation: (annotationId: string, updates: Partial<Annotation>) => void;
  removeAnnotation: (annotationId: string) => void;
  getAnnotationsForPage: (pageId: string) => Annotation[];
  
  // Forms
  addFormField: (field: FormField) => void;
  updateFormField: (fieldId: string, updates: Partial<FormField>) => void;
  removeFormField: (fieldId: string) => void;
  getFormFieldsForPage: (pageId: string) => FormField[];
  
  // Signatures
  addSignature: (signature: Signature) => void;
  updateSignature: (signatureId: string, updates: Partial<Signature>) => void;
  removeSignature: (signatureId: string) => void;
  getSignaturesForPage: (pageId: string) => Signature[];
  
  // Utility actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setProcessing: (processing: boolean) => void;
  clearError: () => void;
  reset: () => void;
}

const initialState = {
  documents: [],
  currentDocument: null,
  currentPage: 1,
  totalPages: 0,
  loading: false,
  error: null,
  isProcessing: false,
};

export const usePDFStore = create<PDFStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setDocuments: (documents) => set({ documents }),

      addDocument: (document) => set((state) => ({
        documents: [...state.documents, document],
      })),

      removeDocument: (documentId) => set((state) => ({
        documents: state.documents.filter(doc => doc.id !== documentId),
        currentDocument: state.currentDocument?.id === documentId ? null : state.currentDocument,
      })),

      setCurrentDocument: (document) => set({
        currentDocument: document,
        currentPage: 1,
        totalPages: document?.pages.length || 0,
      }),

      updateDocument: (documentId, updates) => set((state) => ({
        documents: state.documents.map(doc =>
          doc.id === documentId ? { ...doc, ...updates, updatedAt: new Date() } : doc
        ),
        currentDocument: state.currentDocument?.id === documentId
          ? { ...state.currentDocument, ...updates, updatedAt: new Date() }
          : state.currentDocument,
      })),

      setCurrentPage: (page) => set({ currentPage: page }),

      addPage: (page, index) => set((state) => {
        if (!state.currentDocument) return state;
        
        const pages = [...state.currentDocument.pages];
        if (index !== undefined) {
          pages.splice(index, 0, page);
        } else {
          pages.push(page);
        }
        
        const updatedDocument = {
          ...state.currentDocument,
          pages,
          updatedAt: new Date(),
        };
        
        return {
          currentDocument: updatedDocument,
          documents: state.documents.map(doc =>
            doc.id === updatedDocument.id ? updatedDocument : doc
          ),
          totalPages: pages.length,
        };
      }),

      removePage: (pageId) => set((state) => {
        if (!state.currentDocument) return state;
        
        const pages = state.currentDocument.pages.filter(page => page.id !== pageId);
        const updatedDocument = {
          ...state.currentDocument,
          pages,
          annotations: state.currentDocument.annotations.filter(ann => ann.pageId !== pageId),
          forms: state.currentDocument.forms.filter(form => form.pageId !== pageId),
          signatures: state.currentDocument.signatures.filter(sig => sig.pageId !== pageId),
          updatedAt: new Date(),
        };
        
        return {
          currentDocument: updatedDocument,
          documents: state.documents.map(doc =>
            doc.id === updatedDocument.id ? updatedDocument : doc
          ),
          totalPages: pages.length,
          currentPage: Math.min(state.currentPage, pages.length),
        };
      }),

      reorderPages: (fromIndex, toIndex) => set((state) => {
        if (!state.currentDocument) return state;
        
        const pages = [...state.currentDocument.pages];
        const [movedPage] = pages.splice(fromIndex, 1);
        pages.splice(toIndex, 0, movedPage);
        
        // Update page numbers
        pages.forEach((page, index) => {
          page.pageNumber = index + 1;
        });
        
        const updatedDocument = {
          ...state.currentDocument,
          pages,
          updatedAt: new Date(),
        };
        
        return {
          currentDocument: updatedDocument,
          documents: state.documents.map(doc =>
            doc.id === updatedDocument.id ? updatedDocument : doc
          ),
        };
      }),

      rotatePage: (pageId, rotation) => set((state) => {
        if (!state.currentDocument) return state;
        
        const pages = state.currentDocument.pages.map(page =>
          page.id === pageId ? { ...page, rotation } : page
        );
        
        const updatedDocument = {
          ...state.currentDocument,
          pages,
          updatedAt: new Date(),
        };
        
        return {
          currentDocument: updatedDocument,
          documents: state.documents.map(doc =>
            doc.id === updatedDocument.id ? updatedDocument : doc
          ),
        };
      }),

      addAnnotation: (annotation) => set((state) => {
        if (!state.currentDocument) return state;
        
        const annotations = [...state.currentDocument.annotations, annotation];
        const updatedDocument = {
          ...state.currentDocument,
          annotations,
          updatedAt: new Date(),
        };
        
        return {
          currentDocument: updatedDocument,
          documents: state.documents.map(doc =>
            doc.id === updatedDocument.id ? updatedDocument : doc
          ),
        };
      }),

      updateAnnotation: (annotationId, updates) => set((state) => {
        if (!state.currentDocument) return state;
        
        const annotations = state.currentDocument.annotations.map(ann =>
          ann.id === annotationId ? { ...ann, ...updates, updatedAt: new Date() } : ann
        );
        
        const updatedDocument = {
          ...state.currentDocument,
          annotations,
          updatedAt: new Date(),
        };
        
        return {
          currentDocument: updatedDocument,
          documents: state.documents.map(doc =>
            doc.id === updatedDocument.id ? updatedDocument : doc
          ),
        };
      }),

      removeAnnotation: (annotationId) => set((state) => {
        if (!state.currentDocument) return state;
        
        const annotations = state.currentDocument.annotations.filter(ann => ann.id !== annotationId);
        const updatedDocument = {
          ...state.currentDocument,
          annotations,
          updatedAt: new Date(),
        };
        
        return {
          currentDocument: updatedDocument,
          documents: state.documents.map(doc =>
            doc.id === updatedDocument.id ? updatedDocument : doc
          ),
        };
      }),

      getAnnotationsForPage: (pageId) => {
        const { currentDocument } = get();
        return currentDocument?.annotations.filter(ann => ann.pageId === pageId) || [];
      },

      addFormField: (field) => set((state) => {
        if (!state.currentDocument) return state;
        
        const forms = [...state.currentDocument.forms, field];
        const updatedDocument = {
          ...state.currentDocument,
          forms,
          updatedAt: new Date(),
        };
        
        return {
          currentDocument: updatedDocument,
          documents: state.documents.map(doc =>
            doc.id === updatedDocument.id ? updatedDocument : doc
          ),
        };
      }),

      updateFormField: (fieldId, updates) => set((state) => {
        if (!state.currentDocument) return state;
        
        const forms = state.currentDocument.forms.map(field =>
          field.id === fieldId ? { ...field, ...updates } : field
        );
        
        const updatedDocument = {
          ...state.currentDocument,
          forms,
          updatedAt: new Date(),
        };
        
        return {
          currentDocument: updatedDocument,
          documents: state.documents.map(doc =>
            doc.id === updatedDocument.id ? updatedDocument : doc
          ),
        };
      }),

      removeFormField: (fieldId) => set((state) => {
        if (!state.currentDocument) return state;
        
        const forms = state.currentDocument.forms.filter(field => field.id !== fieldId);
        const updatedDocument = {
          ...state.currentDocument,
          forms,
          updatedAt: new Date(),
        };
        
        return {
          currentDocument: updatedDocument,
          documents: state.documents.map(doc =>
            doc.id === updatedDocument.id ? updatedDocument : doc
          ),
        };
      }),

      getFormFieldsForPage: (pageId) => {
        const { currentDocument } = get();
        return currentDocument?.forms.filter(field => field.pageId === pageId) || [];
      },

      addSignature: (signature) => set((state) => {
        if (!state.currentDocument) return state;
        
        const signatures = [...state.currentDocument.signatures, signature];
        const updatedDocument = {
          ...state.currentDocument,
          signatures,
          updatedAt: new Date(),
        };
        
        return {
          currentDocument: updatedDocument,
          documents: state.documents.map(doc =>
            doc.id === updatedDocument.id ? updatedDocument : doc
          ),
        };
      }),

      updateSignature: (signatureId, updates) => set((state) => {
        if (!state.currentDocument) return state;
        
        const signatures = state.currentDocument.signatures.map(sig =>
          sig.id === signatureId ? { ...sig, ...updates } : sig
        );
        
        const updatedDocument = {
          ...state.currentDocument,
          signatures,
          updatedAt: new Date(),
        };
        
        return {
          currentDocument: updatedDocument,
          documents: state.documents.map(doc =>
            doc.id === updatedDocument.id ? updatedDocument : doc
          ),
        };
      }),

      removeSignature: (signatureId) => set((state) => {
        if (!state.currentDocument) return state;
        
        const signatures = state.currentDocument.signatures.filter(sig => sig.id !== signatureId);
        const updatedDocument = {
          ...state.currentDocument,
          signatures,
          updatedAt: new Date(),
        };
        
        return {
          currentDocument: updatedDocument,
          documents: state.documents.map(doc =>
            doc.id === updatedDocument.id ? updatedDocument : doc
          ),
        };
      }),

      getSignaturesForPage: (pageId) => {
        const { currentDocument } = get();
        return currentDocument?.signatures.filter(sig => sig.pageId === pageId) || [];
      },

      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setProcessing: (processing) => set({ isProcessing: processing }),
      clearError: () => set({ error: null }),
      reset: () => set(initialState),
    }),
    {
      name: 'pdf-store',
    }
  )
);