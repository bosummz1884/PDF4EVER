// Core PDF Types
export interface PDFDocument {
  id: string;
  name: string;
  file: File;
  pages: PDFPage[];
  metadata: PDFMetadata;
  annotations: Annotation[];
  forms: FormField[];
  signatures: Signature[];
  isEncrypted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PDFPage {
  id: string;
  pageNumber: number;
  width: number;
  height: number;
  rotation: number;
  annotations: Annotation[];
  thumbnail?: string;
}

export interface PDFMetadata {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string;
  creator?: string;
  producer?: string;
  creationDate?: Date;
  modificationDate?: Date;
  pageCount: number;
  fileSize: number;
}

// Annotation Types
export interface Annotation {
  id: string;
  type: AnnotationType;
  pageId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  properties: AnnotationProperties;
  createdAt: Date;
  updatedAt: Date;
}

export type AnnotationType = 
  | 'text'
  | 'highlight'
  | 'underline'
  | 'strikethrough'
  | 'rectangle'
  | 'circle'
  | 'line'
  | 'arrow'
  | 'freehand'
  | 'stamp'
  | 'image'
  | 'note';

export interface AnnotationProperties {
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  color: string;
  backgroundColor?: string;
  borderWidth?: number;
  borderColor?: string;
  strokeWidth?: number;
  opacity?: number;
  points?: Point[];
  imageData?: string;
}

export interface Point {
  x: number;
  y: number;
}

// Form Field Types
export interface FormField {
  id: string;
  type: FormFieldType;
  name: string;
  value: string | boolean | string[];
  x: number;
  y: number;
  width: number;
  height: number;
  pageId: string;
  required: boolean;
  readonly: boolean;
  options?: string[];
  placeholder?: string;
}

export type FormFieldType = 
  | 'text'
  | 'textarea'
  | 'checkbox'
  | 'radio'
  | 'select'
  | 'signature'
  | 'date';

// Signature Types
export interface Signature {
  id: string;
  type: SignatureType;
  data: string; // Base64 encoded image or text
  x: number;
  y: number;
  width: number;
  height: number;
  pageId: string;
  createdAt: Date;
}

export type SignatureType = 'drawn' | 'typed' | 'image';

// Tool Types
export interface Tool {
  id: string;
  name: string;
  icon: string;
  type: ToolType;
  isActive: boolean;
  properties: ToolProperties;
}

export type ToolType = 
  | 'select'
  | 'text'
  | 'highlight'
  | 'shape'
  | 'line'
  | 'freehand'
  | 'eraser'
  | 'stamp'
  | 'form'
  | 'signature';

export interface ToolProperties {
  color?: string;
  strokeWidth?: number;
  fontSize?: number;
  opacity?: number;
  shape?: 'rectangle' | 'circle' | 'line' | 'arrow';
}

// UI State Types
export interface UIState {
  sidebarVisible: boolean;
  propertiesVisible: boolean;
  currentTool: string;
  selectedAnnotations: string[];
  zoom: number;
  viewMode: ViewMode;
  showThumbnails: boolean;
  showOutline: boolean;
  currentPage: number;
  loading: boolean;
  error: string | null;
}

export type ViewMode = 'single' | 'continuous' | 'facing';

// Export Types
export interface ExportOptions {
  format: ExportFormat;
  quality?: number;
  includeAnnotations: boolean;
  includeFormData: boolean;
  pageRange?: {
    start: number;
    end: number;
  };
  password?: string;
  permissions?: PDFPermissions;
}

export type ExportFormat = 'pdf' | 'png' | 'jpg' | 'docx' | 'xlsx' | 'txt';

export interface PDFPermissions {
  printing: boolean;
  copying: boolean;
  editing: boolean;
  annotating: boolean;
  fillingForms: boolean;
  extracting: boolean;
  assembling: boolean;
  degradedPrinting: boolean;
}

// File Management Types
export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  lastModified: Date;
  isUploading?: boolean;
  uploadProgress?: number;
  error?: string;
  file?: File;
  cloudProvider?: string | CloudProvider;
  cloudPath?: string;
  


  
}

// OCR Types
export interface OCRResult {
  text: string;
  confidence: number;
  words: OCRWord[];
  lines: OCRLine[];
  paragraphs: OCRParagraph[];
}

export interface OCRWord {
  text: string;
  confidence: number;
  bbox: BoundingBox;
}

export interface OCRLine {
  text: string;
  confidence: number;
  bbox: BoundingBox;
  words: OCRWord[];
}

export interface OCRParagraph {
  text: string;
  confidence: number;
  bbox: BoundingBox;
  lines: OCRLine[];
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Batch Processing Types
export interface BatchOperation {
  id: string;
  type: BatchOperationType;
  files: string[];
  options: Record<string, any>;
  status: BatchStatus;
  progress: number;
  results: BatchResult[];
  createdAt: Date;
  completedAt?: Date;
}

export type BatchOperationType = 
  | 'merge'
  | 'split'
  | 'compress'
  | 'convert'
  | 'extract_text'
  | 'extract_images'
  | 'add_watermark'
  | 'remove_pages'
  | 'encrypt'
  | 'decrypt';

export type BatchStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface BatchResult {
  fileId: string;
  success: boolean;
  output?: string;
  error?: string;
}

// History Types
export interface HistoryState {
  id: string;
  action: string;
  timestamp: Date;
  data: any;
}

// Cloud Storage Types
export interface CloudProvider {
  id: string;
  name: string;
  icon: string;
  isConnected: boolean;
  config: CloudConfig;
}

export interface CloudConfig {
  apiKey?: string;
  accessToken?: string;
  refreshToken?: string;
  rootFolder?: string;
}

// Theme Types
export interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    foreground: string;
    accent: string;
    muted: string;
    border: string;
  };
}

// Event Types
export interface PDFEvent {
  type: PDFEventType;
  payload: any;
  timestamp: Date;
}

export type PDFEventType = 
  | 'document_loaded'
  | 'page_changed'
  | 'annotation_added'
  | 'annotation_updated'
  | 'annotation_deleted'
  | 'tool_changed'
  | 'zoom_changed'
  | 'export_completed'
  | 'error_occurred';

// API Response Types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};