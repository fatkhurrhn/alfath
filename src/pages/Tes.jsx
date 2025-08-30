import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min?url";

// setup worker
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function QuranViewer() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [scale, setScale] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [jumpPage, setJumpPage] = useState("");

  let touchStartX = 0;

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(numPages); // mulai dari kanan (hal terakhir)
  };

  const goPrevPage = () => {
    if (pageNumber < numPages) setPageNumber(pageNumber + 1);
  };

  const goNextPage = () => {
    if (pageNumber > 1) setPageNumber(pageNumber - 1);
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleJumpPage = () => {
    const page = parseInt(jumpPage, 10);
    if (page >= 1 && page <= numPages) {
      setPageNumber(page);
      setJumpPage("");
    }
  };

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col items-center h-screen bg-[#f5f7fa] select-none">
      {/* Controls */}
      <div className="flex flex-wrap gap-2 p-3 bg-white border-b shadow-sm w-full justify-center z-10 text-sm font-medium text-[#355485]">
        <button
          onClick={goPrevPage}
          className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
        >
          Prev
        </button>
        <button
          onClick={goNextPage}
          className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
        >
          Next
        </button>
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={jumpPage}
            placeholder="Hal..."
            onChange={(e) => setJumpPage(e.target.value)}
            className="w-16 px-2 py-1 border rounded-lg text-center text-sm"
          />
          <button
            onClick={handleJumpPage}
            className="px-3 py-1 rounded-lg bg-[#355485] text-white hover:bg-[#2a3b5c] transition"
          >
            Go
          </button>
        </div>
        <button
          onClick={() => setScale(scale + 0.2)}
          className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
        >
          Zoom +
        </button>
        <button
          onClick={() => setScale(scale > 0.4 ? scale - 0.2 : scale)}
          className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
        >
          Zoom -
        </button>
        <button
          onClick={() => setScale(1)}
          className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
        >
          Reset
        </button>
        <button
          onClick={handleFullscreen}
          className="px-3 py-1 rounded-lg bg-[#4f90c6] text-white hover:bg-[#3a6c9d] transition"
        >
          {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        </button>
      </div>

      {/* PDF Viewer */}
      <div
        className="relative flex-1 flex justify-center items-center w-full bg-[#f5f7fa]"
        onClick={(e) => {
          const x = e.clientX;
          const width = window.innerWidth;
          if (x < width / 2) goPrevPage();
          else goNextPage();
        }}
        onTouchStart={(e) => {
          touchStartX = e.changedTouches[0].clientX;
        }}
        onTouchEnd={(e) => {
          const touchEndX = e.changedTouches[0].clientX;
          if (touchStartX - touchEndX > 50) goPrevPage();
          else if (touchEndX - touchStartX > 50) goNextPage();
        }}
      >
        <Document file="/quran-pdf/juz1.PDF" onLoadSuccess={onDocumentLoadSuccess}>
          <Page
            pageNumber={pageNumber}
            width={windowWidth * scale}
            renderAnnotationLayer={false}
            renderTextLayer={false}
          />
        </Document>

        <div className="absolute bottom-4 left-0 right-0 text-center text-sm text-gray-600">
          Halaman {pageNumber} dari {numPages}
        </div>
      </div>
    </div>
  );
}
