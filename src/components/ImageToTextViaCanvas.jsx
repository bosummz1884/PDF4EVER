import React from "react";
import Tesseract from "tesseract.js";

export default function ImageToTextViaCanvas({ onTextExtracted }) {
  const handleExtract = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const image = new Image();
      image.src = URL.createObjectURL(file);
      image.onload = async () => {
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0);

        const result = await Tesseract.recognize(canvas, "eng", {
          logger: (m) => console.log(m),
        });

        if (onTextExtracted) onTextExtracted(result.data.text);
      };
    };

    input.click();
  };

  return (
    <button
      onClick={handleExtract}
      style={{
        padding: "10px 16px",
        background: "#636e72",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer"
      }}
    >
      🧠 OCR Canvas Image
    </button>
  );
}
