import React from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function ZipExporter({ files = [] }) {
  const handleZipDownload = async () => {
    const zip = new JSZip();

    files.forEach((file) => {
      zip.file(file.name, file.blob || file.bytes);
    });

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "PDF4EVER-export.zip");
  };

  return (
    <button
      onClick={handleZipDownload}
      style={{
        padding: "10px 16px",
        background: "#e67e22",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer"
      }}
    >
      📦 Export ZIP
    </button>
  );
}
