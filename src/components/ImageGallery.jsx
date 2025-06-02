import React from "react";

export default function ImageGallery({ images = [], onRemove }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
      {images.map((img, index) => (
        <div key={index} style={{ textAlign: "center" }}>
          <img
            src={typeof img === "string" ? img : URL.createObjectURL(img)}
            alt={`Image ${index + 1}`}
            style={{ width: 150, height: "auto", border: "1px solid #ccc", borderRadius: 8 }}
          />
          <button
            onClick={() => onRemove(index)}
            style={{
              marginTop: "0.5rem",
              background: "#d63031",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              padding: "6px 10px",
              cursor: "pointer"
            }}
          >
            🗑 Remove
          </button>
        </div>
      ))}
    </div>
  );
}
