/**
 * Note: There is no direct browser-side method to convert PDF to DOCX.
 * This function sends PDF data to a backend API or external converter.
 */

export async function convertPdfToDocx(pdfBytes) {
  const formData = new FormData();
  formData.append("file", new Blob([pdfBytes], { type: "application/pdf" }), "upload.pdf");

  const response = await fetch("https://api.cloudconvert.com/v2/convert", {
    method: "POST",
    headers: {
      Authorization: `Bearer YOUR_CLOUDCONVERT_API_KEY`, // Replace with actual key
    },
    body: JSON.stringify({
      "inputformat": "pdf",
      "outputformat": "docx",
      "file": "upload.pdf",
    }),
  });

  if (!response.ok) {
    throw new Error("Conversion failed");
  }

  const result = await response.blob();
  return result;
}
