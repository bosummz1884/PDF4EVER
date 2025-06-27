import { useCallback, useState } from "react";
import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib";
import { usePDFStore } from "../stores/pdfStore";
import { useHistoryStore } from "../stores/historyStore";
import {
  PageOperation,
  SplitOptions,
  MergeOperation,
  ExtractRange,
  Watermark,
  HeaderFooter,
  SecuritySettings,
  ExportOptions,
} from "../types/advanced";

export function usePDFOperations() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { currentDocument, updateDocument } = usePDFStore();
  const { addHistoryState } = useHistoryStore();

  const createPDFFromArrayBuffer = useCallback(
    async (arrayBuffer: ArrayBuffer): Promise<PDFDocument> => {
      return await PDFDocument.load(arrayBuffer);
    },
    []
  );

  const performPageOperation = useCallback(
    async (operation: PageOperation) => {
      if (!currentDocument) throw new Error("No document loaded");

      setIsProcessing(true);
      setProgress(0);

      try {
        const pdfDoc = await createPDFFromArrayBuffer(
          await currentDocument.file.arrayBuffer()
        );

        switch (operation.type) {
          case "add":
            const newPage = pdfDoc.addPage();
            if (operation.parameters?.width && operation.parameters?.height) {
              newPage.setSize(
                operation.parameters.width,
                operation.parameters.height
              );
            }
            setProgress(50);
            break;

          case "delete":
            operation.pageIds.forEach((pageId, index) => {
              const pageIndex =
                parseInt(pageId.replace("page_", "")) - 1 - index;
              if (pageIndex >= 0 && pageIndex < pdfDoc.getPageCount()) {
                pdfDoc.removePage(pageIndex);
              }
            });
            setProgress(50);
            break;

          case "duplicate":
            for (const pageId of operation.pageIds) {
              const pageIndex = parseInt(pageId.replace("page_", "")) - 1;
              if (pageIndex >= 0 && pageIndex < pdfDoc.getPageCount()) {
                const [copiedPage] = await pdfDoc.copyPages(pdfDoc, [
                  pageIndex,
                ]);
                pdfDoc.insertPage(pageIndex + 1, copiedPage);
              }
            }
            setProgress(50);
            break;

          case "move":
            if (operation.targetIndex !== undefined) {
              const pageIndex =
                parseInt(operation.pageIds[0].replace("page_", "")) - 1;
              const [movedPage] = await pdfDoc.copyPages(pdfDoc, [pageIndex]);
              pdfDoc.removePage(pageIndex);
              pdfDoc.insertPage(operation.targetIndex, movedPage);
            }
            setProgress(50);
            break;

          case "rotate":
            operation.pageIds.forEach((pageId) => {
              const pageIndex = parseInt(pageId.replace("page_", "")) - 1;
              if (pageIndex >= 0 && pageIndex < pdfDoc.getPageCount()) {
                const page = pdfDoc.getPage(pageIndex);
                const rotation = operation.parameters?.rotation || 90;
                page.setRotation({ type: rotation, angle: rotation });
              }
            });
            setProgress(50);
            break;
        }

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([new Uint8Array(pdfBytes)], {
          type: "application/pdf",
        });
        const newFile = new File([blob], currentDocument.name, {
          type: "application/pdf",
        });

        updateDocument(currentDocument.id, {
          file: newFile,
          updatedAt: new Date(),
        });

        addHistoryState(`page_${operation.type}`, { operation });
        setProgress(100);
      } catch (error) {
        console.error("Page operation failed:", error);
        throw error;
      } finally {
        setIsProcessing(false);
        setProgress(0);
      }
    },
    [currentDocument, updateDocument, addHistoryState, createPDFFromArrayBuffer]
  );

  const splitDocument = useCallback(
    async (options: SplitOptions): Promise<Blob[]> => {
      if (!currentDocument) throw new Error("No document loaded");

      setIsProcessing(true);
      setProgress(0);

      try {
        const pdfDoc = await createPDFFromArrayBuffer(
          await currentDocument.file.arrayBuffer()
        );
        const totalPages = pdfDoc.getPageCount();
        const results: Blob[] = [];

        switch (options.method) {
          case "pages":
            const pagesPerFile = options.pagesPerFile || 1;
            for (let i = 0; i < totalPages; i += pagesPerFile) {
              const newDoc = await PDFDocument.create();
              const endPage = Math.min(i + pagesPerFile, totalPages);
              const pageIndices = Array.from(
                { length: endPage - i },
                (_, idx) => i + idx
              );

              const copiedPages = await newDoc.copyPages(pdfDoc, pageIndices);
              copiedPages.forEach((page) => newDoc.addPage(page));

              const pdfBytes = await newDoc.save();
              const blob = new Blob([new Uint8Array(pdfBytes)], {
                type: "application/pdf",
              });
              results.push(blob);

              setProgress(((i + pagesPerFile) / totalPages) * 100);
            }
            break;

          case "bookmarks":
            // Implementation for bookmark-based splitting
            console.log("Bookmark splitting not yet implemented");
            break;

          default:
            throw new Error(`Split method ${options.method} not supported`);
        }

        return results;
      } catch (error) {
        console.error("Document split failed:", error);
        throw error;
      } finally {
        setIsProcessing(false);
        setProgress(0);
      }
    },
    [currentDocument, createPDFFromArrayBuffer]
  );

  const mergeDocuments = useCallback(
    async (operation: MergeOperation): Promise<Blob> => {
      setIsProcessing(true);
      setProgress(0);

      try {
        const mergedDoc = await PDFDocument.create();
        const totalFiles = operation.files.length;

        for (let i = 0; i < totalFiles; i++) {
          const fileResponse = await fetch(operation.files[i]);
          const fileArrayBuffer = await fileResponse.arrayBuffer();
          const doc = await PDFDocument.load(fileArrayBuffer);

          const pageIndices = Array.from(
            { length: doc.getPageCount() },
            (_, idx) => idx
          );
          const copiedPages = await mergedDoc.copyPages(doc, pageIndices);
          copiedPages.forEach((page) => mergedDoc.addPage(page));

          setProgress(((i + 1) / totalFiles) * 100);
        }

        const pdfBytes = await mergedDoc.save();
        const blob = new Blob([new Uint8Array(pdfBytes)], {
          type: "application/pdf",
        });
        return blob;
      } catch (error) {
        console.error("Document merge failed:", error);
        throw error;
      } finally {
        setIsProcessing(false);
        setProgress(0);
      }
    },
    []
  );

  const extractPages = useCallback(
    async (range: ExtractRange): Promise<Blob> => {
      if (!currentDocument) throw new Error("No document loaded");

      setIsProcessing(true);
      setProgress(0);

      try {
        const pdfDoc = await createPDFFromArrayBuffer(
          await currentDocument.file.arrayBuffer()
        );
        const newDoc = await PDFDocument.create();

        const pageIndices = Array.from(
          { length: range.end - range.start + 1 },
          (_, i) => range.start - 1 + i
        );

        const copiedPages = await newDoc.copyPages(pdfDoc, pageIndices);
        copiedPages.forEach((page) => newDoc.addPage(page));

        const pdfBytes = await newDoc.save();
        setProgress(100);

        const blob = new Blob([new Uint8Array(pdfBytes)], {
          type: "application/pdf",
        });
        return blob;
      } catch (error) {
        console.error("Page extraction failed:", error);
        throw error;
      } finally {
        setIsProcessing(false);
        setProgress(0);
      }
    },
    [currentDocument, createPDFFromArrayBuffer]
  );

  const addWatermark = useCallback(
    async (watermark: Watermark) => {
      if (!currentDocument) throw new Error("No document loaded");

      setIsProcessing(true);
      setProgress(0);

      try {
        const pdfDoc = await createPDFFromArrayBuffer(
          await currentDocument.file.arrayBuffer()
        );
        const pages = pdfDoc.getPages();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        pages.forEach((page, index) => {
          if (
            watermark.pages === "all" ||
            (Array.isArray(watermark.pages) &&
              watermark.pages.includes(index + 1))
          ) {
            if (watermark.type === "text") {
              const { width, height } = page.getSize();
              const fontSize = watermark.style.fontSize || 24;

              let x = width / 2;
              let y = height / 2;

              // Adjust position based on alignment
              if (watermark.position.alignment.includes("top")) y = height - 50;
              if (watermark.position.alignment.includes("bottom")) y = 50;
              if (watermark.position.alignment.includes("left")) x = 50;
              if (watermark.position.alignment.includes("right"))
                x = width - 50;

              page.drawText(watermark.content, {
                x: x + watermark.position.x,
                y: y + watermark.position.y,
                size: fontSize,
                font,
                color: rgb(0.5, 0.5, 0.5),
                opacity: watermark.style.opacity,
                rotate: degrees(watermark.style.rotation), // Use degrees helper function here
              });  // Added closing parenthesis here
            }
          }

          setProgress(((index + 1) / pages.length) * 100);
        });

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([new Uint8Array(pdfBytes)], {
          type: "application/pdf",
        });
        const newFile = new File([blob], currentDocument.name, {
          type: "application/pdf",
        });

        updateDocument(currentDocument.id, {
          file: newFile,
          updatedAt: new Date(),
        });

        addHistoryState("watermark_added", { watermark });
      } catch (error) {
        console.error("Watermark addition failed:", error);
        throw error;
      } finally {
        setIsProcessing(false);
        setProgress(0);
      }
    },
    [currentDocument, updateDocument, addHistoryState, createPDFFromArrayBuffer]
  );

  const addHeaderFooter = useCallback(
    async (headerFooter: HeaderFooter) => {
      if (!currentDocument) throw new Error("No document loaded");

      setIsProcessing(true);
      setProgress(0);

      try {
        const pdfDoc = await createPDFFromArrayBuffer(
          await currentDocument.file.arrayBuffer()
        );
        const pages = pdfDoc.getPages();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        pages.forEach((page, index) => {
          if (
            headerFooter.pages === "all" ||
            (headerFooter.pages === "except-first" && index > 0) ||
            (Array.isArray(headerFooter.pages) &&
              headerFooter.pages.includes(index + 1))
          ) {
            const { width, height } = page.getSize();
            let text = headerFooter.content;

            // Replace variables
            if (headerFooter.variables.pageNumber) {
              text = text.replace("{{pageNumber}}", (index + 1).toString());
            }
            if (headerFooter.variables.totalPages) {
              text = text.replace("{{totalPages}}", pages.length.toString());
            }
            if (headerFooter.variables.date) {
              text = text.replace("{{date}}", new Date().toLocaleDateString());
            }
            if (headerFooter.variables.time) {
              text = text.replace("{{time}}", new Date().toLocaleTimeString());
            }

            let x = 50;
            if (headerFooter.position === "center") x = width / 2;
            if (headerFooter.position === "right") x = width - 50;

            const y =
              headerFooter.type === "header"
                ? height - headerFooter.style.margins.top
                : headerFooter.style.margins.bottom;

            page.drawText(text, {
              x,
              y,
              size: headerFooter.style.fontSize,
              font,
              color: rgb(0, 0, 0),
            });
          }

          setProgress(((index + 1) / pages.length) * 100);
        });

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([new Uint8Array(pdfBytes)], {
          type: "application/pdf",
        });
        const newFile = new File([blob], currentDocument.name, {
          type: "application/pdf",
        });

        updateDocument(currentDocument.id, {
          file: newFile,
          updatedAt: new Date(),
        });

        addHistoryState("header_footer_added", { headerFooter });
      } catch (error) {
        console.error("Header/Footer addition failed:", error);
        throw error;
      } finally {
        setIsProcessing(false);
        setProgress(0);
      }
    },
    [currentDocument, updateDocument, addHistoryState, createPDFFromArrayBuffer]
  );

  const applySecurity = useCallback(
    async (security: SecuritySettings) => {
      if (!currentDocument) throw new Error("No document loaded");

      setIsProcessing(true);
      setProgress(0);

      try {
        const pdfDoc = await createPDFFromArrayBuffer(
          await currentDocument.file.arrayBuffer()
        );

        // Apply encryption and permissions
        const saveOptions: any = {};

        if (security.encryption.enabled) {
          saveOptions.userPassword = security.encryption.userPassword;
          saveOptions.ownerPassword = security.encryption.ownerPassword;
        }

        // Set permissions
        const permissions: any = {};
        if (security.permissions.printing !== "none") {
          permissions.printing = security.permissions.printing === "highres" 
            ? "highResolution" 
            : "lowResolution";
        }
        
        permissions.modifying = security.permissions.editing !== "none";
        permissions.copying = security.permissions.copying;
        permissions.annotating = security.permissions.editing === "commenting" || 
                                security.permissions.editing === "all";
        permissions.fillingForms = security.permissions.editing === "form-filling" || 
                                  security.permissions.editing === "all";
        permissions.contentAccessibility = security.permissions.accessibility;
        permissions.documentAssembly = security.permissions.editing === "page-assembly" || 
                                      security.permissions.editing === "all";
        
        saveOptions.permissions = permissions;

        const pdfBytes = await pdfDoc.save(saveOptions);
        const blob = new Blob([new Uint8Array(pdfBytes)], {
          type: "application/pdf",
        });
        const newFile = new File([blob], currentDocument.name, {
          type: "application/pdf",
        });

        updateDocument(currentDocument.id, {
          file: newFile,
          updatedAt: new Date(),
        });

        addHistoryState("security_applied", { security });
        setProgress(100);
      } catch (error) {
        console.error("Security application failed:", error);
        throw error;
      } finally {
        setIsProcessing(false);
        setProgress(0);
      }
    },
    [currentDocument, updateDocument, addHistoryState, createPDFFromArrayBuffer]
  );

  const exportDocument = useCallback(
    async (options: ExportOptions): Promise<Blob> => {
      if (!currentDocument) throw new Error("No document loaded");

      setIsProcessing(true);
      setProgress(0);

      try {
        const pdfDoc = await createPDFFromArrayBuffer(
          await currentDocument.file.arrayBuffer()
        );
        
        // Apply security settings if provided
        if (options.security) {
          await applySecurity(options.security);
        }
        
        // Handle page range
        let pageIndices: number[] = [];
        if (options.pageRange) {
          if (options.pageRange.type === "all") {
            pageIndices = Array.from(
              { length: pdfDoc.getPageCount() },
              (_, i) => i
            );
          } else if (options.pageRange.type === "current") {
            // Assuming currentPage is available somewhere
            pageIndices = [0]; // Default to first page if current page is unknown
          } else if (options.pageRange.type === "range" && options.pageRange.pages) {
            pageIndices = options.pageRange.pages.map(p => p - 1);
          }
        }
        
        // Create a new document with only the selected pages if needed
        let finalDoc = pdfDoc;
        if (pageIndices.length > 0 && pageIndices.length < pdfDoc.getPageCount()) {
          finalDoc = await PDFDocument.create();
          const copiedPages = await finalDoc.copyPages(pdfDoc, pageIndices);
          copiedPages.forEach(page => finalDoc.addPage(page));
        }
        
        // Apply compression settings
        // Note: pdf-lib doesn't directly support all these compression options
        // This would require more advanced implementation
        
        // Export based on format
        let blob: Blob;
        
        switch (options.format.type) {
          case "pdf":
          case "pdf-a":
            const pdfBytes = await finalDoc.save();
            blob = new Blob([new Uint8Array(pdfBytes)], {
              type: "application/pdf",
            });
            break;
            
          case "png":
          case "jpg":
            // This would require rendering pages to canvas and converting to images
            // Simplified implementation for now
            throw new Error("Image export not implemented yet");
            
          case "docx":
          case "xlsx":
          case "html":
          case "txt":
            // These formats would require additional libraries
            throw new Error(`Export to ${options.format.type} not implemented yet`);
            
          default:
            throw new Error(`Unsupported export format: ${options.format.type}`);
        }
        
        setProgress(100);
        return blob;
      } catch (error) {
        console.error("Document export failed:", error);
        throw error;
      } finally {
        setIsProcessing(false);
        setProgress(0);
      }
    },
    [currentDocument, applySecurity]
  );

  return {
    isProcessing,
    progress,
    performPageOperation,
    splitDocument,
    mergeDocuments,
    extractPages,
    addWatermark,
    addHeaderFooter,
    applySecurity,
    exportDocument,
  };
}