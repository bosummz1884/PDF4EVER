import React from "react";

export default function ImageCompressor({ onCompressed }) {
  const handleCompress = async () => {
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
        const ctx = canvas.getContext("2d");

        // Resize to 70% of original dimensions
        const scale = 0.7;
        canvas.width = image.width * scale;
        canvas.height = image.height * scale;

        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            if (blob && onCompressed) onCompressed(blob);
          },
          "image/jpeg",
          0.7 // Compression quality
        );
      };
    };

    input.click();
  };

  return (
    <button
      onClick={handleCompress}
      style={{
        padding: "10px 16px",
        background: "#fdcb6e",
        color: "#000",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer"
      }}
    >
      📉 Compress Image
    </button>
  );
}
