import { PDFDocument } from 'pdf-lib';

export async function updatePdfMetadata(pdfBytes, metadata = {}) {
  const pdfDoc = await PDFDocument.load(pdfBytes);

  const { title, author, subject, keywords } = metadata;

  if (title) pdfDoc.setTitle(title);
  if (author) pdfDoc.setAuthor(author);
  if (subject) pdfDoc.setSubject(subject);
  if (keywords) pdfDoc.setKeywords(Array.isArray(keywords) ? keywords : [keywords]);

  return await pdfDoc.save();
}
