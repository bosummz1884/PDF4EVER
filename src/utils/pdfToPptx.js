/**
 * Browser-based PDF to PPTX conversion is not natively supported.
 * This implementation uses a third-party API to do the conversion.
 */

export async function convertPdfToPptx(pdfBytes) {
  const formData = new FormData();
  formData.append("file", new Blob([pdfBytes], { type: "application/pdf" }), "upload.pdf");

  const response = await fetch("https://api.cloudconvert.com/v2/convert", {
    method: "POST",
    headers: {
      Authorization: `Bearer YOUR_CLOUDCONVERT_API_KEY`,
    },
    body: JSON.stringify({
      "inputformat": "pdf",
      "outputformat": "pptx",
      "file": "upload.pdf",
    }),
  });

  if (!response.ok) {
    throw new Error("Conversion to PPTX failed");
  }

  const pptxBlob = await response.blob();
  return pptxBlob;
}
