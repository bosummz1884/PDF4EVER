import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { FileItem, CloudProvider, BatchOperation } from '@/types';

interface FileStore {
  // State
  files: FileItem[];
  uploadProgress: Record<string, number>;
  cloudProviders: CloudProvider[];
  batchOperations: BatchOperation[];
  
  // Actions
  addFile: (file: FileItem) => void;
  removeFile: (fileId: string) => void;
  updateFile: (fileId: string, updates: Partial<FileItem>) => void;
  setFiles: (files: FileItem[]) => void;
  
  // Upload management
  setUploadProgress: (fileId: string, progress: number) => void;
  setFileUploading: (fileId: string, uploading: boolean) => void;
  setFileError: (fileId: string, error: string | null) => void;
  
  // Cloud providers
  addCloudProvider: (provider: CloudProvider) => void;
  updateCloudProvider: (providerId: string, updates: Partial<CloudProvider>) => void;
  removeCloudProvider: (providerId: string) => void;
  
  // Batch operations
  addBatchOperation: (operation: BatchOperation) => void;
  updateBatchOperation: (operationId: string, updates: Partial<BatchOperation>) => void;
  removeBatchOperation: (operationId: string) => void;
  
  // Utility
  getFileById: (fileId: string) => FileItem | null;
  getUploadingFiles: () => FileItem[];
  getCompletedFiles: () => FileItem[];
  getFilesWithErrors: () => FileItem[];
  getTotalUploadProgress: () => number;
  
  // Reset
  reset: () => void;
}

const defaultCloudProviders: CloudProvider[] = [
  {
    id: 'google-drive',
    name: 'Google Drive',
    icon: 'Drive',
    isConnected: false,
    config: {},
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    icon: 'Dropbox',
    isConnected: false,
    config: {},
  },
  {
    id: 'onedrive',
    name: 'OneDrive',
    icon: 'Cloud',
    isConnected: false,
    config: {},
  },
];

export const useFileStore = create<FileStore>()(
  devtools(
    (set, get) => ({
      files: [],
      uploadProgress: {},
      cloudProviders: defaultCloudProviders,
      batchOperations: [],

      addFile: (file) => set((state) => ({
        files: [...state.files, file],
      })),

      removeFile: (fileId) => set((state) => ({
        files: state.files.filter(file => file.id !== fileId),
        uploadProgress: Object.fromEntries(
          Object.entries(state.uploadProgress).filter(([id]) => id !== fileId)
        ),
      })),

      updateFile: (fileId, updates) => set((state) => ({
        files: state.files.map(file =>
          file.id === fileId ? { ...file, ...updates } : file
        ),
      })),

      setFiles: (files) => set({ files }),

      setUploadProgress: (fileId, progress) => set((state) => ({
        uploadProgress: {
          ...state.uploadProgress,
          [fileId]: progress,
        },
      })),

      setFileUploading: (fileId, uploading) => set((state) => ({
        files: state.files.map(file =>
          file.id === fileId ? { ...file, isUploading: uploading } : file
        ),
      })),

      setFileError: (fileId, error) => set((state) => ({
        files: state.files.map(file =>
          file.id === fileId ? { ...file, error: error || undefined } : file
        ),
      })),

      addCloudProvider: (provider) => set((state) => ({
        cloudProviders: [...state.cloudProviders, provider],
      })),

      updateCloudProvider: (providerId, updates) => set((state) => ({
        cloudProviders: state.cloudProviders.map(provider =>
          provider.id === providerId ? { ...provider, ...updates } : provider
        ),
      })),

      removeCloudProvider: (providerId) => set((state) => ({
        cloudProviders: state.cloudProviders.filter(provider => provider.id !== providerId),
      })),

      addBatchOperation: (operation) => set((state) => ({
        batchOperations: [...state.batchOperations, operation],
      })),

      updateBatchOperation: (operationId, updates) => set((state) => ({
        batchOperations: state.batchOperations.map(operation =>
          operation.id === operationId ? { ...operation, ...updates } : operation
        ),
      })),

      removeBatchOperation: (operationId) => set((state) => ({
        batchOperations: state.batchOperations.filter(operation => operation.id !== operationId),
      })),

      getFileById: (fileId) => {
        const { files } = get();
        return files.find(file => file.id === fileId) || null;
      },

      getUploadingFiles: () => {
        const { files } = get();
        return files.filter(file => file.isUploading);
      },

      getCompletedFiles: () => {
        const { files } = get();
        return files.filter(file => !file.isUploading && !file.error);
      },

      getFilesWithErrors: () => {
        const { files } = get();
        return files.filter(file => file.error);
      },

      getTotalUploadProgress: () => {
        const { files, uploadProgress } = get();
        const uploadingFiles = files.filter(file => file.isUploading);
        
        if (uploadingFiles.length === 0) return 100;
        
        const totalProgress = uploadingFiles.reduce((sum, file) => {
          return sum + (uploadProgress[file.id] || 0);
        }, 0);
        
        return Math.round(totalProgress / uploadingFiles.length);
      },

      reset: () => set({
        files: [],
        uploadProgress: {},
        cloudProviders: defaultCloudProviders,
        batchOperations: [],
      }),
    }),
    {
      name: 'file-store',
    }
  )
);