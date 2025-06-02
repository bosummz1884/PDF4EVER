// src/components/PDFTextEditor.jsx
import React, { useRef, useEffect, useState } from "react";
import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker?worker";
const workerBlob = new Blob([pdfjsWorker], { type: "application/javascript" });
const workerUrl = URL.createObjectURL(workerBlob);
import AnnotationCanvas from "components/AnnotationCanvas.jsx";
import EditableTextLayer from "components/EditableTextLayer.jsx";
import SignatureCaptureWidget from "components/SignatureCaptureWidget.jsx";

// Ensure PDF.js is configured to use the worker
pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

const PDFTextEditor = ({ file }) => {
  const canvasRef = useRef(null);
  const [textItems, setTextItems] = useState([]);
  const [pdfData, setPdfData] = useState(null);

  useEffect(() => {
    if (!file) return;

    const renderPDF = async () => {
      const fileReader = new FileReader();
      fileReader.onload = async () => {
        const typedArray = new Uint8Array(fileReader.result);
        const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
        const page = await pdf.getPage(1);

        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;

        const textContent = await page.getTextContent();
        setTextItems(textContent.items);
        setPdfData(fileReader.result); // store original PDF data
      };
      fileReader.readAsArrayBuffer(file);
    };

    renderPDF();
  }, [file]);

  const handleSave = async () => {
    if (!pdfData) return;

    const pdfDoc = await PDFDocument.load(pdfData);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    // Example: adding text
    const font = await pdfDoc.embedFont(PDFDocument.PDFName.Helvetica);
    firstPage.drawText("Sample Text", {
      x: 50,
      y: 700,
      size: 18,
      font,
      color: pdfLib.rgb(0, 0, 0)
    });

    const modifiedBytes = await pdfDoc.save();
    const blob = new Blob([modifiedBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    window.open(url);
  };

  return (
    <div className="pdf-editor">
      <canvas ref={canvasRef} />
      {/* Text items and annotations will be placed via EditableTextLayer and AnnotationCanvas */}
      <EditableTextLayer items={textItems} />
      <AnnotationCanvas />
      <SignatureCaptureWidget onSigned={(data) => console.log("Signature:", data)} onClose={() => {}} />
      <button onClick={handleSave}>Save PDF</button>
    </div>
  );
};

export default PDFTextEditor;
