import React, { useState } from "react";

export default function FormFieldEditor({ onFieldsUpdated }) {
  const [fields, setFields] = useState([]);

  const addField = (x, y) => {
    const label = prompt("Enter field label:");
    if (label) {
      const newFields = [
        ...fields,
        {
          id: Date.now(),
          label,
          position: { x, y }
        }
      ];
      setFields(newFields);
      onFieldsUpdated && onFieldsUpdated(newFields);
    }
  };

  const moveField = (id, x, y) => {
    const updated = fields.map((field) =>
      field.id === id ? { ...field, position: { x, y } } : field
    );
    setFields(updated);
    onFieldsUpdated && onFieldsUpdated(updated);
  };

  return (
    <div
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        addField(x, y);
      }}
      style={{
        position: "relative",
        width: "100%",
        height: "600px",
        border: "2px dashed #ccc",
        background: "#fafafa",
        overflow: "hidden"
      }}
    >
      {fields.map((field) => (
        <DraggableField
          key={field.id}
          id={field.id}
          label={field.label}
          x={field.position.x}
          y={field.position.y}
          onMove={moveField}
        />
      ))}
    </div>
  );
}

function DraggableField({ id, label, x, y, onMove }) {
  const [dragging, setDragging] = useState(false);

  const handleMouseMove = (e) => {
    if (!dragging) return;
    const parent = e.currentTarget.offsetParent.getBoundingClientRect();
    const newX = e.clientX - parent.left;
    const newY = e.clientY - parent.top;
    onMove(id, newX, newY);
  };

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        padding: "6px 10px",
        background: "#fff",
        border: "1px solid #ccc",
        borderRadius: "4px",
        cursor: "grab"
      }}
      onMouseDown={() => setDragging(true)}
      onMouseUp={() => setDragging(false)}
      onMouseMove={handleMouseMove}
    >
      🏷️ {label}
    </div>
  );
}
