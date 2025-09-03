import React, { useState } from "react";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function ReactPdf({ url }) {
  const [numPages, setNumPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  function goToPrevPage() {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  }

  function goToNextPage() {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-center items-center gap-4 mb-4">
        {/* <button 
          onClick={goToPrevPage} 
          disabled={pageNumber <= 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
        Prev  ◀  
        </button> */}
        <span className="text-lg">
          Page <strong>{pageNumber}</strong> of <strong>{numPages || 0}</strong>
        </span>
        {/* <button 
          onClick={goToNextPage} 
          disabled={pageNumber >= numPages}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
           ▶ Next
        </button> */}
      </div>
      <div className="flex justify-center border rounded-lg shadow-lg p-4">
        <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
        {
          Array.from({ length: numPages }, (_, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              renderAnnotationLayer={false}
              renderTextLayer={false}
            />
          ))
        }
          {/* <Page pageNumber={pageNumber} /> */}
        </Document>
      </div>
    </div>
  );
}

export default ReactPdf;
