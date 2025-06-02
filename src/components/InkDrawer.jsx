import React, { useRef, useState } from "react";

export default function InkDrawer({ onSave }) {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleMouseDown = (e) => {
    setDrawing((prev) => [...prev, []]);
    setIsDrawing(true);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setDrawing((prev) => {
      const updated = [...prev];
      updated[updated.length - 1].push({ x, y });
      return updated;
    });

    drawCanvas([...drawing, [{ x, y }]]);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const drawCanvas = (paths = drawing) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";

    paths.forEach((path) => {
      if (path.length > 1) {
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        for (let i = 1; i < path.length; i++) {
          ctx.lineTo(path[i].x, path[i].y);
        }
        ctx.stroke();
      }
    });
  };

  const handleClear = () => {
    setDrawing([]);
    drawCanvas([]);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    canvas.toBlob((blob) => {
      if (onSave && blob) onSave(blob);
    }, "image/png");
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        style={{ border: "1px solid #ccc", display: "block", marginBottom: 10 }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={handleClear}>🧼 Clear</button>
        <button onClick={handleSave}>💾 Save Drawing</button>
      </div>
    </div>
  );
}
