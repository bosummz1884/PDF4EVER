import React from "react";
import { PDFDocument, rgb } from "pdf-lib";

export default function ImageToPdf({ onGenerated }) {
  const handleImageToPdf = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const arrayBuffer = await file.arrayBuffer();

      const pdfDoc = await PDFDocument.create();
      const image = await pdfDoc.embedJpg(arrayBuffer);
      const dims = image.scale(1);

      const page = pdfDoc.addPage([dims.width, dims.height]);
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: dims.width,
        height: dims.height
      });

      const pdfBytes = await pdfDoc.save();
      onGenerated && onGenerated(new Uint8Array(pdfBytes));
    };

    input.click();
  };

  return (
    <button
      onClick={handleImageToPdf}
      style={{
        padding: "10px 16px",
        background: "#00b894",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer"
      }}
    >
      🖼️ Convert Image to PDF
    </button>
  );
}
