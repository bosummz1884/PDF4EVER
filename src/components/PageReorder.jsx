import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";

export default function PageReorder({ onReordered }) {
  const [pageCount, setPageCount] = useState(0);
  const [order, setOrder] = useState([]);
  const [pdfBytes, setPdfBytes] = useState(null);

  const handleFileLoad = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/pdf";

    input.onchange = async (event) => {
      const file = event.target.files[0];
      if (!file) return;
      const bytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(bytes);

      setPdfBytes(bytes);
      setPageCount(pdfDoc.getPageCount());
      setOrder(Array.from({ length: pdfDoc.getPageCount() }, (_, i) => i));
    };

    input.click();
  };

  const reorderPages = async () => {
    if (!pdfBytes || order.length === 0) return;

    const originalPdf = await PDFDocument.load(pdfBytes);
    const newPdf = await PDFDocument.create();

    for (const i of order) {
      const [copied] = await newPdf.copyPages(originalPdf, [i]);
      newPdf.addPage(copied);
    }

    const finalPdf = await newPdf.save();
    onReordered && onReordered(new Uint8Array(finalPdf));
  };

  const handleDrag = (dragIndex, hoverIndex) => {
    const updated = [...order];
    const [moved] = updated.splice(dragIndex, 1);
    updated.splice(hoverIndex, 0, moved);
    setOrder(updated);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <button onClick={handleFileLoad} style={{ marginBottom: "1rem" }}>
        📂 Load PDF
      </button>
      {order.length > 0 && (
        <div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {order.map((index, i) => (
              <DraggableCard
                key={i}
                index={i}
                label={`Page ${index + 1}`}
                onDrag={(targetIndex) => handleDrag(i, targetIndex)}
              />
            ))}
          </div>
          <button
            onClick={reorderPages}
            style={{ marginTop: "1rem", padding: "10px 16px", background: "#00cec9", color: "#fff" }}
          >
            🔀 Export Reordered PDF
          </button>
        </div>
      )}
    </div>
  );
}

function DraggableCard({ index, label, onDrag }) {
  const [dragging, setDragging] = useState(false);

  return (
    <div
      draggable
      onDragStart={() => setDragging(true)}
      onDragOver={(e) => {
        e.preventDefault();
        if (!dragging) onDrag(index);
      }}
      onDragEnd={() => setDragging(false)}
      style={{
        padding: "10px 14px",
        border: "1px solid #aaa",
        borderRadius: "6px",
        background: "#fff",
        cursor: "move",
        minWidth: "80px",
        textAlign: "center"
      }}
    >
      {label}
    </div>
  );
}
