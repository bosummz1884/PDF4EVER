// src/components/PDFMerger.jsx
import React, { useState } from "react";
import styled from "styled-components";
import { PDFDocument } from "pdf-lib";

const Wrapper = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const FileInput = styled.input`
  margin-top: 1rem;
`;

const FileList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1rem 0;
`;

const FileItem = styled.li`
  background: #f4f4f4;
  border: 1px solid #ddd;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MoveButton = styled.button`
  font-size: 14px;
  padding: 0.3rem 0.6rem;
  background-color: var(--primary-color);
  border-radius: 4px;
  border: none;
  color: white;
  cursor: pointer;
  margin-left: 0.5rem;
`;

const PDFMerger = () => {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [downloadUrl, setDownloadUrl] = useState("");

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setPdfFiles((prev) => [...prev, ...files]);
  };

  const moveFile = (index, direction) => {
    const newList = [...pdfFiles];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newList.length) return;
    [newList[index], newList[targetIndex]] = [newList[targetIndex], newList[index]];
    setPdfFiles(newList);
  };

  const mergePDFs = async () => {
    const mergedPdf = await PDFDocument.create();

    for (const file of pdfFiles) {
      const arrayBuffer = await file.arrayBuffer();
      const loadedPdf = await PDFDocument.load(arrayBuffer);
      const copiedPages = await mergedPdf.copyPages(loadedPdf, loadedPdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedBytes = await mergedPdf.save();
    const blob = new Blob([mergedBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    setDownloadUrl(url);
  };

  return (
    <Wrapper>
      <h2>Merge PDF Files</h2>
      <FileInput type="file" accept="application/pdf" multiple onChange={handleFileChange} />

      <FileList>
        {pdfFiles.map((file, index) => (
          <FileItem key={index}>
            {file.name}
            <div>
              <MoveButton onClick={() => moveFile(index, -1)}>↑</MoveButton>
              <MoveButton onClick={() => moveFile(index, 1)}>↓</MoveButton>
            </div>
          </FileItem>
        ))}
      </FileList>

      <button onClick={mergePDFs} disabled={pdfFiles.length < 2}>
        Merge PDFs
      </button>

      {downloadUrl && (
        <p style={{ marginTop: "1rem" }}>
          <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
            Download Merged PDF
          </a>
        </p>
      )}
    </Wrapper>
  );
};

export default PDFMerger;
