import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Theme, CloudStorageConfig, Plugin } from '../types/advanced';

interface SettingsStore {
  // UI Preferences
  theme: Theme;
  language: string;
  autoSave: boolean;
  autoSaveInterval: number;
  showWelcomeScreen: boolean;
  
  // Viewer Settings
  defaultZoom: number;
  defaultViewMode: 'single' | 'continuous' | 'facing' | 'book';
  smoothScrolling: boolean;
  enableThumbnails: boolean;
  thumbnailSize: 'small' | 'medium' | 'large';
  
  // Performance Settings
  maxMemoryUsage: number;
  enableGPUAcceleration: boolean;
  preloadPages: number;
  cacheSize: number;
  
  // Security Settings
  rememberPasswords: boolean;
  enableEncryptionByDefault: boolean;
  defaultPermissions: Record<string, boolean>;
  
  // Cloud Storage
  cloudProviders: CloudStorageConfig[];
  defaultCloudProvider?: string;
  
  // Plugins
  enabledPlugins: Plugin[];
  pluginSettings: Record<string, any>;
  
  // Export Defaults
  defaultExportFormat: string;
  defaultCompressionLevel: number;
  includeMetadataByDefault: boolean;
  
  // Annotation Defaults
  defaultAnnotationColor: string;
  defaultTextSize: number;
  defaultOpacity: number;
  
  // Keyboard Shortcuts
  keyboardShortcuts: Record<string, string>;
  
  // Actions
  updateTheme: (theme: Theme) => void;
  updateLanguage: (language: string) => void;
  updateAutoSave: (enabled: boolean, interval?: number) => void;
  updateViewerSettings: (settings: Partial<SettingsStore>) => void;
  updatePerformanceSettings: (settings: Partial<SettingsStore>) => void;
  updateSecuritySettings: (settings: Partial<SettingsStore>) => void;
  addCloudProvider: (config: CloudStorageConfig) => void;
  removeCloudProvider: (providerId: string) => void;
  updateCloudProvider: (providerId: string, config: Partial<CloudStorageConfig>) => void;
  enablePlugin: (pluginId: string) => void;
  disablePlugin: (pluginId: string) => void;
  updatePluginSettings: (pluginId: string, settings: any) => void;
  updateExportDefaults: (settings: Partial<SettingsStore>) => void;
  updateAnnotationDefaults: (settings: Partial<SettingsStore>) => void;
  updateKeyboardShortcut: (action: string, shortcut: string) => void;
  resetToDefaults: () => void;
}

const defaultTheme: Theme = {
  name: 'light',
  colors: {
    primary: '#3b82f6',
    secondary: '#64748b',
    background: '#ffffff',
    foreground: '#0f172a',
    accent: '#f1f5f9',
    muted: '#64748b',
    border: '#e2e8f0',
  },
};

const defaultKeyboardShortcuts = {
  'file.open': 'Ctrl+O',
  'file.save': 'Ctrl+S',
  'file.export': 'Ctrl+E',
  'edit.undo': 'Ctrl+Z',
  'edit.redo': 'Ctrl+Y',
  'view.zoomIn': 'Ctrl+Plus',
  'view.zoomOut': 'Ctrl+Minus',
  'view.fitWidth': 'Ctrl+1',
  'view.fitPage': 'Ctrl+2',
  'navigation.nextPage': 'ArrowRight',
  'navigation.previousPage': 'ArrowLeft',
  'navigation.firstPage': 'Ctrl+Home',
  'navigation.lastPage': 'Ctrl+End',
  'annotation.text': 'T',
  'annotation.highlight': 'H',
  'annotation.rectangle': 'R',
  'annotation.circle': 'C',
  'tool.select': 'S',
  'tool.hand': 'H',
};

const initialState = {
  theme: defaultTheme,
  language: 'en',
  autoSave: true,
  autoSaveInterval: 30000, // 30 seconds
  showWelcomeScreen: true,
  defaultZoom: 100,
  defaultViewMode: 'single' as const,
  smoothScrolling: true,
  enableThumbnails: true,
  thumbnailSize: 'medium' as const,
  maxMemoryUsage: 512, // MB
  enableGPUAcceleration: true,
  preloadPages: 3,
  cacheSize: 100, // MB
  rememberPasswords: false,
  enableEncryptionByDefault: false,
  defaultPermissions: {
    printing: true,
    copying: true,
    editing: true,
    extracting: false,
  },
  cloudProviders: [],
  defaultCloudProvider: undefined,
  enabledPlugins: [],
  pluginSettings: {},
  defaultExportFormat: 'pdf',
  defaultCompressionLevel: 5,
  includeMetadataByDefault: true,
  defaultAnnotationColor: '#ffff00',
  defaultTextSize: 14,
  defaultOpacity: 0.7,
  keyboardShortcuts: defaultKeyboardShortcuts,
};

