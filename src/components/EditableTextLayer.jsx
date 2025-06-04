// src/components/EditableTextLayer.jsx
import React, { useState, useRef } from "react";

const EditableTextLayer = ({ items = [], onSubmit, viewport, fontOptions = {} }) => {
  const [inputs, setInputs] = useState([]);
  const layerRef = useRef(null);

  const handleClick = (e) => {
    if (e.target !== layerRef.current) return;

    const rect = layerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const id = Date.now();

    setInputs((prev) => [
      ...prev,
      {
        id,
        x,
        y,
        value: "",
        editing: true,
        style: {
          fontSize: fontOptions.size || 14,
          color: fontOptions.color || "#000000",
          fontFamily: fontOptions.family || "Helvetica",
        },
      },
    ]);
  };

  const handleChange = (id, value) => {
    setInputs((prev) =>
      prev.map((input) =>
        input.id === id ? { ...input, value } : input
      )
    );
  };

  const handleBlur = (id) => {
    const input = inputs.find((inp) => inp.id === id);
    if (input && input.value.trim() !== "") {
      onSubmit(input.value, { x: input.x, y: input.y });
    }

    setInputs((prev) =>
      prev.filter((inp) => inp.id !== id || inp.value.trim() === "")
    );
  };

  return (
    <div
      ref={layerRef}
      className="textLayer"
      style={{
        position: "absolute",
        inset,block,start: 0,
        inset,inline,start: 0,
        inline,size: viewport?.width || "100%",
        block,size: viewport?.height || "100%",
        zIndex: 5,
        cursor: "text",
      }}
      onClick={handleClick}
    >
      {inputs.map((input) => (
        <input
          key={input.id}
          autoFocus
          value={input.value}
          onChange={(e) => handleChange(input.id, e.target.value)}
          onBlur={() => handleBlur(input.id)}
          style={{
            position: "absolute",
            inset,block,start: input.y,
            inset,inline,start: input.x,
            fontSize: `${input.style.fontSize}px`,
            color: input.style.color,
            fontFamily: input.style.fontFamily,
            padding: "2px 4px",
            border: "1px solid #ccc",
            borderRadius: "2px",
            background: "rgba(255,255,255,0.95)",
            mininline,size: "100px",
            zIndex: 6,
          }}
        />
      ))}
    </div>
  );
};

export default EditableTextLayer;
