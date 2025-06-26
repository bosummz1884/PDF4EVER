import { useState, useCallback, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Cloud, 
  Upload, 
  Download, 
  Folder, 
  File, 
  Search,
  Settings,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { CloudStorageConfig, CloudFile, UploadProgress } from '../../types/advanced';
import { CloudStorageService } from '../../services/cloudStorage';
import { useFileStore } from '../../stores/fileStore';

interface CloudStorageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'upload' | 'download' | 'manage';
}

export function CloudStorageDialog({ open, onOpenChange, mode }: CloudStorageDialogProps) {
  const { files, addFile } = useFileStore();
  const [cloudService] = useState(new CloudStorageService());
  
  const [activeProvider, setActiveProvider] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string>('');
  
  const [cloudFiles, setCloudFiles] = useState<CloudFile[]>([]);
  const [currentPath, setCurrentPath] = useState('/');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  
  const [uploadProgress, setUploadProgress] = useState<Record<string, UploadProgress>>({});
  
  const [credentials, setCredentials] = useState({
    accessToken: '',
    apiKey: '',
    clientId: '',
    clientSecret: '',
  });

  const providers = [
    { id: 'google-drive', name: 'Google Drive', icon: '📁' },
    { id: 'dropbox', name: 'Dropbox', icon: '📦' },
    { id: 'onedrive', name: 'OneDrive', icon: '☁️' },
  ];

  const connectProvider = useCallback(async (providerId: string) => {
    setIsConnecting(true);
    setConnectionError('');

    try {
      const config: CloudStorageConfig = {
        provider: providerId as any,
        credentials: {
          ...credentials,
          ...(providerId === 'google-drive' && {
            accessToken: credentials.accessToken,
            apiKey: credentials.apiKey,
          }),
          ...(providerId === 'dropbox' && {
            accessToken: credentials.accessToken,
          }),
        },
        settings: {
          autoSync: false,
          conflictResolution: 'local',
          maxFileSize: 100 * 1024 * 1024, // 100MB
          allowedFormats: ['pdf', 'doc', 'docx', 'txt'],
        },
      };

      await cloudService.connectProvider(config);
      setIsConnected(true);
      setActiveProvider(providerId);
      
      // Load initial files
      await loadFiles('/');
    } catch (error) {
      setConnectionError(error instanceof Error ? error.message : 'Connection failed');
    } finally {
      setIsConnecting(false);
    }
  }, [credentials, cloudService]);

  const loadFiles = useCallback(async (path: string = '/') => {
    if (!isConnected || !activeProvider) return;

    setIsLoading(true);
    try {
      const provider = cloudService.getProvider(activeProvider);
      const files = await provider.listFiles(path);
      setCloudFiles(files);
      setCurrentPath(path);
    } catch (error) {
      console.error('Failed to load files:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, activeProvider, cloudService]);

  const searchFiles = useCallback(async (query: string) => {
    if (!isConnected || !activeProvider || !query.trim()) return;

    setIsLoading(true);
    try {
      const provider = cloudService.getProvider(activeProvider);
      const results = await provider.searchFiles(query);
      setCloudFiles(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, activeProvider, cloudService]);

  const uploadFiles = useCallback(async (filesToUpload: File[]) => {
    if (!isConnected || !activeProvider) return;

    const provider = cloudService.getProvider(activeProvider);

    for (const file of filesToUpload) {
      try {
        const cloudFile = await provider.uploadFile(
          file,
          currentPath,
          (progress) => {
            setUploadProgress(prev => ({
              ...prev,
              [file.name]: progress,
            }));
          }
        );

        // Add uploaded file to local store
        addFile({
          id: cloudFile.id,
          name: cloudFile.name,
          file: file,
          size: file.size,
          type: file.type,
          lastModified: new Date(),
          uploadProgress: 100,
          isUploading: false,
          cloudProvider: activeProvider,
          cloudPath: cloudFile.path,
        });

        // Remove from progress tracking
        setUploadProgress(prev => {
          const updated = { ...prev };
          delete updated[file.name];
          return updated;
        });
      } catch (error) {
        console.error(`Upload failed for ${file.name}:`, error);
      }
    }

    // Refresh file list
    await loadFiles(currentPath);
  }, [isConnected, activeProvider, currentPath, cloudService, addFile]);

  const downloadFiles = useCallback(async (fileIds: string[]) => {
    if (!isConnected || !activeProvider) return;

    const provider = cloudService.getProvider(activeProvider);

    for (const fileId of fileIds) {
      try {
        const blob = await provider.downloadFile(fileId);
        const cloudFile = cloudFiles.find(f => f.id === fileId);
        
        if (cloudFile) {
          const file = new File([blob], cloudFile.name, { type: cloudFile.mimeType });
          
          addFile({
            id: cloudFile.id,
            name: cloudFile.name,
            file: file,
            size: file.size,
            type: file.type,
            lastModified: new Date(),
            uploadProgress: 100,
            isUploading: false,
            cloudProvider: activeProvider,
            cloudPath: cloudFile.path,
          });
        }
      } catch (error) {
        console.error(`Download failed for ${fileId}:`, error);
      }
    }
  }, [isConnected, activeProvider, cloudFiles, cloudService, addFile]);

  const handleFileSelect = useCallback((fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  }, []);

  useEffect(() => {
    if (open && isConnected) {
      loadFiles(currentPath);
    }
  }, [open, isConnected, loadFiles, currentPath]);

  const renderConnectionTab = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Cloud Storage Provider</Label>
        <Select value={activeProvider} onValueChange={setActiveProvider}>
          <SelectTrigger>
            <SelectValue placeholder="Select a provider" />
          </SelectTrigger>
          <SelectContent>
            {providers.map(provider => (
              <SelectItem key={provider.id} value={provider.id}>
                {provider.icon} {provider.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {activeProvider && (
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>Access Token</Label>
            <Input
              type="password"
              value={credentials.accessToken}
              onChange={(e) => setCredentials(prev => ({ ...prev, accessToken: e.target.value }))}
              placeholder="Enter your access token"
            />
          </div>

          {activeProvider === 'google-drive' && (
            <div className="space-y-2">
              <Label>API Key (Optional)</Label>
              <Input
                value={credentials.apiKey}
                onChange={(e) => setCredentials(prev => ({ ...prev, apiKey: e.target.value }))}
                placeholder="Enter your API key"
              />
            </div>
          )}

          {connectionError && (
            <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              <AlertCircle className="h-4 w-4" />
              {connectionError}
            </div>
          )}

          <Button 
            onClick={() => connectProvider(activeProvider)}
            disabled={isConnecting || !credentials.accessToken}
            className="w-full"
          >
            {isConnecting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : isConnected ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Connected
              </>
            ) : (
              <>
                <Cloud className="h-4 w-4 mr-2" />
                Connect
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );

  const renderFilesTab = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search files..."
            onKeyDown={(e) => e.key === 'Enter' && searchFiles(searchQuery)}
          />
        </div>
        <Button variant="outline" onClick={() => searchFiles(searchQuery)}>
          <Search className="h-4 w-4" />
        </Button>
        <Button variant="outline" onClick={() => loadFiles(currentPath)}>
          Refresh
        </Button>
      </div>

      <div className="text-sm text-muted-foreground">
        Current path: {currentPath}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <div className="max-h-96 overflow-y-auto space-y-1">
          {cloudFiles.map(file => (
            <div
              key={file.id}
              className={`flex items-center gap-3 p-2 rounded hover:bg-accent cursor-pointer ${
                selectedFiles.includes(file.id) ? 'bg-accent' : ''
              }`}
              onClick={() => handleFileSelect(file.id)}
            >
              <input
                type="checkbox"
                checked={selectedFiles.includes(file.id)}
                onChange={() => handleFileSelect(file.id)}
                className="rounded"
              />
              
              {file.mimeType.includes('folder') ? (
                <Folder className="h-4 w-4 text-blue-500" />
              ) : (
                <File className="h-4 w-4 text-gray-500" />
              )}
              
              <div className="flex-1">
                <div className="font-medium">{file.name}</div>
                <div className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB • {file.modifiedDate.toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {mode === 'download' && selectedFiles.length > 0 && (
        <Button onClick={() => downloadFiles(selectedFiles)} className="w-full">
          <Download className="h-4 w-4 mr-2" />
          Download Selected ({selectedFiles.length})
        </Button>
      )}
    </div>
  );

  const renderUploadTab = () => (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p className="text-sm text-muted-foreground">
          Drag and drop files here or click to select
        </p>
        <input
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.txt"
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            if (files.length > 0) {
              uploadFiles(files);
            }
          }}
          className="hidden"
          id="file-upload"
        />
        <Button variant="outline" className="mt-4" asChild>
          <label htmlFor="file-upload" className="cursor-pointer">
            Select Files
          </label>
        </Button>
      </div>

      {Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-2">
          <Label>Upload Progress</Label>
          {Object.entries(uploadProgress).map(([filename, progress]) => (
            <div key={filename} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{filename}</span>
                <span>{progress.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${progress.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Cloud Storage
          </DialogTitle>
        </DialogHeader>

        {!isConnected ? (
          renderConnectionTab()
        ) : (
          <Tabs defaultValue={mode === 'upload' ? 'upload' : 'files'} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="files">Browse</TabsTrigger>
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="files" className="space-y-4">
              {renderFilesTab()}
            </TabsContent>

            <TabsContent value="upload" className="space-y-4">
              {renderUploadTab()}
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Connected to {providers.find(p => p.id === activeProvider)?.name}</div>
                    <div className="text-sm text-muted-foreground">Status: Connected</div>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsConnected(false);
                      setActiveProvider('');
                      cloudService.disconnectProvider(activeProvider);
                    }}
                  >
                    Disconnect
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Auto-sync</Label>
                  <div className="text-sm text-muted-foreground">
                    Automatically sync changes between local and cloud storage
                  </div>
                  <input type="checkbox" className="rounded" />
                </div>

                <div className="space-y-2">
                  <Label>Conflict Resolution</Label>
                  <Select defaultValue="local">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="local">Prefer Local</SelectItem>
                      <SelectItem value="remote">Prefer Remote</SelectItem>
                      <SelectItem value="manual">Ask Each Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}