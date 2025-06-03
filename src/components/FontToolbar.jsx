// src/components/FontToolbar.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";

const ToolbarWrapper = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin: 1rem 0;
  flex-wrap: wrap;
  justify-content: center;
`;

const Label = styled.label`
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
  const [size, setSize] = useState(24);
  const [color, setColor] = useState("#000000");
  const [family, setFamily] = useState("Helvetica");

  useEffect(() => {
    if (onChange) {
      onChange({ size, color, family });
    }
  }, [size, color, family, onChange]);

  return (
    <ToolbarWrapper>
      <Label>
        Font Size:
        <Select value={size} onChange={(e) => setSize(parseInt(e.target.value))}>
          {[12, 14, 16, 18, 20, 24, 28, 32, 36, 48].map((s) => (
            <option key={s} value={s}>
              {s}px
            </option>
          ))}
        </Select>
      </Label>

      <Label>
        Color:
        <Input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
      </Label>

      <Label>
        Font:
        <Select value={family} onChange={(e) => setFamily(e.target.value)}>
          <option value="Helvetica">Helvetica</option>
          <option value="Times-Roman">Times New Roman</option>
          <option value="Courier">Courier</option>
          <option value="Arial">Arial</option>
        </Select>
      </Label>
    </ToolbarWrapper>
  );
};

export default FontToolbar;
