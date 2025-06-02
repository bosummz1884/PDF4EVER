import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";

export default function MetadataEditor({ onUpdated }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [subject, setSubject] = useState("");

  const handleMetadataEdit = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/pdf";

    input.onchange = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      if (title) pdfDoc.setTitle(title);
      if (author) pdfDoc.setAuthor(author);
      if (subject) pdfDoc.setSubject(subject);

      const updatedPdf = await pdfDoc.save();
      onUpdated && onUpdated(new Uint8Array(updatedPdf));
    };

    input.click();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "300px" }}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />
      <button
        onClick={handleMetadataEdit}
        style={{
          padding: "10px 16px",
          background: "#636e72",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        📝 Edit PDF Metadata
      </button>
    </div>
  );
}
