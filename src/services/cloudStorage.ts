import { CloudStorageConfig, CloudFile, UploadProgress } from '../types/advanced';

export interface CloudStorageProvider {
  connect(config: CloudStorageConfig): Promise<void>;
  disconnect(): Promise<void>;
  listFiles(path?: string): Promise<CloudFile[]>;
  uploadFile(file: File, path: string, onProgress?: (progress: UploadProgress) => void): Promise<CloudFile>;
  downloadFile(fileId: string): Promise<Blob>;
  deleteFile(fileId: string): Promise<void>;
  createFolder(name: string, parentPath?: string): Promise<CloudFile>;
  searchFiles(query: string): Promise<CloudFile[]>;
  getFileInfo(fileId: string): Promise<CloudFile>;
  shareFile(fileId: string, permissions: 'read' | 'write'): Promise<string>;
}

class GoogleDriveProvider implements CloudStorageProvider {
  private accessToken: string | null = null;

  async connect(config: CloudStorageConfig): Promise<void> {
    this.accessToken = config.credentials.accessToken;
    
    if (!this.accessToken) {
      throw new Error('Google Drive access token required');
    }
  }


  async disconnect(): Promise<void> {
    this.accessToken = null;
  }

  async listFiles(path?: string): Promise<CloudFile[]> {
    if (!this.accessToken) throw new Error('Not connected');

    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q='${path || 'root'}'+in+parents&fields=files(id,name,size,modifiedTime,mimeType,webViewLink,thumbnailLink)`,
      {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to list files: ${response.statusText}`);
    }

    const data = await response.json();
    return data.files.map((file: any) => ({
      id: file.id,
      name: file.name,
      path: path || '/',
      size: parseInt(file.size) || 0,
      modifiedDate: new Date(file.modifiedTime),
      downloadUrl: file.webViewLink,
      thumbnailUrl: file.thumbnailLink,
      mimeType: file.mimeType,
      provider: 'google-drive',
    }));
  }

  async uploadFile(file: File, path: string, onProgress?: (progress: UploadProgress) => void): Promise<CloudFile> {
    if (!this.accessToken) throw new Error('Not connected');

    const metadata = {
      name: file.name,
      parents: [path],
    };

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', file);

    const xhr = new XMLHttpRequest();
    
    return new Promise((resolve, reject) => {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          onProgress({
            fileId: file.name,
            progress: Math.round((event.loaded / event.total) * 100),
            stage: 'uploading',
          });
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const result = JSON.parse(xhr.responseText);
          resolve({
            id: result.id,
            name: result.name,
            path,
            size: file.size,
            modifiedDate: new Date(),
            mimeType: file.type,
            provider: 'google-drive',
          });
        } else {
          reject(new Error(`Upload failed: ${xhr.statusText}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      xhr.open('POST', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart');
      xhr.setRequestHeader('Authorization', `Bearer ${this.accessToken}`);
      xhr.send(form);
    });
  }

  async downloadFile(fileId: string): Promise<Blob> {
    if (!this.accessToken) throw new Error('Not connected');

    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
      {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.statusText}`);
    }

    return await response.blob();
  }

  async deleteFile(fileId: string): Promise<void> {
    if (!this.accessToken) throw new Error('Not connected');

    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete file: ${response.statusText}`);
    }
  }

  async createFolder(name: string, parentPath?: string): Promise<CloudFile> {
    if (!this.accessToken) throw new Error('Not connected');

    const metadata = {
      name,
      mimeType: 'application/vnd.google-apps.folder',
      parents: parentPath ? [parentPath] : undefined,
    };

    const response = await fetch(
      'https://www.googleapis.com/drive/v3/files',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metadata),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to create folder: ${response.statusText}`);
    }

    const result = await response.json();
    return {
      id: result.id,
      name: result.name,
      path: parentPath || '/',
      size: 0,
      modifiedDate: new Date(),
      mimeType: 'application/vnd.google-apps.folder',
      provider: 'google-drive',
    };
  }

  async searchFiles(query: string): Promise<CloudFile[]> {
    if (!this.accessToken) throw new Error('Not connected');

    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=name+contains+'${query}'&fields=files(id,name,size,modifiedTime,mimeType,webViewLink,thumbnailLink)`,
      {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to search files: ${response.statusText}`);
    }

    const data = await response.json();
    return data.files.map((file: any) => ({
      id: file.id,
      name: file.name,
      path: '/',
      size: parseInt(file.size) || 0,
      modifiedDate: new Date(file.modifiedTime),
      downloadUrl: file.webViewLink,
      thumbnailUrl: file.thumbnailLink,
      mimeType: file.mimeType,
      provider: 'google-drive',
    }));
  }

  async getFileInfo(fileId: string): Promise<CloudFile> {
    if (!this.accessToken) throw new Error('Not connected');

    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?fields=id,name,size,modifiedTime,mimeType,webViewLink,thumbnailLink`,
      {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get file info: ${response.statusText}`);
    }

    const file = await response.json();
    return {
      id: file.id,
      name: file.name,
      path: '/',
      size: parseInt(file.size) || 0,
      modifiedDate: new Date(file.modifiedTime),
      downloadUrl: file.webViewLink,
      thumbnailUrl: file.thumbnailLink,
      mimeType: file.mimeType,
      provider: 'google-drive',
    };
  }

  async shareFile(fileId: string, permissions: 'read' | 'write'): Promise<string> {
    if (!this.accessToken) throw new Error('Not connected');

    const permissionData = {
      role: permissions === 'write' ? 'writer' : 'reader',
      type: 'anyone',
    };

    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}/permissions`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(permissionData),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to share file: ${response.statusText}`);
    }

    // Get the shareable link
    const fileInfo = await this.getFileInfo(fileId);
    return fileInfo.downloadUrl || '';
  }
}

