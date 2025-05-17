import React from "react";
import { X } from "lucide-react";

const BannerDetailModal = ({ isOpen, onClose, bannerDetail }) => {
  if (!isOpen || !bannerDetail) return null;

  return (
    <div className="fixed inset-0 bg-black/30 bg-opacity-40 z-40 flex justify-center items-center">
      <div className="bg-white rounded-xl p-8 w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Banner Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-semibold transition-colors duration-200"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-6 shadow-inner">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Basic Information
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-600 font-medium">Title:</span>
                  <p className="text-gray-800 mt-1">
                    {bannerDetail.title || "Not set"}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">
                    Description:
                  </span>
                  <p className="text-gray-800 mt-1">
                    {bannerDetail.description || "Not set"}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">
                    Button Text:
                  </span>
                  <p className="text-gray-800 mt-1">
                    {bannerDetail.buttonText}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 shadow-inner">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Style Configuration
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-600 font-medium">
                    Button Color:
                  </span>
                  <div className="flex items-center mt-1">
                    <span className="text-gray-800">
                      {bannerDetail.buttonColor}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">
                    Using Gradient:
                  </span>
                  <p className="text-gray-800 mt-1">
                    {bannerDetail.useGradient ? "Yes" : "No"}
                  </p>
                </div>
                {bannerDetail.useGradient && (
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-600 font-medium">
                        Gradient Start:
                      </span>
                      <div className="flex items-center mt-1">
                        <div
                          className="w-6 h-6 rounded-full mr-2"
                          style={{
                            backgroundColor: bannerDetail.gradientStart,
                          }}
                        ></div>
                        <span className="text-gray-800">
                          {bannerDetail.gradientStart}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600 font-medium">
                        Gradient End:
                      </span>
                      <div className="flex items-center mt-1">
                        <div
                          className="w-6 h-6 rounded-full mr-2"
                          style={{ backgroundColor: bannerDetail.gradientEnd }}
                        ></div>
                        <span className="text-gray-800">
                          {bannerDetail.gradientEnd}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Preview
            </h3>
            <div
              className="w-full h-80 rounded-xl shadow-lg overflow-hidden relative"
              style={{
                background: bannerDetail.gradient
                  ? `bg-gradient-to-r(${bannerDetail.gradient})`
                  : undefined,
                backgroundImage: bannerDetail.backgroundImage
                  ? `url(${bannerDetail.backgroundImage})`
                  : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-opacity-40">
                <div className="p-8 text-white">
                  <h2 className="text-2xl md:text-4xl font-extrabold flex items-center gap-2">
                    {bannerDetail.title || "Banner Title"}
                    <span className="text-yellow-400 text-xl md:text-2xl">
                      ⭐
                    </span>
                  </h2>
                  <p className="text-sm md:text-lg max-w-md md:max-w-lg">
                    {bannerDetail.description || "Banner Description"}
                  </p>
                  <button
                    style={{ backgroundColor: bannerDetail.buttonColor }}
                    className={`inline-block rounded-full px-6 py-2 font-semibold transition-colors duration-300 bg-white ${bannerDetail.buttonColor} hover:bg-gray-100 text-black`}
                  >
                    {bannerDetail.buttonText}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerDetailModal;
