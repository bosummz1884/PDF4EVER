import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { sha256 } from 'js-sha256';

const SignatureCaptureWidget = ({ onSigned, onClose }) => {
  const sigRef = useRef(null);

  const saveSignature = async () => {
    if (!sigRef.current) return;

    const dataUrl = sigRef.current.toDataURL();
    const byteString = atob(dataUrl.split(',')[1]);
    const bytes = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      bytes[i] = byteString.charCodeAt(i);
    }

    const hash = sha256(bytes);
    onSigned && onSigned(bytes, hash);
    onClose && onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        background: 'white',
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: '0 0 20px rgba(0,0,0,0.2)',
        width: '90%',
        maxWidth: '400px'
      }}
    >
      <h3>🖊️ Sign Below</h3>
      <SignatureCanvas
        ref={sigRef}
        penColor="black"
        backgroundColor="#f5f5f5"
        canvasProps={{ width: 350, height: 200, className: 'sigCanvas' }}
      />
      <div style={{ marginTop: '1rem' }}>
        <button
          onClick={saveSignature}
          style={{
            padding: '10px 16px',
            background: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          ✅ Save Signature
        </button>
      </div>
    </div>
  );
};

export default SignatureCaptureWidget;
