const stampedPdf = await stampImageOnPdf(
  originalPdfBytes,
  uploadedImageBytes,
  100, 150, 200, 80 // x, y, width, height
);
