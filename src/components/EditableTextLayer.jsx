import React, { useState } from 'react';

const EditableTextLayer = ({ onSubmit }) => {
  const [textBoxes, setTextBoxes] = useState([]);

  const addTextBox = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const offset = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    setTextBoxes((prev) => [
      ...prev,
      {
        id: Date.now(),
        position: offset,
        text: ''
      }
    ]);
  };

  const updatePosition = (id, x, y) => {
    setTextBoxes((prev) =>
      prev.map((box) =>
        box.id === id ? { ...box, position: { x, y } } : box
      )
    );
  };

  const updateText = (id, text) => {
    setTextBoxes((prev) =>
      prev.map((box) =>
        box.id === id ? { ...box, text } : box
      )
    );
  };

  return (
    <div
      onClick={addTextBox}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden'
      }}
    >
      {textBoxes.map((box) => (
        <DraggableTextBox
          key={box.id}
          id={box.id}
          text={box.text}
          position={box.position}
          onPositionChange={updatePosition}
          onTextChange={updateText}
          onSubmit={onSubmit}
        />
      ))}
    </div>
  );
};

const DraggableTextBox = ({
  id,
  text,
  position,
  onPositionChange,
  onTextChange,
  onSubmit
}) => {
  const [dragging, setDragging] = useState(false);

  const handleDrag = (e) => {
    const parent = e.currentTarget.parentNode.getBoundingClientRect();
    const x = e.clientX - parent.left;
    const y = e.clientY - parent.top;
    onPositionChange(id, x, y);
  };

  return (
    <div
      onMouseDown={() => setDragging(true)}
      onMouseUp={() => setDragging(false)}
      onMouseMove={(e) => dragging && handleDrag(e)}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: 200,
        cursor: dragging ? 'grabbing' : 'grab',
        zIndex: 10
      }}
    >
      <textarea
        value={text}
        onChange={(e) => onTextChange(id, e.target.value)}
        onBlur={() => {
          if (text.trim()) {
            onSubmit && onSubmit(text.trim(), position);
          }
        }}
        placeholder="Enter text..."
        style={{
          width: '100%',
          padding: '8px',
          fontSize: '16px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          backgroundColor: 'rgba(255,255,255,0.8)',
          resize: 'none'
        }}
      />
    </div>
  );
};

export default EditableTextLayer;
