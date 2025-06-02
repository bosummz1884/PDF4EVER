import React, { useRef, useState } from "react";

export default function PdfDrawTool({ onDraw }) {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [paths, setPaths] = useState([]);

  const handleMouseDown = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    setPaths([...paths, [{ x: offsetX, y: offsetY }]]);
    setDrawing(true);
  };

  const handleMouseMove = (e) => {
    if (!drawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    const newPaths = [...paths];
    newPaths[newPaths.length - 1].push({ x: offsetX, y: offsetY });
    setPaths(newPaths);
    redraw(newPaths);
  };

  const handleMouseUp = () => {
    setDrawing(false);
    const canvas = canvasRef.current;
    canvas.toBlob((blob) => {
      if (onDraw) onDraw(blob);
    });
  };

  const redraw = (allPaths) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    allPaths.forEach((path) => {
      ctx.beginPath();
      path.forEach((point, idx) => {
        if (idx === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.stroke();
    });
  };

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={1000}
      style={{ border: "1px solid #ccc", cursor: "crosshair" }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    />
  );
}
