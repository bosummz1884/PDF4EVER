import { PDFDocument, degrees } from 'pdf-lib';

export async function rotatePdfPages(pdfBytes, rotations = {}) {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pages = pdfDoc.getPages();

  Object.entries(rotations).forEach(([pageIndex, angle]) => {
    const index = parseInt(pageIndex, 10);
    if (pages[index]) {
      pages[index].setRotation(degrees(angle));
    }
  });

  return await pdfDoc.save();
}