export const useSettingsStore = create<SettingsStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        updateTheme: (theme) => set({ theme }),

        updateLanguage: (language) => set({ language }),

        updateAutoSave: (enabled, interval) => set({
          autoSave: enabled,
          ...(interval && { autoSaveInterval: interval }),
        }),

        updateViewerSettings: (settings) => set((state) => ({ ...state, ...settings })),

        updatePerformanceSettings: (settings) => set((state) => ({ ...state, ...settings })),

        updateSecuritySettings: (settings) => set((state) => ({ ...state, ...settings })),

        addCloudProvider: (config) => set((state) => ({
          cloudProviders: [...state.cloudProviders, config],
        })),

        removeCloudProvider: (providerId) => set((state) => ({
          cloudProviders: state.cloudProviders.filter(p => p.provider !== providerId),
          defaultCloudProvider: state.defaultCloudProvider === providerId ? undefined : state.defaultCloudProvider,
        })),

        updateCloudProvider: (providerId, config) => set((state) => ({
          cloudProviders: state.cloudProviders.map(p =>
            p.provider === providerId ? { ...p, ...config } : p
          ),
        })),

        enablePlugin: (pluginId) => set((state) => {
          const plugin = state.enabledPlugins.find(p => p.id === pluginId);
          if (!plugin) return state;
          
          return {
            enabledPlugins: state.enabledPlugins.map(p =>
              p.id === pluginId ? { ...p, enabled: true } : p
            ),
          };
        }),

        disablePlugin: (pluginId) => set((state) => ({
          enabledPlugins: state.enabledPlugins.map(p =>
            p.id === pluginId ? { ...p, enabled: false } : p
          ),
        })),

        updatePluginSettings: (pluginId, settings) => set((state) => ({
          pluginSettings: {
            ...state.pluginSettings,
            [pluginId]: { ...state.pluginSettings[pluginId], ...settings },
          },
        })),

        updateExportDefaults: (settings) => set((state) => ({ ...state, ...settings })),

        updateAnnotationDefaults: (settings) => set((state) => ({ ...state, ...settings })),

        updateKeyboardShortcut: (action, shortcut) => set((state) => ({
          keyboardShortcuts: {
            ...state.keyboardShortcuts,
            [action]: shortcut,
          },
        })),

        resetToDefaults: () => set(initialState),
      }),
      {
        name: 'pdf-editor-settings',
        partialize: (state) => ({
          theme: state.theme,
          language: state.language,
          autoSave: state.autoSave,
          autoSaveInterval: state.autoSaveInterval,
          showWelcomeScreen: state.showWelcomeScreen,
          defaultZoom: state.defaultZoom,
          defaultViewMode: state.defaultViewMode,
          smoothScrolling: state.smoothScrolling,
          enableThumbnails: state.enableThumbnails,
          thumbnailSize: state.thumbnailSize,
          maxMemoryUsage: state.maxMemoryUsage,
          enableGPUAcceleration: state.enableGPUAcceleration,
          preloadPages: state.preloadPages,
          cacheSize: state.cacheSize,
          rememberPasswords: state.rememberPasswords,
          enableEncryptionByDefault: state.enableEncryptionByDefault,
          defaultPermissions: state.defaultPermissions,
          cloudProviders: state.cloudProviders,
          defaultCloudProvider: state.defaultCloudProvider,
          enabledPlugins: state.enabledPlugins,
          pluginSettings: state.pluginSettings,
          defaultExportFormat: state.defaultExportFormat,
          defaultCompressionLevel: state.defaultCompressionLevel,
          includeMetadataByDefault: state.includeMetadataByDefault,
          defaultAnnotationColor: state.defaultAnnotationColor,
          defaultTextSize: state.defaultTextSize,
          defaultOpacity: state.defaultOpacity,
          keyboardShortcuts: state.keyboardShortcuts,
        }),
      }
    ),
    {
      name: 'settings-store',
    }
  )
);