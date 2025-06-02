// src/components/FontToolbar.jsx
import React, { useState } from "react";
import styled from "styled-components";

const ToolbarWrapper = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin: 1rem 0;
`;

const Label = styled.label`
  font-weight: bold;
`;

const Input = styled.input`
  padding: 0.25rem;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const Select = styled.select`
  padding: 0.25rem;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const FontToolbar = ({ onChange }) => {
  const [fontSize, setFontSize] = useState(24);
  const [fontColor, setFontColor] = useState("#000000");

  const handleFontSizeChange = (e) => {
    const size = parseInt(e.target.value);
    setFontSize(size);
    onChange({ fontSize: size, fontColor });
  };

  const handleColorChange = (e) => {
    const color = e.target.value;
    setFontColor(color);
    onChange({ fontSize, fontColor: color });
  };

  return (
    <ToolbarWrapper>
      <Label>
        Font Size:
        <Select value={fontSize} onChange={handleFontSizeChange}>
          {[12, 16, 20, 24, 28, 32, 36, 48].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </Select>
      </Label>
      <Label>
        Color:
        <Input type="color" value={fontColor} onChange={handleColorChange} />
      </Label>
    </ToolbarWrapper>
  );
};

export default FontToolbar;
