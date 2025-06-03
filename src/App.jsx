// src/App.jsx
import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import styled from "styled-components";
import Editor from "@/pages/editor";
import PDFTextEditor from "./components/PDFTextEditor.jsx";
import PDFMerger from "./components/PDFMerger.jsx";
import FontToolbar from "./components/FontToolbar.jsx";
import AnnotationToolbar from "./components/AnnotationToolbar.jsx";
import SignatureCaptureWidget from "./components/SignatureCaptureWidget.jsx";
import CameraToPDF from "./components/CameraToPDF.jsx";

import "./index.css";

const Wrapper = styled.div`
  padding: 2rem;
  text-align: center;
  color: var(--text-color);
  background-color: var(--bg-color);
  min-height: 100vh;
`;

const InputWrapper = styled.div`
  margin-top: 2rem;
`;

const Nav = styled.nav`
  margin-bottom: 2rem;
  margin-block-start: 2rem;
  display: flex;
  justify-content: center;
  gap: 2rem;
  font-weight: bold;

  a {
    color: var(--text-color);
    text-decoration: none;
    border-bottom: 2px solid transparent;
    padding-bottom: 4px;
    transition: border-color 0.2s ease-in-out;
  }

  a:hover {
    border-color: var(--primary-color);
  }
`;

const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  return (
    <Wrapper>
      <h1>PDF4EVER Editor</h1>

      <Nav>
        <Link to="/">Edit PDF</Link>
        <Link to="/merge">Merge PDFs</Link>
        <Link to="/camera">Camera to PDF</Link>
      </Nav>

      <Routes>
        <Route
          path="/"
          element={
            <>
              <InputWrapper>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                />
              </InputWrapper>
              {selectedFile && <PDFTextEditor file={selectedFile} />}
              <FontToolbar onChange={(opts) => console.log("Font opts", opts)} />
              <AnnotationToolbar
                onTextInsert={(text) => console.log("Insert:", text)}
                onHighlight={() => console.log("Highlight")}
                onReset={() => setSelectedFile(null)}
              />
            </>
          }
        />
        <Route path="/editor" component={Editor} />
        <Route path="/merge" element={<PDFMerger />} />
        <Route path="/camera" element={<CameraToPDF />} />
      </Routes>
    </Wrapper>
  );
};

export default App;
