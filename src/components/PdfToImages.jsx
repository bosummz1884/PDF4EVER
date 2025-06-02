import React from "react";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.entry";

export default function PdfToImage({ onImagesGenerated }) {
  const convertPdfToImages = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/pdf";

    input.onchange = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const images = [];

      for (let i = 0; i < pdf.numPages; i++) {
        const page = await pdf.getPage(i + 1);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;
        const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
        images.push({ blob, pageIndex: i });
      }

      onImagesGenerated && onImagesGenerated(images);
    };

    input.click();
  };

  return (
    <button
      onClick={convertPdfToImages}
      style={{
        padding: "10px 16px",
        background: "#6c5ce7",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer"
      }}
    >
      🖼️ Convert PDF to Images
    </button>
  );
}
