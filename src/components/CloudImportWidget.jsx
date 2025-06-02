import React from 'react';

const CloudImportWidget = ({ onImport }) => {
  const pickCloudFile = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf';

    input.onchange = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const arrayBuffer = await file.arrayBuffer();
      onImport(new Uint8Array(arrayBuffer), file.name);
    };

    input.click();
  };

  return (
    <button
      onClick={pickCloudFile}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '10px 16px',
        background: '#6c63ff',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '1rem'
      }}
    >
      ☁️ Import from Cloud
    </button>
  );
};

export default CloudImportWidget;
