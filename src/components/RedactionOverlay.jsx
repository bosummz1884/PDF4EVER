import React, { useState } from "react";

export default function RedactionOverlay({ onRedact }) {
  const [boxes, setBoxes] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [start, setStart] = useState(null);

  const handleMouseDown = (e) => {
    const rect = e.target.getBoundingClientRect();
    setStart({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setIsDrawing(true);
  };

  const handleMouseUp = (e) => {
    if (!isDrawing || !start) return;
    const rect = e.target.getBoundingClientRect();
    const end = { x: e.clientX - rect.left, y: e.clientY - rect.top };

    const box = {
      x: Math.min(start.x, end.x),
      y: Math.min(start.y, end.y),
      width: Math.abs(start.x - end.x),
      height: Math.abs(start.y - end.y),
    };

    setBoxes((prev) => [...prev, box]);
    setIsDrawing(false);
    setStart(null);
  };

  return (
    <div
      className="absolute inset-0 z-50 cursor-crosshair"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {boxes.map((box, i) => (
        <div
          key={i}
          className="absolute bg-black opacity-90"
          style={{
            left: box.x,
            top: box.y,
            width: box.width,
            height: box.height,
          }}
        />
      ))}

      {onRedact && boxes.length > 0 && (
        <button
          className="absolute bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded"
          onClick={() => onRedact(boxes)}
        >
          Apply Redactions
        </button>
      )}
    </div>
  );
}
