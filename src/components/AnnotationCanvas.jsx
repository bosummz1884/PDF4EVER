import React, { useRef, useState } from 'react';

export default function AnnotationCanvas({ onCapture }) {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [points, setPoints] = useState([]);

  const strokeColor = 'red';
  const strokeWidth = 3;

  const handleMouseDown = (e) => {
    setDrawing(true);
    const rect = canvasRef.current.getBoundingClientRect();
    const pos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    setPoints((prev) => [...prev, pos]);
  };

  const handleMouseMove = (e) => {
    if (!drawing) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const pos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    setPoints((prev) => [...prev, pos]);
    drawLine(points[points.length - 1], pos);
  };

  const handleMouseUp = () => {
    setDrawing(false);
  };

  const drawLine = (start, end) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx || !start || !end) return;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setPoints([]);
    }
  };

  const captureCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.toBlob((blob) => {
        if (blob && onCapture) {
          const fileReader = new FileReader();
          fileReader.onload = () => {
            const imageData = new Uint8Array(fileReader.result);
            onCapture(imageData);
          };
          fileReader.readAsArrayBuffer(blob);
        }
      }, 'image/png');
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ border: '1px solid #ccc', background: '#fff' }}
      />
      <div style={{ position: 'absolute', top: 10, right: 10 }}>
        <button onClick={clearCanvas}>Clear</button>
        <button onClick={captureCanvas} style={{ marginLeft: '10px' }}>Save</button>
      </div>
    </div>
  );
}