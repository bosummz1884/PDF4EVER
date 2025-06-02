import React, { useEffect, useRef } from "react";
import { pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;

export default function PdfPreviewPanel({ fileData }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!fileData) return;

    const renderPages = async () => {
      const pdf = await pdfjs.getDocument({ data: fileData }).promise;
      const container = containerRef.current;
      container.innerHTML = "";

      for (let i = 0; i < pdf.numPages; i++) {
        const page = await pdf.getPage(i + 1);
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        const viewport = page.getViewport({ scale: 1.5 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport }).promise;
        container.appendChild(canvas);
      }
    };

    renderPages();
  }, [fileData]);

  return (
    <div
      ref={containerRef}
      className="overflow-y-auto h-full p-2 bg-gray-100 border rounded"
    />
  );
}
// Usage example:
// <PdfPreviewPanel fileData={yourPdfFileData} />