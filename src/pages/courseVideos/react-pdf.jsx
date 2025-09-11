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
  const [isDownloading, setIsDownloading] = useState(false);

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

  function getFileNameFromUrl(u) {
    try {
      const parsed = new URL(u, window.location.href);
      const name = (parsed.pathname.split("/").pop() || "document.pdf").trim();
      return name.includes(".") ? name : `${name || "document"}.pdf`;
    } catch (_) {
      return "document.pdf";
    }
  }

  async function handleDownload() {
    if (!url || isDownloading) return;
    setIsDownloading(true);
    try {
      // If it's a data URL, just trigger download directly
      if (typeof url === "string" && url.startsWith("data:")) {
        const a = document.createElement("a");
        a.href = url;
        a.download = getFileNameFromUrl("document.pdf");
        document.body.appendChild(a);
        a.click();
        a.remove();
        setIsDownloading(false);
        return;
      }

      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const pdfBlob = new Blob([blob], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = getFileNameFromUrl(url);
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (e) {
      console.error("PDF download failed:", e);
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Actions bar */}
      <div className="flex items-center justify-end gap-3 mb-3">
        <a
          href={url}
          download={true}
          target="_blanck"
          className="group m-2 no-underline relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-green-500 shadow-lg text-white font-bold text-base transition-all duration-200 hover:from-green-500 hover:to-emerald-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Download PDF"
        >
          <svg
            className="w-5 h-5 text-white group-hover:animate-bounce"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16"
            />
          </svg>
          <span className="drop-shadow-sm">تحميل الكتاب</span>
          <span className="absolute -top-2 -right-2 bg-white text-emerald-600 rounded-full px-2 py-0.5 text-xs font-bold shadow group-hover:bg-emerald-100 transition-all duration-200">
            PDF
          </span>
        </a>
      </div>
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
