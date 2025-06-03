// src/components/PDFViewerControls.jsx
import React from "react";
import styled from "styled-components";

const ControlsWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin: 1.5rem 0;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: #4338ca;
  }

  &:disabled {
    background-color: #a1a1aa;
    cursor: not-allowed;
  }
`;

const Label = styled.span`
  font-weight: bold;
`;

const PDFViewerControls = ({
  currentPage,
  totalPages,
  zoomLevel,
  onPrev,
  onNext,
  onZoomIn,
  onZoomOut
}) => {
  return (
    <ControlsWrapper>
      <Button onClick={onZoomOut} disabled={zoomLevel <= 0.5}>− Zoom</Button>
      <Button onClick={onZoomIn} disabled={zoomLevel >= 3}>+ Zoom</Button>

      <Button onClick={onPrev} disabled={currentPage <= 1}>Previous</Button>
      <Label>Page {currentPage} / {totalPages}</Label>
      <Button onClick={onNext} disabled={currentPage >= totalPages}>Next</Button>
    </ControlsWrapper>
  );
};

export default PDFViewerControls;
