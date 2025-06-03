// src/components/PDFEditor.jsx
import React, { useState, useRef } from "react";
import { Button } from "../components/ui/button";
import { UploadIcon, Pencil, TextCursorInput, ImageIcon, Download, Trash2, PenLine, Signature } from "lucide-react";
import AnnotationCanvas from "./AnnotationCanvas";
import CameraToPDF from "./CameraToPDF";
import PDFTextEditor from "./PDFTextEditor";
import SignatureCaptureWidget from "./SignatureCaptureWidget";
import FontToolbar from "./FontToolbar";

export default function PDFEditor() {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef();
  const editorRef = useRef();

  const [activeTool, setActiveTool] = useState(null);
  const [fontOptions, setFontOptions] = useState({ size: 24, color: "#000000", family: "Helvetica" });

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    }
  };

  const clearEditor = () => {
    setFile(null);
    setActiveTool(null);
  };

  const handleExport = () => {
    if (editorRef.current) {
      editorRef.current.exportPDF();
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <Button onClick={() => fileInputRef.current.click()}>
          <UploadIcon className="mr-2 h-4 w-4" /> Upload PDF
        </Button>
        <Button variant={activeTool === "annotate" ? "default" : "secondary"} onClick={() => setActiveTool("annotate")}> 
          <Pencil className="mr-2 h-4 w-4" /> Annotate
        </Button>
        <Button variant={activeTool === "text" ? "default" : "secondary"} onClick={() => setActiveTool("text")}> 
          <TextCursorInput className="mr-2 h-4 w-4" /> Text Tool
        </Button>
        <Button variant={activeTool === "signature" ? "default" : "secondary"} onClick={() => setActiveTool("signature")}> 
          <Signature className="mr-2 h-4 w-4" /> Signature
        </Button>
        <Button variant={activeTool === "camera" ? "default" : "secondary"} onClick={() => setActiveTool("camera")}> 
          <ImageIcon className="mr-2 h-4 w-4" /> Camera
        </Button>
        <Button variant="secondary" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" /> Export
        </Button>
        <Button variant="destructive" onClick={clearEditor}>
          <Trash2 className="mr-2 h-4 w-4" /> Clear
        </Button>
      </div>

      <input
        type="file"
        accept="application/pdf"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {file ? (
        <div className="border rounded-lg p-4 bg-card">
          <p className="text-sm text-muted-foreground mb-2">Loaded file: {file.name}</p>
          <PDFTextEditor ref={editorRef} file={file} fontOptions={fontOptions} />
          {activeTool === "annotate" && <AnnotationCanvas />}
          {activeTool === "text" && <FontToolbar onChange={setFontOptions} />}
          {activeTool === "signature" && <SignatureCaptureWidget />}
          {activeTool === "camera" && <CameraToPDF />}
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-12 border border-dashed rounded-lg">
          <p className="text-lg">Upload a PDF to get started.</p>
        </div>
      )}
    </div>
  );
}
