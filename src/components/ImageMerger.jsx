import React from "react";

export default function ImageMerger({ onMerged }) {
  const handleMergeImages = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;

    input.onchange = async (event) => {
      const files = Array.from(event.target.files);
      if (files.length === 0) return;

      const images = await Promise.all(
        files.map((file) => {
          return new Promise((resolve) => {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => resolve(img);
          });
        })
      );

      const maxWidth = Math.max(...images.map((img) => img.width));
      const totalHeight = images.reduce((sum, img) => sum + img.height, 0);

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = maxWidth;
      canvas.height = totalHeight;

      let yOffset = 0;
      images.forEach((img) => {
        ctx.drawImage(img, 0, yOffset);
        yOffset += img.height;
      });

      canvas.toBlob((blob) => {
        if (blob && onMerged) onMerged(blob);
      }, "image/jpeg");
    };

    input.click();
  };

  return (
    <button
      onClick={handleMergeImages}
      style={{
        padding: "10px 16px",
        background: "#6c5ce7",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer"
      }}
    >
      🧩 Merge Images
    </button>
  );
}