class DropboxProvider implements CloudStorageProvider {
  private accessToken: string | null = null;

  async connect(config: CloudStorageConfig): Promise<void> {
    this.accessToken = config.credentials.accessToken;
    
    if (!this.accessToken) {
      throw new Error('Dropbox access token required');
    }
  }

  async disconnect(): Promise<void> {
    this.accessToken = null;
  }

  async listFiles(path: string = ''): Promise<CloudFile[]> {
    if (!this.accessToken) throw new Error('Not connected');

    const response = await fetch(
      'https://api.dropboxapi.com/2/files/list_folder',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: path || '',
          recursive: false,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to list files: ${response.statusText}`);
    }

    const data = await response.json();
    return data.entries.map((entry: any) => ({
      id: entry.id,
      name: entry.name,
      path: entry.path_lower,
      size: entry.size || 0,
      modifiedDate: new Date(entry.client_modified || entry.server_modified),
      mimeType: entry['.tag'] === 'folder' ? 'application/vnd.dropbox.folder' : 'application/octet-stream',
      provider: 'dropbox',
    }));
  }

  async uploadFile(file: File, path: string, _onProgress?: (progress: UploadProgress) => void): Promise<CloudFile> {
    if (!this.accessToken) throw new Error('Not connected');

    const fullPath = `${path}/${file.name}`;
    
    const response = await fetch(
      'https://content.dropboxapi.com/2/files/upload',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Dropbox-API-Arg': JSON.stringify({
            path: fullPath,
            mode: 'add',
            autorename: true,
          }),
          'Content-Type': 'application/octet-stream',
        },
        body: file,
      }
    );

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    return {
      id: result.id,
      name: result.name,
      path: result.path_lower,
      size: result.size,
      modifiedDate: new Date(result.client_modified),
      mimeType: file.type,
      provider: 'dropbox',
    };
  }

  async downloadFile(fileId: string): Promise<Blob> {
    if (!this.accessToken) throw new Error('Not connected');

    const response = await fetch(
      'https://content.dropboxapi.com/2/files/download',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Dropbox-API-Arg': JSON.stringify({
            path: fileId,
          }),
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.statusText}`);
    }

    return await response.blob();
  }

  async deleteFile(fileId: string): Promise<void> {
    if (!this.accessToken) throw new Error('Not connected');

    const response = await fetch(
      'https://api.dropboxapi.com/2/files/delete_v2',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: fileId,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete file: ${response.statusText}`);
    }
  }

  async createFolder(name: string, parentPath?: string): Promise<CloudFile> {
    if (!this.accessToken) throw new Error('Not connected');

    const fullPath = parentPath ? `${parentPath}/${name}` : `/${name}`;

    const response = await fetch(
      'https://api.dropboxapi.com/2/files/create_folder_v2',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: fullPath,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to create folder: ${response.statusText}`);
    }

    const result = await response.json();
    return {
      id: result.metadata.id,
      name: result.metadata.name,
      path: result.metadata.path_lower,
      size: 0,
      modifiedDate: new Date(),
      mimeType: 'application/vnd.dropbox.folder',
      provider: 'dropbox',
    };
  }

  async searchFiles(query: string): Promise<CloudFile[]> {
    if (!this.accessToken) throw new Error('Not connected');

    const response = await fetch(
      'https://api.dropboxapi.com/2/files/search_v2',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          options: {
            path: '',
            max_results: 100,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to search files: ${response.statusText}`);
    }

    const data = await response.json();
    return data.matches.map((match: any) => ({
      id: match.metadata.metadata.id,
      name: match.metadata.metadata.name,
      path: match.metadata.metadata.path_lower,
      size: match.metadata.metadata.size || 0,
      modifiedDate: new Date(match.metadata.metadata.client_modified || match.metadata.metadata.server_modified),
      mimeType: 'application/octet-stream',
      provider: 'dropbox',
    }));
  }

  async getFileInfo(fileId: string): Promise<CloudFile> {
    if (!this.accessToken) throw new Error('Not connected');

    const response = await fetch(
      'https://api.dropboxapi.com/2/files/get_metadata',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: fileId,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get file info: ${response.statusText}`);
    }

    const file = await response.json();
    return {
      id: file.id,
      name: file.name,
      path: file.path_lower,
      size: file.size || 0,
      modifiedDate: new Date(file.client_modified || file.server_modified),
      mimeType: 'application/octet-stream',
      provider: 'dropbox',
    };
  }

  async shareFile(fileId: string, permissions: 'read' | 'write'): Promise<string> {
    if (!this.accessToken) throw new Error('Not connected');

    const response = await fetch(
      'https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: fileId,
          settings: {
            requested_visibility: 'public',
            audience: 'public',
            access: permissions,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to share file: ${response.statusText}`);
    }

    const result = await response.json();
    return result.url;
  }
}

export class CloudStorageService {
  private providers: Map<string, CloudStorageProvider> = new Map();

  constructor() {
    this.providers.set('google-drive', new GoogleDriveProvider());
    this.providers.set('dropbox', new DropboxProvider());
  }

  getProvider(providerType: string): CloudStorageProvider {
    const provider = this.providers.get(providerType);
    if (!provider) {
      throw new Error(`Unsupported cloud storage provider: ${providerType}`);
    }
    return provider;
  }

  async connectProvider(config: CloudStorageConfig): Promise<void> {
    const provider = this.getProvider(config.provider);
    await provider.connect(config);
  }

  async disconnectProvider(providerType: string): Promise<void> {
    const provider = this.getProvider(providerType);
    await provider.disconnect();
  }
}