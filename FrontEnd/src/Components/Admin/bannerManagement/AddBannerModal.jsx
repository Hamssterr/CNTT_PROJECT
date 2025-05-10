import React from "react";
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

  return (
    <div className="fixed inset-0 bg-black/30 z-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative z-50 overflow-y-auto max-h-[90vh]">
        <h3 className="text-lg font-semibold mb-4 text-center">
          {isEditMode ? "Update Banner" : "Add New Banner"}
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              placeholder="Banner Title"
              value={formData.title || ""}
              onChange={(e) => handleInputChange(e, "title")}
              className="border p-2 rounded-md w-full"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              placeholder="Banner Description"
              value={formData.description || ""}
              onChange={(e) => handleInputChange(e, "description")}
              className="border p-2 rounded-md w-full"
              rows={4}
            />
          </div>

          {/* Button Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Button Text
            </label>
            <input
              type="text"
              placeholder="Button Text (e.g., VIEW NOW)"
              value={formData.buttonText || ""}
              onChange={(e) => handleInputChange(e, "buttonText")}
              className="border p-2 rounded-md w-full"
            />
          </div>

          {/* Button Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Button Color
            </label>
            <input
              type="text"
              placeholder="Button Color (e.g., text-red-600)"
              value={formData.buttonColor || ""}
              onChange={(e) => handleInputChange(e, "buttonColor")}
              className="border p-2 rounded-md w-full"
            />
          </div>

          {/* Gradient */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Gradient
            </label>
            <input
              type="text"
              placeholder="Gradient (e.g., from-blue-600 to-cyan-500)"
              value={formData.gradient || ""}
              onChange={(e) => handleInputChange(e, "gradient")}
              className="border p-2 rounded-md w-full"
            />
          </div>

          {/* Course */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Course
            </label>
            <select
              value={formData.courseId || ""}
              onChange={handleCourseChange}
              className="border p-2 rounded-md w-full"
              required
            >
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          {/* Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Number
            </label>
            <input
              type="number"
              placeholder="Number (e.g., 12)"
              value={formData.number || ""}
              onChange={(e) => handleInputChange(e, "number")}
              className="border p-2 rounded-md w-full"
              min="0"
            />
          </div>

          {/* Number Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Number Color
            </label>
            <input
              type="text"
              placeholder="Number Color (e.g., bg-indigo-600)"
              value={formData.numberColor || ""}
              onChange={(e) => handleInputChange(e, "numberColor")}
              className="border p-2 rounded-md w-full"
            />
          </div>

          {/* Background Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Background Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleInputChange(e, "backgroundImage")}
              className="border p-2 rounded-md w-full"
            />
            {isEditMode &&
              formData.backgroundImage &&
              typeof formData.backgroundImage === "string" && (
                <img
                  src={formData.backgroundImage}
                  alt="Current Background Image"
                  className="mt-2 w-20 h-20 object-cover rounded"
                />
              )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm text-white bg-green-600 rounded-md hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? <Loading /> : isEditMode ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBannerModal;