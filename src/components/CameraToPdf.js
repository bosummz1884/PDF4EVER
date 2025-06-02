import React from 'react';

const CameraToPDF = ({ onPhotoCaptured }) => {
  const captureAndSendPhoto = async () => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment'; // Prefer back camera on mobile

      input.onchange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
          const arrayBuffer = e.target.result;
          onPhotoCaptured(new Uint8Array(arrayBuffer));
        };
        reader.readAsArrayBuffer(file);
      };

      input.click();
    } catch (err) {
      console.error("Camera capture failed:", err);
    }
  };

  return (
    <button
      onClick={captureAndSendPhoto}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '10px 16px',
        background: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '1rem'
      }}
    >
      📷 Scan with Camera
    </button>
  );
};

export default CameraToPDF;
