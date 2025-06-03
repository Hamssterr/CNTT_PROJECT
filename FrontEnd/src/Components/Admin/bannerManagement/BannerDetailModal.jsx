import React from "react";
import { X, Eye, Palette, Settings, FileText, Tag, Hash, Image, Icon } from "lucide-react";

const BannerDetailModal = ({ isOpen, onClose, bannerDetail }) => {
  if (!isOpen || !bannerDetail) return null;

  // Helper function to convert Tailwind classes to actual colors for preview
  const getTailwindColor = (className) => {
    const colorMap = {
      'text-red-600': '#dc2626',
      'text-blue-600': '#2563eb',
      'text-green-600': '#16a34a',
      'text-purple-600': '#9333ea',
      'text-orange-600': '#ea580c',
      'text-pink-600': '#db2777',
      'text-indigo-600': '#4f46e5',
      'text-gray-600': '#4b5563',
      'bg-red-600': '#dc2626',
      'bg-blue-600': '#2563eb',
      'bg-green-600': '#16a34a',
      'bg-purple-600': '#9333ea',
      'bg-orange-600': '#ea580c',
      'bg-pink-600': '#db2777',
      'bg-indigo-600': '#4f46e5',
      'bg-gray-600': '#4b5563',
    };
    return colorMap[className] || '#6b7280';
  };

  // Helper function to convert Tailwind gradient to CSS
  const getGradientCSS = (gradientClass) => {
    const gradientMap = {
      'from-blue-600 to-cyan-500': 'linear-gradient(135deg, #2563eb, #06b6d4)',
      'from-purple-600 to-pink-500': 'linear-gradient(135deg, #9333ea, #ec4899)',
      'from-green-500 to-blue-500': 'linear-gradient(135deg, #22c55e, #3b82f6)',
      'from-orange-500 to-red-500': 'linear-gradient(135deg, #f97316, #ef4444)',
      'from-indigo-600 to-purple-600': 'linear-gradient(135deg, #4f46e5, #9333ea)',
      'from-pink-500 to-rose-500': 'linear-gradient(135deg, #ec4899, #f43f5e)',
    };
    return gradientMap[gradientClass] || 'linear-gradient(135deg, #6b7280, #374151)';
  };

  const InfoCard = ({ icon: Icon, title, children, color = "blue" }) => {
    const colorClasses = {
      blue: "bg-blue-50 border-blue-200",
      green: "bg-green-50 border-green-200",
      purple: "bg-purple-50 border-purple-200",
      orange: "bg-orange-50 border-orange-200"
    };

    return (
      <div className={`${colorClasses[color]} border-2 rounded-xl p-4 md:p-6`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-lg bg-${color}-100`}>
            <Icon className={`w-5 h-5 text-${color}-600`} />
          </div>
          <h3 className="text-lg md:text-xl font-bold text-gray-800">{title}</h3>
        </div>
        <div className="space-y-3">
          {children}
        </div>
      </div>
    );
  };

  const InfoItem = ({ label, value, showColorPreview = false, colorValue }) => (
    <div className="bg-white rounded-lg p-3 shadow-sm">
      <span className="text-sm font-medium text-gray-600 block mb-1">{label}</span>
      <div className="flex items-center gap-2">
        {showColorPreview && colorValue && (
          <div 
            className="w-4 h-4 rounded border border-gray-300"
            style={{ backgroundColor: getTailwindColor(colorValue) }}
          />
        )}
        <p className="text-gray-800 font-medium break-words">{value || "Not set"}</p>
      </div>
    </div>
  );

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-4 md:px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Eye className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold">Banner Details</h2>
                <p className="text-white/80 text-sm">Complete banner information</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/20 transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="space-y-6">
            {/* Information Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <InfoCard icon={FileText} title="Basic Information" color="blue">
                <InfoItem label="📝 Title" value={bannerDetail.title} />
                <InfoItem label="📄 Description" value={bannerDetail.description} />
                <InfoItem label="🔘 Button Text" value={bannerDetail.buttonText} />
                <InfoItem label="📚 Course" value={bannerDetail.courseTitle} />
              </InfoCard>

              {/* Style Configuration */}
              <InfoCard icon={Palette} title="Style Configuration" color="purple">
                <InfoItem 
                  label="🎨 Button Color" 
                  value={bannerDetail.buttonColor} 
                  showColorPreview={true}
                  colorValue={bannerDetail.buttonColor}
                />
                <InfoItem 
                  label="🌈 Background Gradient" 
                  value={bannerDetail.gradient}
                />
                <InfoItem 
                  label="🔢 Number" 
                  value={bannerDetail.number}
                />
                <InfoItem 
                  label="🏷️ Number Color" 
                  value={bannerDetail.numberColor}
                  showColorPreview={true}
                  colorValue={bannerDetail.numberColor}
                />
              </InfoCard>
            </div>

            {/* Additional Info */}
            {bannerDetail.backgroundImage && (
              <InfoCard icon={Image} title="Background Image" color="green">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <span className="text-sm font-medium text-gray-600 block mb-3">Current Image</span>
                  <img
                    src={bannerDetail.backgroundImage}
                    alt="Background"
                    className="w-full max-w-xs h-32 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                  />
                </div>
              </InfoCard>
            )}

            {/* Live Preview */}
            <InfoCard icon={Eye} title="Live Preview" color="orange">
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div
                  className="w-full h-48 md:h-64 lg:h-80 rounded-xl shadow-lg overflow-hidden relative"
                  style={{
                    background: bannerDetail.backgroundImage
                      ? `url(${bannerDetail.backgroundImage})`
                      : bannerDetail.gradient
                      ? getGradientCSS(bannerDetail.gradient)
                      : 'linear-gradient(135deg, #6b7280, #374151)',
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {/* Overlay for better text readability */}
                  <div className="absolute inset-0 bg-black/30"></div>
                  
                  {/* Content */}
                  <div className="absolute inset-0 p-4 md:p-6 lg:p-8 flex flex-col justify-center text-white">
                    <div className="max-w-lg">
                      {/* Number Badge */}
                      {bannerDetail.number && (
                        <div className="mb-3">
                          <span 
                            className="inline-block px-3 py-1 rounded-full text-white text-sm font-bold shadow-lg"
                            style={{ backgroundColor: getTailwindColor(bannerDetail.numberColor) }}
                          >
                            {bannerDetail.number}
                          </span>
                        </div>
                      )}
                      
                      {/* Title */}
                      <h2 className="text-xl md:text-2xl lg:text-4xl font-extrabold mb-3 md:mb-4 flex items-center gap-2">
                        {bannerDetail.title || "Banner Title"}
                        <span className="text-yellow-400 text-lg md:text-xl lg:text-2xl">⭐</span>
                      </h2>
                      
                      {/* Description */}
                      <p className="text-sm md:text-base lg:text-lg mb-4 md:mb-6 opacity-90 leading-relaxed">
                        {bannerDetail.description || "Banner Description"}
                      </p>
                      
                      {/* Button */}
                      {bannerDetail.buttonText && (
                        <button
                          className={`inline-block rounded-full px-4 md:px-6 py-2 md:py-3 font-semibold text-sm md:text-base transition-all duration-300 hover:scale-105 hover:shadow-lg ${bannerDetail.buttonColor || 'text-blue-600'} bg-white shadow-md`}
                        >
                          {bannerDetail.buttonText}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </InfoCard>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 px-4 md:px-6 py-4">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
            >
              Close Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerDetailModal;