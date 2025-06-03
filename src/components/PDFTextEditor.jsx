// src/components/PDFTextEditor.jsx
import React, { useRef, useEffect, useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker?worker";

import AnnotationCanvas from "./AnnotationCanvas.jsx";
import EditableTextLayer from "./EditableTextLayer.jsx";
import SignatureCaptureWidget from "./SignatureCaptureWidget.jsx";
import PDFViewerControls from "./PDFViewerControls.jsx";

// Configure PDF.js worker
const workerBlob = new Blob([pdfjsWorker], { type: "application/javascript" });
const workerUrl = URL.createObjectURL(workerBlob);
pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

const PDFTextEditor = ({ file, fontOptions = {} }) => {
  const canvasRef = useRef(null);
  const [pdfData, setPdfData] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [textItems, setTextItems] = useState([]);
  const [userTextBoxes, setUserTextBoxes] = useState([]);
  const [viewport, setViewport] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [zoom, setZoom] = useState(1.5);

  useEffect(() => {
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = async () => {
      const typedArray = new Uint8Array(fileReader.result);
      const doc = await pdfjsLib.getDocument({ data: typedArray }).promise;
      setPdfDoc(doc);
      setTotalPages(doc.numPages);
      setPdfData(fileReader.result);
    };
    fileReader.readAsArrayBuffer(file);
  }, [file]);

  useEffect(() => {
    if (!pdfDoc) return;
    renderPage();
  }, [pdfDoc, currentPage, zoom]);

  const renderPage = async () => {
    const page = await pdfDoc.getPage(currentPage);
    const vp = page.getViewport({ scale: zoom });
    setViewport(vp);

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    canvas.width = vp.width;
    canvas.height = vp.height;

    await page.render({ canvasContext: context, viewport: vp }).promise;

    const textContent = await page.getTextContent();
    setTextItems(textContent.items);
  };

  const handleTextSubmit = (text, position) => {
    setUserTextBoxes((prev) => [...prev, { text, position, page: currentPage }]);
  };

  const handleSave = async () => {
    if (!pdfData || !viewport) return;

    const pdfDoc = await PDFDocument.load(pdfData);
    const pages = pdfDoc.getPages();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    userTextBoxes.forEach(({ text, position, page }) => {
      const pg = pages[page - 1];
      pg.drawText(text, {
        x: position.x,
        y: viewport.height - position.y - 20,
        size: fontOptions.size || 14,
        font,
        color: rgb(0, 0, 0),
      });
    });

    const modifiedBytes = await pdfDoc.save();
    const blob = new Blob([modifiedBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    window.open(url);
  };

  return (
    <div
      className="pdf-editor"
      style={{
        position: "relative",
        maxWidth: "900px",
        margin: "0 auto",
        background: "#fff",
        padding: "10px",
        borderRadius: "6px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
      }}
    >
      <PDFViewerControls
        currentPage={currentPage}
        totalPages={totalPages}
        zoomLevel={zoom}
        onPrev={() => setCurrentPage((p) => Math.max(p - 1, 1))}
        onNext={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
        onZoomIn={() => setZoom((z) => Math.min(z + 0.25, 3))}
        onZoomOut={() => setZoom((z) => Math.max(z - 0.25, 0.5))}
      />

      <canvas ref={canvasRef} />

      {viewport && (
        <>
          <EditableTextLayer
            items={textItems}
            onSubmit={handleTextSubmit}
            viewport={viewport}
          />
          <AnnotationCanvas width={viewport.width} height={viewport.height} />
          <SignatureCaptureWidget onSigned={(data) => console.log("Signature:", data)} onClose={() => {}} />
        </>
      )}

      <button onClick={handleSave} style={{ marginTop: "1rem" }}>
        Save PDF
      </button>
    </div>
  );
};

export default PDFTextEditor;
