// src/pages/editor.jsx
import React from "react";
import PDFEditor from "@/components/PDFEditor";

export default function EditorPage() {
  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 gradient-text text-center">PDF4EVER Editor</h1>
      <PDFEditor />
    </div>
  );
}
