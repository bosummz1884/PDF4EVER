import React from "react";

export default function ImageCompressor({ onCompressed }) {
  const handleImageUpload = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target.result;
      };

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const maxWidth = 1024;
        const scale = maxWidth / img.width;
        canvas.width = maxWidth;
        canvas.height = img.height * scale;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              onCompressed && onCompressed(blob, file.name);
            }
          },
          "image/jpeg",
          0.7
        );
      };

      reader.readAsDataURL(file);
    };

    input.click();
  };

  return (
    <button
      onClick={handleImageUpload}
      style={{
        padding: "10px 16px",
        background: "#f39c12",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer"
      }}
    >
      📷 Compress Image
    </button>
  );
}
