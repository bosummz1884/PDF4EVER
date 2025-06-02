import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;

/**
 * Extracts all text content from a PDF file
 * @param {Uint8Array} pdfBytes - PDF file bytes
 * @returns {Promise<string>} full text content
 */
export async function extractPdfText(pdfBytes) {
  const pdf = await getDocument({ data: pdfBytes }).promise;
  const totalPages = pdf.numPages;
  let fullText = "";

  for (let i = 1; i <= totalPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((item) => item.str).join(" ");
    fullText += strings + "\n";
  }

  return fullText.trim();
}
