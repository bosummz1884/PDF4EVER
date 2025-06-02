import React, { useState } from "react";

export default function ImageResizer({ onResized }) {
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  const handleResize = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const image = new Image();
      image.src = URL.createObjectURL(file);

      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = dimensions.width;
        canvas.height = dimensions.height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            if (blob && onResized) onResized(blob);
          },
          "image/jpeg",
          0.8
        );
      };
    };

    input.click();
  };

  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        <label>
          Width:{" "}
          <input
            type="number"
            value={dimensions.width}
            onChange={(e) => setDimensions({ ...dimensions, width: parseInt(e.target.value) })}
            style={{ width: 60 }}
          />
        </label>{" "}
        <label>
          Height:{" "}
          <input
            type="number"
            value={dimensions.height}
            onChange={(e) => setDimensions({ ...dimensions, height: parseInt(e.target.value) })}
            style={{ width: 60 }}
          />
        </label>
      </div>
      <button
        onClick={handleResize}
        style={{
          padding: "10px 16px",
          background: "#00b894",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        📐 Resize Image
      </button>
    </div>
  );
}
