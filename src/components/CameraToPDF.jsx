// src/components/CameraToPdf.jsx
import React, { useRef, useState } from "react";
import styled from "styled-components";
import { PDFDocument } from "pdf-lib";

const Wrapper = styled.div`
  margin: 2rem 0;
  text-align: center;
`;

const Video = styled.video`
  width: 100%;
  max-width: 600px;
  border: 2px solid #ccc;
  border-radius: 10px;
`;

const Canvas = styled.canvas`
  display: none;
`;

const ButtonGroup = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const CameraToPDF = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [pdfUrl, setPdfUrl] = useState(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      alert("Camera access denied or not supported.");
    }
  };

  const captureToPDF = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageDataUrl = canvas.toDataURL("image/png");
    const imageBytes = await fetch(imageDataUrl).then((res) => res.arrayBuffer());

    const pdfDoc = await PDFDocument.create();
    const pngImage = await pdfDoc.embedPng(imageBytes);

    const page = pdfDoc.addPage([pngImage.width, pngImage.height]);
    page.drawImage(pngImage, {
      x: 0,
      y: 0,
      width: pngImage.width,
      height: pngImage.height,
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    setPdfUrl(URL.createObjectURL(blob));
  };

  return (
    <Wrapper>
      <h2>Camera to PDF</h2>
      <Video ref={videoRef} autoPlay muted playsInline />
      <Canvas ref={canvasRef} />
      <ButtonGroup>
        <button onClick={startCamera}>Start Camera</button>
        <button onClick={captureToPDF}>Capture PDF</button>
      </ButtonGroup>
      {pdfUrl && (
        <p>
          <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
            View PDF
          </a>
        </p>
      )}
    </Wrapper>
  );
};

export default CameraToPDF;
