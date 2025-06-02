// src/components/PDFMerger.jsx
import React, { useState } from "react";
import { mergePDFs } from "../utils/mergePDFs";
import styled from "styled-components";

const MergerContainer = styled.div`
  margin: 2rem 0;
  padding: 2rem;
  border: 2px dashed #ccc;
  border-radius: 10px;
  background-color: #fafafa;
`;

const Input = styled.input`
  margin-bottom: 1rem;
`;

const PDFMerger = () => {
  const [mergedUrl, setMergedUrl] = useState(null);

  const handleMerge = async (e) => {
    const files = Array.from(e.target.files).filter((file) =>
      file.type.includes("pdf")
    );

    const buffers = await Promise.all(files.map((file) => file.arrayBuffer()));
    const mergedPdfBytes = await mergePDFs(buffers);

    const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    setMergedUrl(url);
  };

  return (
    <MergerContainer>
      <h2>Merge PDF Files</h2>
      <Input type="file" multiple accept="application/pdf" onChange={handleMerge} />
      {mergedUrl && (
        <p>
          <a href={mergedUrl} target="_blank" rel="noopener noreferrer">
            View Merged PDF
          </a>
        </p>
      )}
    </MergerContainer>
  );
};

export default PDFMerger;
