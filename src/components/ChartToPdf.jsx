// src/components/ChartToPdf.jsx
import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';

const ChartToPdf = () => {
  const chartRef = useRef(null);

  const handleExportPDF = async () => {
    if (!chartRef.current) return;

    const canvas = await html2canvas(chartRef.current, {
      backgroundColor: '#ffffff',
      scale: 2,
    });

    const imgData = canvas.toDataURL('image/png');

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();

    const pngImage = await pdfDoc.embedPng(imgData);
    const { width, height } = page.getSize();
    const imgDims = pngImage.scaleToFit(width, height);

    page.drawImage(pngImage, {
      x: (width - imgDims.width) / 2,
      y: (height - imgDims.height) / 2,
      width: imgDims.width,
      height: imgDims.height,
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    saveAs(blob, 'chart-export.pdf');
  };

  return (
    <div>
      <div
        ref={chartRef}
        style={{
          width: '100%',
          maxWidth: 600,
          height: 400,
          background: '#f5f5f5',
          border: '2px dashed #ccc',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '1rem',
        }}
      >
        <h3>Your Chart or Visual Element Here</h3>
      </div>
      <button onClick={handleExportPDF}>
        Export Chart to PDF
      </button>
    </div>
  );
};

export default ChartToPdf;
