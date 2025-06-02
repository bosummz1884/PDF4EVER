import { PDFDocument } from 'pdf-lib';

export async function extractPagesFromPdf(pdfBytes, pageIndices = []) {
  const sourcePdf = await PDFDocument.load(pdfBytes);
  const newPdf = await PDFDocument.create();

  const pages = await newPdf.copyPages(sourcePdf, pageIndices);
  pages.forEach((page) => newPdf.addPage(page));

  return await newPdf.save();
}
