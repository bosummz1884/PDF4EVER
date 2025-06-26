# Web PDF Editor - TypeScript/React/Vite

## Overview

This is a professional PDF editor web application built with modern web technologies. The app provides comprehensive PDF editing capabilities including viewing, annotating, form filling, digital signatures, OCR processing, and batch operations. It's designed as a client-side application with a focus on performance and user experience.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern React features
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Framework**: Tailwind CSS with shadcn/ui components for consistent, accessible design
- **State Management**: Zustand for lightweight, simple state management
- **Data Fetching**: React Query for server state management and caching

### Component Structure
The application follows a modular component architecture organized by feature:
- `ui/` - Reusable base UI components (buttons, dialogs, forms)
- `pdf/` - PDF-specific components (viewer, tools, rendering)
- `toolbar/` - User interface toolbars and menus
- `modals/` - Dialog components for various operations

## Key Components

### File Management System
- **FileUploader**: Handles drag-and-drop file uploads with support for multiple PDF files
- **FileManager**: Manages file organization, cloud storage integration, and batch upload operations
- **Problem Addressed**: Streamlined file handling for professional workflows
- **Solution**: Unified interface for local and cloud file operations

### PDF Processing Engine
- **PDFViewer**: Core PDF rendering component with responsive design
- **ThumbnailPanel**: Page navigation and overview functionality
- **PageManager**: Page manipulation tools (add, delete, reorder with drag-drop)
- **Technology Choice**: Combination of PDF-lib, React-PDF, and PDF.js for comprehensive PDF handling

### Annotation System
- **AnnotationToolbar**: Tool selection interface for various annotation types
- **TextTool**: Text addition and editing capabilities
- **ShapeTool**: Drawing tools for shapes, highlights, and markups
- **Design Decision**: Modular tool system allows for easy extension of annotation types

### Advanced Features
- **FormDetector/FormFiller**: Automatic form field detection and filling capabilities
- **SignaturePad/SignatureManager**: Digital signature creation and management
- **OCRProcessor**: Text recognition for scanned documents
- **BatchProcessor**: Bulk operations across multiple PDF files

## Data Flow

1. **File Input**: Users upload PDFs through drag-drop or file picker
2. **Processing**: PDF files are parsed using PDF.js for viewing and PDF-lib for editing
3. **State Management**: Document state and user interactions managed through Zustand stores
4. **Rendering**: React-PDF handles PDF display with custom annotation overlays
5. **Export**: Modified PDFs exported using PDF-lib with support for multiple formats

## External Dependencies

### Core PDF Libraries
- **pdf-lib**: Primary library for PDF manipulation and generation
- **react-pdf**: React wrapper for PDF.js, handles PDF rendering
- **pdfjs-dist**: Mozilla's PDF.js for PDF parsing and display

### UI and Interaction
- **react-dropzone**: File upload handling with drag-and-drop support
- **lucide-react**: Icon library for consistent iconography
- **@radix-ui/react-dialog**: Accessible dialog components

### State and Data Management
- **zustand**: Lightweight state management solution
- **@tanstack/react-query**: Server state management and caching

## Deployment Strategy

The application is designed as a client-side web app that can be deployed to any static hosting service:
- **Build Process**: Vite handles bundling and optimization
- **Assets**: All PDF processing happens client-side, no server requirements
- **Hosting**: Compatible with Vercel, Netlify, GitHub Pages, or any static host

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- June 26, 2025. Initial setup
- June 26, 2025. Complete PDF editor implementation with all core features:
  * File upload with drag-and-drop support
  * PDF viewing with zoom controls and page navigation
  * Sidebar with thumbnails, outline, bookmarks, and annotations panels
  * Annotation system with text, shapes, highlights, and drawing tools
  * Properties panel for editing annotation styles and layout
  * Comprehensive state management with Zustand stores
  * Professional UI with Tailwind CSS and shadcn/ui components
  * All TypeScript interfaces and component structure complete
- June 26, 2025. Enhanced with comprehensive advanced features per specifications:
  * Advanced batch processing system with queue management
  * Professional export dialog with multi-format support and compression options
  * Cloud storage integration (Google Drive, Dropbox, OneDrive)
  * Security features including password protection and permissions
  * Advanced PDF operations (split, merge, watermarks, headers/footers)
  * Complete TypeScript type system for all advanced features
  * Additional UI components (Progress, Badge, advanced dialogs)
  * Integrated batch processor panel in sidebar navigation