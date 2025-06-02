import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import styled from 'styled-components';
import PDFTextEditor from './components/PDFTextEditor';
import PremiumWrapper from './PremiumWrapper';
import PDFMerger from './components/PDFMerger';
import FontToolbar from './components/FontToolbar';
import AnnotationToolbar from './components/AnnotationToolbar';
import AnnotationCanvas from './components/AnnotationCanvas';
import EditableTextLayer from './components/EditableTextLayer';
import SignatureCanvasComponent from './components/SignatureCanvasComponent';
import SignatureDragLayer from './components/SignatureDragLayer';
import CloudImportWidget from './components/CloudImportWidget';
import RedactionOverlay from './components/RedactionOverlay';
import { convertPdfToText } from './utils/pdfToText';
import { convertPdfToHtml } from './utils/pdfToHtml';
import { convertPdfToDocx } from './utils/pdfToDocx';
import { convertPdfToPptx } from './utils/pdfToPptx';
import './index.css';

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
  display: flex;
  justify-content: center;
  gap: 2rem;
  font-weight: bold;

  a {
    color: var(--text-color);
    text-decoration: none;
    border-bottom: 2px solid transparent;

    &:hover {
      border-color: #888;
    }
  }
`;

export default function App() {
  const [pdfBytes, setPdfBytes] = useState(null);
  const [error, setError] = useState(null);
  const [signatureUrl, setSignatureUrl] = useState(null);

  const onFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.includes('pdf')) {
      setError('Only PDF files are supported.');
      return;
    }
    try {
      const buffer = await file.arrayBuffer();
      setPdfBytes(new Uint8Array(buffer));
      setError(null);
    } catch (err) {
      console.error('Error reading file:', err);
      setError('Failed to load PDF. Please try again.');
    }
  };

  const handleConvertAll = async () => {
    if (!pdfBytes) return;
    const [text, html, docx, pptx] = await Promise.all([
      convertPdfToText(pdfBytes),
      convertPdfToHtml(pdfBytes),
      convertPdfToDocx(pdfBytes),
      convertPdfToPptx(pdfBytes),
    ]);
    console.log({ text, html, docx, pptx });
  };

  return (
    <Router>
      <Wrapper>
        <h1>PDF4EVER Editor</h1>
        <Nav>
          <Link to="/">Edit PDF</Link>
          <Link to="/merge">Merge PDFs</Link>
        </Nav>

        <Routes>
          <Route
            path="/"
            element={
              <>
                {!pdfBytes && (
                  <InputWrapper>
                    <p>Select a PDF file to begin editing:</p>
                    <input type="file" accept="application/pdf" onChange={onFileChange} />
                    {error && <div style={{ color: 'red', marginTop: '1rem' }}>{error}</div>}
                  </InputWrapper>
                )}
                {pdfBytes && (
                  <PremiumWrapper>
                    {({ hasPremium }) => (
                      <>
                        <FontToolbar />
                        <AnnotationToolbar />
                        <PDFTextEditor pdfBytes={pdfBytes} premium={hasPremium} />

                        <AnnotationCanvas />
                        <EditableTextLayer />
                        <RedactionOverlay onRedact={(boxes) => console.log("Redacted", boxes)} />
                        <SignatureCanvasComponent onComplete={(dataUrl) => setSignatureUrl(dataUrl)} />
                        {signatureUrl && (
                          <SignatureDragLayer
                            signatureDataUrl={signatureUrl}
                            onPlace={(box) => console.log("Signature placed:", box)}
                          />
                        )}

                        <button onClick={handleConvertAll} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
                          Convert PDF to All Formats
                        </button>
                      </>
                    )}
                  </PremiumWrapper>
                )}
              </>
            }
          />
          <Route path="/merge" element={<PDFMerger />} />
        </Routes>
      </Wrapper>
    </Router>
  );
}
