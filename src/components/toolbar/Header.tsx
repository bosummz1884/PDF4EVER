import { 
  File, Save, Download, Upload, Undo, Redo, 
  ZoomIn, ZoomOut, Menu, Settings, Search,
  Printer, Share2, Shield, Eye, EyeOff
} from 'lucide-react';
import { Button } from '../ui/button';
import { ToolbarButton } from './ToolbarButton';
import { usePDFStore } from '../../stores/pdfStore';
import { useUIStore } from '../../stores/uiStore';
import { useHistoryStore } from '../../stores/historyStore';

export function Header() {
  const { currentDocument, setCurrentDocument } = usePDFStore();
  const { 
    zoom,  
    zoomIn, 
    zoomOut, 
    propertiesVisible,
    toggleSidebar,
    toggleProperties 
  } = useUIStore();
  const { canUndo, canRedo, undo, redo } = useHistoryStore();

  const handleNewDocument = () => {
    setCurrentDocument(null);
  };

  const handleSave = () => {
    if (currentDocument) {
      // Implement save functionality
      console.log('Saving document:', currentDocument.name);
    }
  };

  const handleExport = () => {
    if (currentDocument) {
      // Implement export functionality
      console.log('Exporting document:', currentDocument.name);
    }
  };

  const handlePrint = () => {
    if (currentDocument) {
      window.print();
    }
  };

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-background border-b">
      {/* Left section - File operations */}
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleSidebar}
          title="Toggle sidebar"
        >
          <Menu className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-1">
          <ToolbarButton
            icon={File}
            onClick={handleNewDocument}
            tooltip="New document"
          />
          <ToolbarButton
            icon={Upload}
            onClick={handleNewDocument}
            tooltip="Open file"
          />
          <ToolbarButton
            icon={Save}
            onClick={handleSave}
            disabled={!currentDocument}
            tooltip="Save"
          />
          <ToolbarButton
            icon={Download}
            onClick={handleExport}
            disabled={!currentDocument}
            tooltip="Export"
          />
          <ToolbarButton
            icon={Printer}
            onClick={handlePrint}
            disabled={!currentDocument}
            tooltip="Print"
          />
        </div>
      </div>

      {/* Center section - Document title and edit tools */}
      <div className="flex items-center gap-4">
        {currentDocument && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium truncate max-w-xs">
              {currentDocument.name}
            </span>
            {currentDocument.isEncrypted && (
              <Shield className="h-4 w-4 text-amber-500" />
            )}
          </div>
        )}
        
        <div className="flex items-center gap-1">
          <ToolbarButton
            icon={Undo}
            onClick={undo}
            disabled={!canUndo()}
            tooltip="Undo"
          />
          <ToolbarButton
            icon={Redo}
            onClick={redo}
            disabled={!canRedo()}
            tooltip="Redo"
          />
        </div>
      </div>

      {/* Right section - View controls */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <ToolbarButton
            icon={ZoomOut}
            onClick={zoomOut}
            disabled={zoom <= 25}
            tooltip="Zoom out"
          />
          <span className="text-sm font-medium min-w-12 text-center">
            {zoom}%
          </span>
          <ToolbarButton
            icon={ZoomIn}
            onClick={zoomIn}
            disabled={zoom >= 500}
            tooltip="Zoom in"
          />
        </div>

        <div className="flex items-center gap-1">
          <ToolbarButton
            icon={Search}
            onClick={() => {}}
            tooltip="Search"
          />
          <ToolbarButton
            icon={Share2}
            onClick={() => {}}
            tooltip="Share"
          />
          <ToolbarButton
            icon={propertiesVisible ? EyeOff : Eye}
            onClick={toggleProperties}
            tooltip={propertiesVisible ? "Hide properties" : "Show properties"}
          />
          <ToolbarButton
            icon={Settings}
            onClick={() => {}}
            tooltip="Settings"
          />
        </div>
      </div>
    </header>
  );
}