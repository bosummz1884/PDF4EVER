import React from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const ChartToPdf = ({ onGenerated }) => {
  const labels = ['A', 'B', 'C', 'D'];
  const values = [30, 70, 100, 50];

  const generateChartPdf = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);

    const maxValue = Math.max(...values);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 14;
    let y = 380;

    page.drawText("Bar Chart Example", {
      x: 50,
      y: y,
      size: 20,
      font,
      color: rgb(0, 0, 0),
    });

    y -= 40;

    labels.forEach((label, index) => {
      const barWidth = (values[index] / maxValue) * 300;

      // Label
      page.drawText(label, {
        x: 50,
        y: y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });

      // Bar
      page.drawRectangle({
        x: 80,
        y: y - 5,
        width: barWidth,
        height: 15,
        color: rgb(0.2, 0.5, 0.9),
      });

      // Value
      page.drawText(values[index].toString(), {
        x: 90 + barWidth,
        y: y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });

      y -= 30;
    });

    const pdfBytes = await pdfDoc.save();
    onGenerated(new Uint8Array(pdfBytes));
  };

  return (
    <button
      onClick={generateChartPdf}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '10px 16px',
        background: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '1rem'
      }}
    >
      📊 Generate Chart PDF
    </button>
  );
};

export default ChartToPdf;
