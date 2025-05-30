import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ZoomOut, Download, Maximize2 } from "lucide-react";

const PdfViewer = ({ fileUrl, fileName, onClose }) => {
  const [scale, setScale] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.5));
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative bg-gray-900 rounded-xl shadow-2xl w-[98vw] h-[98vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header - Thu gọn lại */}
          <div className="flex items-center justify-between px-4 py-2 bg-gray-800 rounded-t-xl border-b border-gray-700">
            <span className="font-semibold text-white truncate">
              {fileName}
            </span>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-gray-700 rounded-lg p-1">
                <button
                  onClick={handleZoomOut}
                  className="p-1.5 hover:bg-gray-600 rounded-lg text-gray-300 hover:text-white transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut size={18} />
                </button>
                <span className="text-gray-300 min-w-[2.5rem] text-center text-sm">
                  {Math.round(scale * 100)}%
                </span>
                <button
                  onClick={handleZoomIn}
                  className="p-1.5 hover:bg-gray-600 rounded-lg text-gray-300 hover:text-white transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn size={18} />
                </button>
              </div>
              <a
                href={fileUrl}
                download={fileName}
                className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-300 hover:text-white transition-colors"
                title="Download PDF"
              >
                <Download size={18} />
              </a>
              <button
                className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-300 hover:text-white transition-colors"
                onClick={onClose}
                title="Close"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* PDF Viewer - Tối ưu không gian */}
          <div className="flex-1 overflow-hidden bg-gray-800 p-2">
            <div
              className="w-full h-full overflow-auto bg-gray-900 rounded-lg"
              style={{
                maxHeight: "calc(98vh - 48px)", // 48px là chiều cao của header
              }}
            >
              <div
                className="min-h-full w-full flex items-center justify-center"
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: "center top",
                  transition: "transform 0.2s ease-in-out",
                }}
              >
                <iframe
                  src={fileUrl}
                  title={fileName}
                  className="w-full h-full bg-white rounded-lg shadow-2xl"
                  style={{
                    minHeight: "calc(98vh - 48px)",
                    width: "100%",
                  }}
                  frameBorder="0"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PdfViewer;
