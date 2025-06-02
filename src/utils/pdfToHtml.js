/**
 * PDF.js renders PDFs to HTML canvas; this wrapper simulates an HTML "conversion"
 * via rendering. True semantic HTML conversion requires a server-side tool.
 */

import { pdfjsLib } from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;

export async function renderPdfAsHtml(pdfBytes, container) {
  const pdf = await pdfjsLib.getDocument({ data: pdfBytes }).promise;
  container.innerHTML = "";

  for (let i = 0; i < pdf.numPages; i++) {
    const page = await pdf.getPage(i + 1);
    const viewport = page.getViewport({ scale: 1.25 });

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: context, viewport }).promise;

    const pageWrapper = document.createElement("div");
    pageWrapper.className = "pdf-html-page mb-4";
    pageWrapper.appendChild(canvas);
    container.appendChild(pageWrapper);
  }
}
