import React, { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";

export default function PdfSignaturePad({ onSave }) {
  const sigPadRef = useRef(null);

  const handleSave = () => {
    const canvas = sigPadRef.current;
    if (!canvas.isEmpty()) {
      const imageData = canvas.getTrimmedCanvas().toDataURL("image/png");
      onSave(imageData);
      canvas.clear();
    }
  };

  return (
    <div className="bg-white p-4 border rounded shadow max-w-md">
      <h2 className="text-lg font-semibold mb-2">Sign below:</h2>
      <SignatureCanvas
        ref={sigPadRef}
        penColor="black"
        backgroundColor="#f8f9fa"
        canvasProps={{ width: 400, height: 200, className: "border rounded" }}
      />
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => sigPadRef.current.clear()}
          className="bg-gray-500 text-white px-3 py-1 rounded"
        >
          Clear
        </button>
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-1 rounded"
        >
          Save Signature
        </button>
      </div>
    </div>
  );
}
