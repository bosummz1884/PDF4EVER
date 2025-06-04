// src/components/CameraToPDF.jsx
import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { PDFDocument } from "pdf-lib";

const Wrapper = styled.div`
  margin: 2rem 0;
  text-align: center;
`;

const Video = styled.video`
  inline-size: 100%;
  max-inline-size: 600px;
  border: 2px solid #ccc;
  border-radius: 10px;
`;

const Canvas = styled.canvas`
  display: none;
`;

const ButtonGroup = styled.div`
  margin-block-start: 1rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const Link = styled.a`
  margin-block-start: 1rem;
  display: inline-block;
  font-weight: bold;
  color: #4f46e5;
`;

const CameraToPDF = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
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
      inline,size: pngImage.width,
      block,size: pngImage.height,ght,
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });

    // Revoke previous blob if any
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);

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
        <Link href={pdfUrl} target="_blank" rel="noopener noreferrer">
          View PDF
        </Link>
      )}
    </Wrapper>
  );
};

export default CameraToPDF;
