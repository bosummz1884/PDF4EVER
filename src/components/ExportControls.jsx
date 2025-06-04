// src/components/ExportControls.jsx
import React from "react";

const ExportControls = ({ onExport, onToggleSignature, onClearAnnotations }) => {
  return (
    <div style={styles.container}>
      <button style={styles.button} onClick={onExport}>
        💾 Export PDF
      </button>
      <button style={styles.button} onClick={onToggleSignature}>
        ✍️ Toggle Signature
      </button>
      <button style={styles.button} onClick={onClearAnnotations}>
        ❌ Clear Annotations
      </button>
    </div>
  );
};

const styles = {
  container: {
    position: "absolute",
    top: 10,
    right: 10,
    display: "flex",
    gap: "0.5rem",
    zIndex: 20,
  },
  button: {
    padding: "6px 12px",
    backgroundColor: "#1f2937",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.9rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
  },
};

export default ExportControls;
