import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Palette, Image, Settings, Sparkles } from "lucide-react";
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
        className="w-full border-2 border-gray-200 p-3 rounded-xl text-left flex items-center justify-between hover:border-blue-300 transition-all duration-200 bg-white shadow-sm"
      >
        <span className="truncate font-medium text-gray-700">
          {currentValue || `Select ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
        </span>
        <motion.div
          animate={{ rotate: showColorPicker[field] ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </button>
      
      <AnimatePresence>
        {showColorPicker[field] && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-2xl z-[10002] max-h-48 overflow-y-auto"
          >
            {options.map((option, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                type="button"
                onClick={() => {
                  handleColorChange(option.value, field);
                  toggleColorPicker(field);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors first:rounded-t-xl last:rounded-b-xl"
              >
                {field === 'gradient' ? (
                  <div 
                    className="w-8 h-8 rounded-lg border-2 border-gray-200 shadow-sm"
                    style={{
                      background: `linear-gradient(135deg, ${option.colors[0]}, ${option.colors[1]})`
                    }}
                  />
                ) : (
                  <div 
                    className="w-8 h-8 rounded-lg border-2 border-gray-200 shadow-sm"
                    style={{ backgroundColor: option.color }}
                  />
                )}
                <span className="text-sm font-medium text-gray-700">{option.name}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex justify-center items-center p-2 sm:p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ 
            type: "spring", 
            damping: 25, 
            stiffness: 300,
            duration: 0.3 
          }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl relative z-[10000] overflow-hidden max-h-[95vh] flex flex-col border border-white/20"
        >
          {/* Enhanced Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-6 py-6 text-white relative"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <Palette className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                    <Sparkles className="w-2 h-2 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">
                    {isEditMode ? "Update Banner" : "Create New Banner"}
                  </h3>
                  <p className="text-blue-100 text-sm">Design your promotional banner</p>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-2xl flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
                style={{ zIndex: 10001 }}
                disabled={loading}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>

          {/* Enhanced Form Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-6 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information Section */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 shadow-lg border border-gray-100"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Settings className="w-5 h-5 text-blue-600" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-800">Basic Information</h4>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        placeholder="Enter banner title..."
                        value={formData.title || ""}
                        onChange={(e) => handleInputChange(e, "title")}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-400 bg-white shadow-sm"
                        required
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        placeholder="Enter banner description..."
                        value={formData.description || ""}
                        onChange={(e) => handleInputChange(e, "description")}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-400 resize-none bg-white shadow-sm"
                        rows={3}
                      />
                    </div>

                    {/* Course Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Course *
                      </label>
                      <select
                        value={formData.courseId || ""}
                        onChange={handleCourseChange}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm"
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
                </motion.div>

                {/* Button Configuration Section */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-lg border border-green-100"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <Settings className="w-5 h-5 text-green-600" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-800">Button Configuration</h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Button Text */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Button Text
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., VIEW NOW"
                        value={formData.buttonText || ""}
                        onChange={(e) => handleInputChange(e, "buttonText")}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all placeholder-gray-400 bg-white shadow-sm"
                      />
                    </div>

                    {/* Button Color */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Button Color
                      </label>
                      <ColorPicker 
                        field="buttonColor" 
                        options={colorOptions.buttonColor}
                        currentValue={formData.buttonColor}
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Visual Configuration Section */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 shadow-lg border border-purple-100"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Image className="w-5 h-5 text-purple-600" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-800">Visual Configuration</h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Gradient */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Background Gradient
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
                        Number Badge Color
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
                        Number
                      </label>
                      <input
                        type="number"
                        placeholder="e.g., 12"
                        value={formData.number || ""}
                        onChange={(e) => handleInputChange(e, "number")}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all placeholder-gray-400 bg-white shadow-sm"
                        min="0"
                      />
                    </div>

                    {/* Background Image */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Background Image
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleInputChange(e, "backgroundImage")}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 bg-white shadow-sm"
                      />
                      {isEditMode &&
                        formData.backgroundImage &&
                        typeof formData.backgroundImage === "string" && (
                          <div className="mt-4">
                            <p className="text-xs text-gray-500 mb-2">Current image:</p>
                            <img
                              src={formData.backgroundImage}
                              alt="Current Background"
                              className="w-32 h-32 object-cover rounded-xl border-2 border-gray-200 shadow-md"
                            />
                          </div>
                        )}
                    </div>
                  </div>
                </motion.div>
              </form>
            </div>
          </div>

          {/* Enhanced Footer */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="border-t bg-gray-50 px-6 py-4"
          >
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 transition-all font-medium shadow-sm"
                disabled={loading}
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-3 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
              >
                {loading ? (
                  <>
                    <Loading />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    {isEditMode ? "Update Banner" : "Create Banner"}
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddBannerModal;
