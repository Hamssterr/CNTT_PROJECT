import React from "react";
import { X } from "lucide-react";

const BannerDetailModal = ({ isOpen, onClose, bannerDetail }) => {
  if (!isOpen || !bannerDetail) return null;

  return (
    <div className="fixed inset-0 bg-black/30 bg-opacity-40 z-40 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative ">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          <X size={24} />
        </button>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Banner Details</h3>
        <div className="space-y-4">
          <div>
            <span className="font-semibold text-gray-700">Title:</span>
            <p className="text-gray-600">{bannerDetail.title || "N/A"}</p>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Description:</span>
            <p className="text-gray-600">{bannerDetail.description || "N/A"}</p>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Button Text:</span>
            <p className="text-gray-600">{bannerDetail.buttonText || "N/A"}</p>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Button Color:</span>
            <p className="text-gray-600">{bannerDetail.buttonColor || "N/A"}</p>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Gradient:</span>
            <p className="text-gray-600">{bannerDetail.gradient || "N/A"}</p>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Course:</span>
            <p className="text-gray-600">{bannerDetail.courseId?.title || "N/A"}</p>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Number:</span>
            <p className="text-gray-600">{bannerDetail.number || "N/A"}</p>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Number Color:</span>
            <p className="text-gray-600">{bannerDetail.numberColor || "N/A"}</p>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Background Image:</span>
            <div className="mt-1">
              {bannerDetail.backgroundImage ? (
                <img
                  src={bannerDetail.backgroundImage}
                  alt={bannerDetail.title || "Banner"}
                  className="w-32 h-32 object-cover rounded"
                />
              ) : (
                <p className="text-gray-600">N/A</p>
              )}
            </div>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Created At:</span>
            <p className="text-gray-600">
              {bannerDetail.createdAt
                ? new Date(bannerDetail.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })
                : "N/A"}
            </p>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BannerDetailModal;