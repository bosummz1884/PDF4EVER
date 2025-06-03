// src/components/AnnotationCanvas.jsx
import React, { useRef, useState, useEffect } from "react";

export default function AnnotationCanvas({ onCapture, width = 900, height = 1200 }) {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState(null);

  const strokeColor = "red";
  const strokeWidth = 2.5;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = width;
      canvas.height = height;
    }
  }, [width, height]);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (e.clientX || e.touches?.[0]?.clientX) - rect.left,
      y: (e.clientY || e.touches?.[0]?.clientY) - rect.top
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    setDrawing(true);
    setLastPoint(getPos(e));
  };

  const draw = (e) => {
    if (!drawing) return;
    const ctx = canvasRef.current.getContext("2d");
    const currentPoint = getPos(e);
    if (lastPoint && currentPoint && ctx) {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(currentPoint.x, currentPoint.y);
      ctx.stroke();
      setLastPoint(currentPoint);
    }
  };

  const stopDrawing = () => {
    setDrawing(false);
    setLastPoint(null);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const captureCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (blob && onCapture) {
        const reader = new FileReader();
        reader.onload = () => {
          const imageData = new Uint8Array(reader.result);
          onCapture(imageData);
        };
        reader.readAsArrayBuffer(blob);
      }
    }, "image/png");
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width,
        height,
        zIndex: 4
      }}
    >
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        style={{
          width: "100%",
          height: "100%",
          border: "1px solid transparent",
          backgroundColor: "transparent",
          cursor: "crosshair"
        }}
      />
      <div style={{ position: "absolute", top: 10, right: 10, zIndex: 10 }}>
        <button onClick={clearCanvas}>Clear</button>
        <button onClick={captureCanvas} style={{ marginLeft: "10px" }}>
          Save
        </button>
      </div>
    </div>
  );
}
