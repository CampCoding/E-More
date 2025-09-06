import React, { useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// Worker (react-pdf v6/v7)
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function ReactPdf({
  url,
  paginate = false,          // false = render all pages (continuous); true = one page with prev/next
  maxWidth = 1200,           // cap page width (px) for super wide screens
  className = "",
}) {
  const wrapperRef = useRef(null);
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [containerWidth, setContainerWidth] = useState(0);

  // Keep the PDF width equal to the container (responsive)
  useEffect(() => {
    if (!wrapperRef.current) return;

    // Prefer ResizeObserver for accurate container width
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      const w = Math.floor(entry.contentRect.width);
      setContainerWidth(w > 0 ? w : 1);
    });
    ro.observe(wrapperRef.current);

    return () => ro.disconnect();
  }, []);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages || 0);
    setPageNumber(1);
  }

  function onDocumentLoadError(err) {
    // Optional: surface error to your UI/toast
    console.error("PDF load error:", err);
  }

  const pages = useMemo(() => {
    if (!numPages) return [];
    return paginate ? [pageNumber] : Array.from({ length: numPages }, (_, i) => i + 1);
  }, [numPages, pageNumber, paginate]);

  const canPrev = paginate && pageNumber > 1;
  const canNext = paginate && numPages > 0 && pageNumber < numPages;

  const pageWidth = Math.min(maxWidth, containerWidth || 1);

  return (
    <div className={`w-full ${className}`}>
      {/* Toolbar (only when paginating) */}
      {paginate && (
        <div className="flex flex-wrap items-center justify-center gap-3 mb-3">
          <button
            onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
            disabled={!canPrev}
            className="px-3 py-2 rounded bg-blue-600 text-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ◀ Prev
          </button>
          <span className="text-sm md:text-base">
            Page <strong>{numPages ? pageNumber : 0}</strong> of{" "}
            <strong>{numPages || 0}</strong>
          </span>
          <button
            onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
            disabled={!canNext}
            className="px-3 py-2 rounded bg-blue-600 text-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next ▶
          </button>
        </div>
      )}

      {/* Viewer */}
      <div
        ref={wrapperRef}
        className="mx-auto w-full max-w-screen-lg border rounded-lg shadow-sm p-2 sm:p-4 bg-white"
      >
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={<div className="p-6 text-center text-gray-600">Loading PDF…</div>}
          error={<div className="p-6 text-center text-red-600">Failed to load PDF.</div>}
        >
          {pages.map((n) => (
            <div key={`page-wrap-${n}`} className="flex justify-center mb-4 last:mb-0">
              <Page
                pageNumber={n}
                width={pageWidth}                 // 🔥 makes it responsive
                renderAnnotationLayer={false}     // better perf on mobile
                renderTextLayer={false}           // turn on if you need selectable text
              />
            </div>
          ))}
        </Document>
      </div>

      {/* Page count (when not paginating) */}
      {!paginate && (
        <div className="text-center mt-3 text-sm text-gray-600">
          {numPages ? `Total pages: ${numPages}` : " "}
        </div>
      )}
    </div>
  );
}

export default ReactPdf;
