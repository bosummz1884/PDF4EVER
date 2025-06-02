/**
 * Note: pdf-lib currently does NOT support password encryption natively.
 * We must use a Node.js backend or external tool (like qpdf or PDFKit+HummusJS)
 * if full password protection is needed.
 *
 * Here's a placeholder that throws a useful error.
 */

export async function addPasswordToPdf(pdfBytes, password) {
  throw new Error(
    "pdf-lib does not support password protection. Use a server-side tool like qpdf or a paid PDF API."
  );
}
