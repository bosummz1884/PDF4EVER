import React, { useRef, useState } from 'react';

const AnnotationCanvas = ({ onCapture }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState([]);

  const color = '#ff0000';
  const strokeWidth = 3;

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const { offsetX, offsetY } = e.nativeEvent;
    setPoints([{ x: offsetX, y: offsetY }]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    setPoints((prev) => [...prev, { x: offsetX, y: offsetY }]);
    drawLine();
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setPoints((prev) => [...prev, null]); // null = separator
  };

  const drawLine = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.strokeStyle = color;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = 'round';

    ctx.beginPath();
    const last = points[points.length - 1];
    const beforeLast = points[points.length - 2];
    if (last && beforeLast) {
      ctx.moveTo(beforeLast.x, beforeLast.y);
      ctx.lineTo(last.x, last.y);
      ctx.stroke();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setPoints([]);
  };

  const captureImage = () => {
    const canvas = canvasRef.current;
    canvas.toBlob((blob) => {
      if (onCapture && blob) {
        onCapture(blob);
      }
    }, 'image/png');
  };

  return (
    <div style={{ position: 'relative' }}>
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        style={{ border: '1px solid #ccc', touchAction: 'none' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseOut={handleMouseUp}
      />
      <div style={{ position: 'absolute', top: 10, right: 10 }}>
        <button onClick={clearCanvas} style={{ marginBottom: '10px' }}>Clear</button>
        <br />
        <button onClick={captureImage}>Save</button>
      </div>
    </div>
  );
};

export default AnnotationCanvas;
