/**
 * Basic PDF form field detector using pdf-lib
 * Detects text fields and their positions in a loaded PDF.
 */

import { PDFDocument } from 'pdf-lib';

/**
 * Detects and returns form fields metadata from a PDF.
 * @param {Uint8Array} pdfBytes - The loaded PDF file bytes
 * @returns {Promise<Array>} - Array of detected form field objects
 */
export async function detectFormFields(pdfBytes) {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const form = pdfDoc.getForm();

  const fields = form.getFields();
  return fields.map((field) => {
    const name = field.getName();
    const type = field.constructor.name;

    return {
      name,
      type,
    };
  });
}
