import React from "react";

export default function PdfExporter({ pdfBytes, filename = "document.pdf" }) {
  const handleDownload = () => {
    if (!pdfBytes) return;

    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <button
      onClick={handleDownload}
      style={{
        padding: "10px 16px",
        background: "#2ecc71",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer"
      }}
    >
      📥 Download PDF
    </button>
  );
}
