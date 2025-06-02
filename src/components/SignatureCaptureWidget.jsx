// src/components/SignatureCaptureWidget.jsx
import React, { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { sha256 } from "js-sha256";
import styled from "styled-components";

const CanvasWrapper = styled.div`
  border: 2px dashed #999;
  border-radius: 12px;
  padding: 1rem;
  background: white;
`;

const ButtonBar = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
`;

const SignatureCaptureWidget = ({ onSigned, onClose }) => {
  const sigCanvas = useRef();

  const clear = () => sigCanvas.current.clear();

  const save = () => {
    if (sigCanvas.current.isEmpty()) return;
    const dataUrl = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");
    const hash = sha256(dataUrl);
    onSigned({ dataUrl, hash });
  };

  return (
    <CanvasWrapper>
      <SignatureCanvas
        ref={sigCanvas}
        penColor="black"
        canvasProps={{ width: 500, height: 200, className: "sigCanvas" }}
      />
      <ButtonBar>
        <button onClick={clear}>Clear</button>
        <button onClick={save}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </ButtonBar>
    </CanvasWrapper>
  );
};

export default SignatureCaptureWidget;
