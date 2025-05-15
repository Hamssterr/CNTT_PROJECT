import React from "react";
import Loading from "../../Loading";

const AddCourseModal = ({
  show,
  onClose,
  formData,
  setFormData,
  loading,
  isEditMode = false,
  handleSubmit,
  instructors = [],
}) => {
  if (!show) return null;

  

  const handleInputChange = (e, field, subField = null) => {
    const value = e.target.type === "file" ? e.target.files[0] : e.target.value;
    if (subField) {
      setFormData({
        ...formData,
        [field]: {
          ...formData[field],
          [subField]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [field]: value,
      });
    }
  };

  const handleInstructorChange = (e) => {
    const selectedId = e.target.value;
    const selectedInstructor = instructors.find((instructor) => instructor._id === selectedId);
    setFormData({
      ...formData, instructor: {
        id: selectedInstructor?._id || "",
        name: selectedInstructor?.name || ""
      }
    })
  }


  const handleDaysOfWeekChange = (day) => {
    const currentDays = formData.schedule?.daysOfWeek || [];
    if (currentDays.includes(day)) {
      setFormData({
        ...formData,
        schedule: {
          ...formData.schedule,
          daysOfWeek: currentDays.filter((d) => d !== day),
        },
      });
    } else {
      setFormData({
        ...formData,
        schedule: {
          ...formData.schedule,
          daysOfWeek: [...currentDays, day],
        },
      });
    }
  };

  const addTarget = () => {
    setFormData({
      ...formData,
      target: [...(formData.target || []), {id: `target_${Date.now()}`, description: "" }]
    })
  }

  const updateTarget = (index, value) => {
    const updatedTargets = [...(formData.target || [])];
    updatedTargets[index].description = value;
    setFormData({ ...formData, target: updatedTargets });
  };
  

  const addSection = () => {
    setFormData({
      ...formData,
      content: [
        ...(formData.content || []),
        { sectionId: `section_${Date.now()}`, title: "", lessons: [] },
      ],
    });
  };

  const addLesson = (sectionIndex) => {
    const updatedContent = [...(formData.content || [])];
    updatedContent[sectionIndex].lessons = [
      ...(updatedContent[sectionIndex].lessons || []),
      {
        lessonId: `lesson_${Date.now()}`,
        title: "",
        videoUrl: "",
        durationMinutes: 0,
      },
    ];
    setFormData({ ...formData, content: updatedContent });
  };

  const updateSection = (index, field, value) => {
    const updatedContent = [...formData.content];
    updatedContent[index][field] = value;
    setFormData({ ...formData, content: updatedContent });
  };

  const updateLesson = (sectionIndex, lessonIndex, field, value) => {
    const updatedContent = [...formData.content];
    updatedContent[sectionIndex].lessons[lessonIndex][field] = value;
    setFormData({ ...formData, content: updatedContent });
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative z-50 overflow-y-auto max-h-[90vh]">
        <h3 className="text-lg font-semibold mb-4 text-center">
          {isEditMode ? "Update Course" : "Add New Course"}
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              placeholder="Course Title"
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
              placeholder="Course Description"
              value={formData.description || ""}
              onChange={(e) => handleInputChange(e, "description")}
              className="border p-2 rounded-md w-full"
              rows={4}
            />
          </div>

          {/* Targets */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Targets
            </label>
            <button
              type="button"
              onClick={addTarget}
              className="mb-4 px-3 py-1 text-sm text-white bg-purple-600 rounded-md hover:bg-purple-700"
            >
              Add Target
            </button>
            {(formData.target || []).map((target, index) => (
              <div key={target.id} className="border p-2 mb-2 rounded-md">
                <input
                  type="text"
                  placeholder="Target Description"
                  value={target.description}
                  onChange={(e) => updateTarget(index, e.target.value)}
                  className="border p-2 rounded-md w-full"
                />
              </div>
            ))}
          </div>

          {/* Instructor */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Instructor
            </label>
            <select
              value={formData.instructor?.id || ""}
              onChange={handleInstructorChange}
              className="border p-2 rounded-md w-full"
              required
            >
              <option value="">Select Instructor</option>
              {instructors.map((instructor) => (
                <option key={instructor._id} value={instructor._id}>
                  {instructor.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              value={formData.category || ""}
              onChange={(e) => handleInputChange(e, "category")}
              className="border p-2 rounded-md w-full"
            >
              <option value="">Select Category</option>
              <option value="Programming">Programming</option>
              <option value="Theory">Theory</option>
            </select>
          </div>

          {/* Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Level
            </label>
            <select
              value={formData.level || ""}
              onChange={(e) => handleInputChange(e, "level")}
              className="border p-2 rounded-md w-full"
            >
              <option value="">Select Level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Duration
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Total Hours"
                value={formData.duration?.totalHours || ""}
                onChange={(e) => handleInputChange(e, "duration", "totalHours")}
                className="border p-2 rounded-md w-full"
                min="0"
              />
              <input
                type="date"
                value={
                  formData.duration?.startDate
                    ? new Date(formData.duration.startDate)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                onChange={(e) => handleInputChange(e, "duration", "startDate")}
                className="border p-2 rounded-md w-full"
              />
              <input
                type="date"
                value={
                  formData.duration?.endDate
                    ? new Date(formData.duration.endDate)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                onChange={(e) => handleInputChange(e, "duration", "endDate")}
                className="border p-2 rounded-md w-full"
              />
            </div>
          </div>

          {/* Price & Currency */}
          <div className="flex gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="number"
                placeholder="Price"
                value={formData.price || ""}
                onChange={(e) => handleInputChange(e, "price")}
                className="border p-2 rounded-md w-full"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Currency
              </label>
              <input
                type="text"
                placeholder="Currency (e.g., VND)"
                value={formData.currency || ""}
                onChange={(e) => handleInputChange(e, "currency")}
                className="border p-2 rounded-md w-full"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={formData.status || ""}
              onChange={(e) => handleInputChange(e, "status")}
              className="border p-2 rounded-md w-full"
              required
            >
              <option value="">Select Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Draft">Draft</option>
            </select>
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Thumbnail
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleInputChange(e, "thumbnail")}
              className="border p-2 rounded-md w-full"
            />
            {isEditMode &&
              formData.thumbnail &&
              typeof formData.thumbnail === "string" && (
                <img
                  src={formData.thumbnail}
                  alt="Current Thumbnail"
                  className="mt-2 w-20 h-20 object-cover rounded"
                />
              )}
          </div>

          {/* Max Enrollment */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Max Enrollment
            </label>
            <input
              type="number"
              placeholder="Max Enrollment"
              value={formData.maxEnrollment || ""}
              onChange={(e) => handleInputChange(e, "maxEnrollment")}
              className="border p-2 rounded-md w-full"
              min="0"
            />
          </div>

          {/* Schedule */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Schedule
            </label>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Days of Week
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((day) => (
                  <label key={day} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={
                        formData.schedule?.daysOfWeek?.includes(day) || false
                      }
                      onChange={() => handleDaysOfWeekChange(day)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    {day}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Time Slot
              </label>
              <select
                value={formData.schedule?.shift || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    schedule: { ...formData.schedule, shift: e.target.value },
                  })
                }
                className="border p-2 rounded-md w-full"
              >
                <option value="">Select Shift</option>
                <option value="18:00-20:00">Shift 1: 18:00-20:00</option>
                <option value="19:00-21:00">Shift 2: 19:00-21:00</option>
                <option value="20:00-22:00">Shift 3: 20:00-22:00</option>
              </select>
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <button
              type="button"
              onClick={addSection}
              className="mb-4 px-3 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Add Section
            </button>
            {(formData.content || []).map((section, sectionIndex) => (
              <div
                key={section.sectionId}
                className="border p-4 mb-4 rounded-md"
              >
                <input
                  type="text"
                  placeholder="Section Title"
                  value={section.title || ""}
                  onChange={(e) =>
                    updateSection(sectionIndex, "title", e.target.value)
                  }
                  className="border p-2 rounded-md w-full mb-2"
                />
                <button
                  type="button"
                  onClick={() => addLesson(sectionIndex)}
                  className="mb-2 px-3 py-1 text-sm text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  Add Lesson
                </button>
                {(section.lessons || []).map((lesson, lessonIndex) => (
                  <div
                    key={lesson.lessonId}
                    className="ml-4 border-l-2 pl-4 mb-2"
                  >
                    <input
                      type="text"
                      placeholder="Lesson Title"
                      value={lesson.title || ""}
                      onChange={(e) =>
                        updateLesson(
                          sectionIndex,
                          lessonIndex,
                          "title",
                          e.target.value
                        )
                      }
                      className="border p-2 rounded-md w-full mb-2"
                    />
                    <input
                      type="text"
                      placeholder="Video URL"
                      value={lesson.videoUrl || ""}
                      onChange={(e) =>
                        updateLesson(
                          sectionIndex,
                          lessonIndex,
                          "videoUrl",
                          e.target.value
                        )
                      }
                      className="border p-2 rounded-md w-full mb-2"
                    />
                    <input
                      type="number"
                      placeholder="Duration (minutes)"
                      value={lesson.durationMinutes || ""}
                      onChange={(e) =>
                        updateLesson(
                          sectionIndex,
                          lessonIndex,
                          "durationMinutes",
                          e.target.value
                        )
                      }
                      className="border p-2 rounded-md w-full"
                      min="0"
                    />
                  </div>
                ))}
              </div>
            ))}
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
              {isEditMode ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourseModal;