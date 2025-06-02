import { PDFDocument } from 'pdf-lib';

// Reorder pages by array of indices (new order)
export async function reorderPdfPages(pdfBytes, newOrder) {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const reorderedPdf = await PDFDocument.create();

  const copiedPages = await reorderedPdf.copyPages(pdfDoc, newOrder);
  copiedPages.forEach((page) => reorderedPdf.addPage(page));

  return await reorderedPdf.save();
}

// Remove specific page indices
export async function removePdfPages(pdfBytes, pageIndicesToRemove) {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const totalPages = pdfDoc.getPageCount();
  const keepIndices = Array.from({ length: totalPages }, (_, i) => i).filter(
    (i) => !pageIndicesToRemove.includes(i)
  );

  return await reorderPdfPages(pdfBytes, keepIndices);
}

// Add another PDF's pages
export async function appendPdf(originalPdfBytes, pdfToAddBytes) {
  const mainPdf = await PDFDocument.load(originalPdfBytes);
  const additionalPdf = await PDFDocument.load(pdfToAddBytes);

  const copiedPages = await mainPdf.copyPages(additionalPdf, additionalPdf.getPageIndices());
  copiedPages.forEach((page) => mainPdf.addPage(page));

  return await mainPdf.save();
}
