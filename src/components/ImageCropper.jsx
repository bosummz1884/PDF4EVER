import React, { useRef, useState } from "react";

export default function ImageCropper({ onCropped }) {
  const [image, setImage] = useState(null);
  const canvasRef = useRef(null);
  const [cropStart, setCropStart] = useState(null);
  const [cropEnd, setCropEnd] = useState(null);

  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        setImage(img);
        const canvas = canvasRef.current;
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
      };
    };

    input.click();
  };

  const drawCropBox = () => {
    if (!cropStart || !cropEnd || !image) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);
    ctx.strokeStyle = "#e17055";
    ctx.lineWidth = 2;

    const x = Math.min(cropStart.x, cropEnd.x);
    const y = Math.min(cropStart.y, cropEnd.y);
    const w = Math.abs(cropStart.x - cropEnd.x);
    const h = Math.abs(cropStart.y - cropEnd.y);

    ctx.strokeRect(x, y, w, h);
  };

  const cropImage = () => {
    if (!cropStart || !cropEnd || !image) return;

    const x = Math.min(cropStart.x, cropEnd.x);
    const y = Math.min(cropStart.y, cropEnd.y);
    const width = Math.abs(cropStart.x - cropEnd.x);
    const height = Math.abs(cropStart.y - cropEnd.y);

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext("2d");
    tempCtx.drawImage(canvasRef.current, x, y, width, height, 0, 0, width, height);

    tempCanvas.toBlob((blob) => {
      if (blob && onCropped) onCropped(blob);
    }, "image/jpeg");
  };

  return (
    <div>
      <button onClick={handleImageUpload} style={{ marginBottom: 10 }}>
        🖼️ Upload Image
      </button>
      <br />
      <canvas
        ref={canvasRef}
        style={{ border: "1px solid #ccc", cursor: "crosshair" }}
        onMouseDown={(e) => {
          const rect = e.target.getBoundingClientRect();
          setCropStart({ x: e.clientX - rect.left, y: e.clientY - rect.top });
          setCropEnd(null);
        }}
        onMouseMove={(e) => {
          if (!cropStart) return;
          const rect = e.target.getBoundingClientRect();
          setCropEnd({ x: e.clientX - rect.left, y: e.clientY - rect.top });
          drawCropBox();
        }}
        onMouseUp={(e) => {
          const rect = e.target.getBoundingClientRect();
          setCropEnd({ x: e.clientX - rect.left, y: e.clientY - rect.top });
          drawCropBox();
        }}
      />
      <br />
      <button onClick={cropImage} disabled={!cropStart || !cropEnd}>
        ✂️ Crop Selected Area
      </button>
    </div>
  );
}
