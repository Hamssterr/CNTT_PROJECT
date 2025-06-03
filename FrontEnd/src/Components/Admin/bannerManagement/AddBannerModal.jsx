import React, { useState } from "react";
import Loading from "../../Loading";

const AddBannerModal = ({
  show,
  onClose,
  formData,
  setFormData,
  loading,
  isEditMode = false,
  handleSubmit,
  courses = [],
}) => {
  const [showColorPicker, setShowColorPicker] = useState({
    buttonColor: false,
    numberColor: false,
    gradient: false
  });

  if (!show) return null;

  const handleInputChange = (e, field) => {
    const value = e.target.type === "file" ? e.target.files[0] : e.target.value;
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleCourseChange = (e) => {
    const selectedId = e.target.value;
    const selectedCourse = courses.find((course) => course._id === selectedId);
    setFormData({
      ...formData,
      courseId: selectedId,
      courseTitle: selectedCourse?.title || "", 
    });
  };

  const handleColorChange = (color, field) => {
    setFormData({
      ...formData,
      [field]: color,
    });
  };

  const toggleColorPicker = (field) => {
    setShowColorPicker(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Predefined color options
  const colorOptions = {
    buttonColor: [
      { name: 'Red', value: 'text-red-600', color: '#dc2626' },
      { name: 'Blue', value: 'text-blue-600', color: '#2563eb' },
      { name: 'Green', value: 'text-green-600', color: '#16a34a' },
      { name: 'Purple', value: 'text-purple-600', color: '#9333ea' },
      { name: 'Orange', value: 'text-orange-600', color: '#ea580c' },
      { name: 'Pink', value: 'text-pink-600', color: '#db2777' },
      { name: 'Indigo', value: 'text-indigo-600', color: '#4f46e5' },
      { name: 'Gray', value: 'text-gray-600', color: '#4b5563' },
    ],
    numberColor: [
      { name: 'Red', value: 'bg-red-600', color: '#dc2626' },
      { name: 'Blue', value: 'bg-blue-600', color: '#2563eb' },
      { name: 'Green', value: 'bg-green-600', color: '#16a34a' },
      { name: 'Purple', value: 'bg-purple-600', color: '#9333ea' },
      { name: 'Orange', value: 'bg-orange-600', color: '#ea580c' },
      { name: 'Pink', value: 'bg-pink-600', color: '#db2777' },
      { name: 'Indigo', value: 'bg-indigo-600', color: '#4f46e5' },
      { name: 'Gray', value: 'bg-gray-600', color: '#4b5563' },
    ],
    gradient: [
      { name: 'Blue to Cyan', value: 'from-blue-600 to-cyan-500', colors: ['#2563eb', '#06b6d4'] },
      { name: 'Purple to Pink', value: 'from-purple-600 to-pink-500', colors: ['#9333ea', '#ec4899'] },
      { name: 'Green to Blue', value: 'from-green-500 to-blue-500', colors: ['#22c55e', '#3b82f6'] },
      { name: 'Orange to Red', value: 'from-orange-500 to-red-500', colors: ['#f97316', '#ef4444'] },
      { name: 'Indigo to Purple', value: 'from-indigo-600 to-purple-600', colors: ['#4f46e5', '#9333ea'] },
      { name: 'Pink to Rose', value: 'from-pink-500 to-rose-500', colors: ['#ec4899', '#f43f5e'] },
    ]
  };

  const ColorPicker = ({ field, options, currentValue }) => (
    <div className="relative">
      <button
        type="button"
        onClick={() => toggleColorPicker(field)}
        className="w-full border p-2 rounded-md text-left flex items-center justify-between hover:border-blue-300 transition-colors"
      >
        <span className="truncate">{currentValue || `Select ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}</span>
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {showColorPicker[field] && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-48 overflow-y-auto">
          {options.map((option, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                handleColorChange(option.value, field);
                toggleColorPicker(field);
              }}
              className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 transition-colors"
            >
              {field === 'gradient' ? (
                <div 
                  className="w-6 h-6 rounded border"
                  style={{
                    background: `linear-gradient(135deg, ${option.colors[0]}, ${option.colors[1]})`
                  }}
                />
              ) : (
                <div 
                  className="w-6 h-6 rounded border"
                  style={{ backgroundColor: option.color }}
                />
              )}
              <span className="text-sm">{option.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex justify-center items-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl relative z-50 overflow-hidden max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">
              {isEditMode ? "🎨 Update Banner" : "✨ Add New Banner"}
            </h3>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/20 transition-colors"
              disabled={loading}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Section */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Basic Information
              </h4>
              
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📝 Title *
                </label>
                <input
                  type="text"
                  placeholder="Enter banner title..."
                  value={formData.title || ""}
                  onChange={(e) => handleInputChange(e, "title")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📄 Description
                </label>
                <textarea
                  placeholder="Enter banner description..."
                  value={formData.description || ""}
                  onChange={(e) => handleInputChange(e, "description")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 resize-none"
                  rows={3}
                />
              </div>

              {/* Course Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📚 Course *
                </label>
                <select
                  value={formData.courseId || ""}
                  onChange={handleCourseChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="">Select a course...</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Button Configuration Section */}
            <div className="bg-green-50 rounded-lg p-4 space-y-4">
              <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Button Configuration
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Button Text */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🔘 Button Text
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., VIEW NOW"
                    value={formData.buttonText || ""}
                    onChange={(e) => handleInputChange(e, "buttonText")}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder-gray-400"
                  />
                </div>

                {/* Button Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🎨 Button Color
                  </label>
                  <ColorPicker 
                    field="buttonColor" 
                    options={colorOptions.buttonColor}
                    currentValue={formData.buttonColor}
                  />
                </div>
              </div>
            </div>

            {/* Visual Configuration Section */}
            <div className="bg-purple-50 rounded-lg p-4 space-y-4">
              <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                Visual Configuration
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Gradient */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🌈 Background Gradient
                  </label>
                  <ColorPicker 
                    field="gradient" 
                    options={colorOptions.gradient}
                    currentValue={formData.gradient}
                  />
                </div>

                {/* Number Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🔢 Number Badge Color
                  </label>
                  <ColorPicker 
                    field="numberColor" 
                    options={colorOptions.numberColor}
                    currentValue={formData.numberColor}
                  />
                </div>

                {/* Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🔢 Number
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 12"
                    value={formData.number || ""}
                    onChange={(e) => handleInputChange(e, "number")}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder-gray-400"
                    min="0"
                  />
                </div>

                {/* Background Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🖼️ Background Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleInputChange(e, "backgroundImage")}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                  />
                  {isEditMode &&
                    formData.backgroundImage &&
                    typeof formData.backgroundImage === "string" && (
                      <div className="mt-3">
                        <p className="text-xs text-gray-500 mb-2">Current image:</p>
                        <img
                          src={formData.backgroundImage}
                          alt="Current Background"
                          className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                        />
                      </div>
                    )}
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="border-t bg-gray-50 px-6 py-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 transition-all font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2.5 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loading />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  {isEditMode ? "✅ Update Banner" : "➕ Create Banner"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBannerModal;