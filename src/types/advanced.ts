// Advanced PDF Editor Types

// Base types needed by other interfaces
export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface OCRWord {
  text: string;
  confidence: number;
  boundingBox: BoundingBox;
}

export interface OCRLine {
  text: string;
  confidence: number;
  words: OCRWord[];
  boundingBox: BoundingBox;
}

export interface OCRParagraph {
  text: string;
  confidence: number;
  lines: OCRLine[];
  boundingBox: BoundingBox;
}

export interface OCRBlock {
  text: string;
  confidence: number;
  boundingBox: BoundingBox;
  type: 'text' | 'image' | 'table' | 'header' | 'footer';
}

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

export interface FileSource {
  type: 'local' | 'cloud' | 'url';
  provider?: 'google-drive' | 'dropbox' | 'onedrive';
  path?: string;
  url?: string;
}

export interface UploadProgress {
  fileId: string;
  progress: number;
  stage: 'uploading' | 'processing' | 'complete' | 'error';
  message?: string;
}

export interface ViewerState {
  zoom: number;
  rotation: number;
  viewMode: 'single' | 'continuous' | 'facing' | 'book';
  fitMode: 'width' | 'height' | 'page' | 'custom';
  currentPage: number;
  scrollPosition: { x: number; y: number };
}

export interface NavigationMode {
  type: 'scroll' | 'page' | 'presentation';
  autoAdvance?: boolean;
  interval?: number;
}

export interface ZoomLevel {
  value: number;
  label: string;
  isCustom?: boolean;
}

export interface ExportFormat {
  type: 'pdf' | 'pdf-a' | 'pdf-x' | 'png' | 'jpg' | 'docx' | 'xlsx' | 'html' | 'txt';
  version?: string;
  quality?: number;
  dpi?: number;
}

export interface ExportOptions {
  format: ExportFormat;
  pageRange?: {
    type: 'all' | 'current' | 'range' | 'selection';
    start?: number;
    end?: number;
    pages?: number[];
  };
  includeAnnotations: boolean;
  includeBookmarks: boolean;
  includeForms: boolean;
  compression: CompressionSettings;
  security?: SecuritySettings;
}

export interface CompressionSettings {
  images: {
    enabled: boolean;
    quality: number;
    downsampling: boolean;
    targetDPI: number;
  };
  text: {
    enabled: boolean;
    fontSubsetting: boolean;
    removeUnusedFonts: boolean;
  };
  structure: {
    removeMetadata: boolean;
    removeComments: boolean;
    optimizeStructure: boolean;
  };
}

export interface PageOperation {
  type: 'add' | 'delete' | 'duplicate' | 'move' | 'rotate' | 'crop' | 'resize';
  pageIds: string[];
  targetIndex?: number;
  parameters?: Record<string, any>;
}

export interface PageLayout {
  width: number;
  height: number;
  orientation: 'portrait' | 'landscape';
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export interface SplitOptions {
  method: 'pages' | 'bookmarks' | 'size' | 'pattern';
  pagesPerFile?: number;
  maxSize?: number;
  pattern?: string;
  preserveBookmarks: boolean;
  outputFormat: string;
}

export interface MergeOperation {
  files: string[];
  insertionPoints?: number[];
  bookmarkHandling: 'preserve' | 'merge' | 'ignore';
  pageNumbering: 'continuous' | 'restart' | 'none';
}

export interface ExtractRange {
  start: number;
  end: number;
  includeBookmarks: boolean;
  includeAnnotations: boolean;
  outputName?: string;
}

export interface AnnotationStyle {
  color: string;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  opacity: number;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right';
  lineHeight?: number;
  padding?: number;
  borderRadius?: number;
  shadow?: {
    enabled: boolean;
    color: string;
    offsetX: number;
    offsetY: number;
    blur: number;
  };
}

export interface ImageOperation {
  type: 'insert' | 'replace' | 'extract' | 'crop' | 'resize' | 'rotate' | 'compress';
  sourceId?: string;
  targetId?: string;
  position?: { x: number; y: number };
  dimensions?: { width: number; height: number };
  quality?: number;
  format?: string;
}

export interface ConversionSettings {
  inputFormat: string;
  outputFormat: string;
  quality: number;
  dpi: number;
  colorSpace: 'rgb' | 'cmyk' | 'grayscale';
  compression: boolean;
}

export interface ImageFormat {
  type: 'jpg' | 'png' | 'gif' | 'bmp' | 'tiff' | 'webp';
  quality?: number;
  transparency?: boolean;
  compression?: string;
}

export interface FormData {
  fields: Record<string, any>;
  metadata: {
    formType: string;
    version: string;
    createdAt: Date;
    modifiedAt: Date;
  };
  validation: {
    isValid: boolean;
    errors: ValidationError[];
  };
}

export interface ValidationRule {
  type: 'required' | 'pattern' | 'length' | 'range' | 'custom';
  message: string;
  parameters?: Record<string, any>;
}

export interface ValidationError {
  fieldId: string;
  rule: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface TextSelection {
  startPage: number;
  endPage: number;
  startOffset: number;
  endOffset: number;
  text: string;
  boundingBoxes: BoundingBox[];
}

export interface OCRResult {
  text: string;
  confidence: number;
  language: string;
  words: OCRWord[];
  lines: OCRLine[];
  paragraphs: OCRParagraph[];
  pages: OCRPage[];
}

export interface OCRPage {
  pageNumber: number;
  text: string;
  confidence: number;
  dimensions: { width: number; height: number };
  blocks: OCRBlock[];
}

export interface OCRBlock {
  text: string;
  confidence: number;
  boundingBox: BoundingBox;
  type: 'text' | 'image' | 'table' | 'header' | 'footer';
}

export interface SearchOptions {
  query: string;
  caseSensitive: boolean;
  wholeWords: boolean;
  useRegex: boolean;
  scope: 'all' | 'current' | 'range';
  pageRange?: { start: number; end: number };
}

export interface SearchResult {
  pageNumber: number;
  text: string;
  startOffset: number;
  endOffset: number;
  boundingBox: BoundingBox;
  context: string;
}

export interface SignatureType {
  method: 'draw' | 'type' | 'image' | 'certificate';
  appearance: {
    showDate: boolean;
    showReason: boolean;
    showLocation: boolean;
    showSigner: boolean;
    customText?: string;
  };
}

export interface Certificate {
  id: string;
  issuer: string;
  subject: string;
  validFrom: Date;
  validTo: Date;
  fingerprint: string;
  keyUsage: string[];
  isValid: boolean;
}

export interface SecuritySettings {
  encryption: {
    enabled: boolean;
    level: 'standard' | 'high' | 'aes128' | 'aes256';
    userPassword?: string;
    ownerPassword?: string;
  };
  permissions: {
    printing: 'none' | 'lowres' | 'highres';
    copying: boolean;
    editing: 'none' | 'inserting' | 'form-filling' | 'commenting' | 'page-assembly' | 'all';
    extracting: boolean;
    accessibility: boolean;
  };
}

export interface Permission {
  type: string;
  allowed: boolean;
  restrictions?: string[];
}

export interface RedactionArea {
  pageId: string;
  boundingBox: BoundingBox;
  text?: string;
  color: string;
  permanent: boolean;
}

export interface DocumentMetadata {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string;
  creator?: string;
  producer?: string;
  creationDate?: Date;
  modificationDate?: Date;
  trapped?: boolean;
  customProperties: Record<string, string>;
}

export interface Attachment {
  id: string;
  name: string;
  description?: string;
  mimeType: string;
  size: number;
  creationDate: Date;
  data: ArrayBuffer;
  relationship?: 'source' | 'data' | 'alternative' | 'supplement';
}

export interface FontInfo {
  name: string;
  type: string;
  encoding: string;
  embedded: boolean;
  subset: boolean;
  usage: number;
  pages: number[];
}

export interface Watermark {
  type: 'text' | 'image';
  content: string;
  position: {
    x: number;
    y: number;
    alignment: 'top-left' | 'top-center' | 'top-right' | 'center-left' | 'center' | 'center-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  };
  style: {
    opacity: number;
    rotation: number;
    scale: number;
    color?: string;
    fontSize?: number;
    fontFamily?: string;
  };
  pages: 'all' | 'odd' | 'even' | number[];
}

export interface HeaderFooter {
  type: 'header' | 'footer';
  position: 'left' | 'center' | 'right';
  content: string;
  style: {
    fontSize: number;
    fontFamily: string;
    color: string;
    margins: { top: number; bottom: number };
  };
  variables: {
    pageNumber: boolean;
    totalPages: boolean;
    date: boolean;
    time: boolean;
    title: boolean;
    author: boolean;
  };
  pages: 'all' | 'except-first' | number[];
}

export interface Stamp {
  id: string;
  name: string;
  category: string;
  type: 'text' | 'image' | 'dynamic';
  content: string;
  appearance: {
    width: number;
    height: number;
    color: string;
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    opacity: number;
  };
  dynamic?: {
    showDate: boolean;
    showTime: boolean;
    showUser: boolean;
    customFields: Record<string, string>;
  };
}

export interface TableData {
  rows: any[][];
  headers: string[];
  metadata: {
    pageNumber: number;
    boundingBox: BoundingBox;
    confidence: number;
    cellCount: number;
  };
}

export interface ComparisonResult {
  differences: Difference[];
  metadata: {
    file1: string;
    file2: string;
    comparisonDate: Date;
    mode: ComparisonMode;
    totalDifferences: number;
  };
}

export interface Difference {
  type: 'text' | 'image' | 'structure' | 'annotation';
  operation: 'added' | 'deleted' | 'modified';
  page1?: number;
  page2?: number;
  boundingBox1?: BoundingBox;
  boundingBox2?: BoundingBox;
  content1?: string;
  content2?: string;
  confidence: number;
}

export interface ComparisonMode {
  type: 'visual' | 'textual' | 'structural';
  sensitivity: 'low' | 'medium' | 'high';
  ignoreFormatting: boolean;
  ignoreWhitespace: boolean;
  ignoreCase: boolean;
}

export interface BatchOperation {
  id: string;
  name: string;
  type: string;
  files: string[];
  operations: any[];
  status: ProcessingStatus;
  progress: number;
  startTime?: Date;
  endTime?: Date;
  results: BatchResult[];
}

export interface QueueItem {
  id: string;
  operation: BatchOperation;
  priority: number;
  dependencies?: string[];
  retryCount: number;
  maxRetries: number;
}

export interface ProcessingStatus {
  state: 'pending' | 'processing' | 'paused' | 'completed' | 'failed' | 'cancelled';
  currentStep?: string;
  totalSteps?: number;
  completedSteps?: number;
  message?: string;
  error?: string;
}

export interface BatchResult {
  fileId: string;
  fileName: string;
  success: boolean;
  outputPath?: string;
  outputSize?: number;
  processingTime?: number;
  error?: string;
  warnings?: string[];
}

// Cloud Storage Types
export interface CloudStorageConfig {
  provider: 'google-drive' | 'dropbox' | 'onedrive' | 's3' | 'box';
  credentials: Record<string, string>;
  settings: {
    autoSync: boolean;
    conflictResolution: 'local' | 'remote' | 'manual';
    maxFileSize: number;
    allowedFormats: string[];
  };
}

export interface CloudFile {
  id: string;
  name: string;
  path: string;
  size: number;
  modifiedDate: Date;
  downloadUrl?: string;
  thumbnailUrl?: string;
  mimeType: string;
  provider: string;
}

// Plugin System Types
export interface Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  enabled: boolean;
  hooks: PluginHook[];
  dependencies?: string[];
}

export interface PluginHook {
  event: string;
  handler: string;
  priority?: number;
}

// Template System Types
export interface DocumentTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  pageSize: string;
  orientation: 'portrait' | 'landscape';
  elements: TemplateElement[];
  variables: TemplateVariable[];
}

export interface TemplateElement {
  id: string;
  type: 'text' | 'image' | 'shape' | 'barcode' | 'qr-code';
  position: { x: number; y: number };
  dimensions: { width: number; height: number };
  properties: Record<string, any>;
  variable?: string;
}

export interface TemplateVariable {
  name: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'image';
  defaultValue?: any;
  required: boolean;
  validation?: ValidationRule;
}