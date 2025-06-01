import React from "react";

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
    const selectedInstructor = instructors.find(
      (instructor) => instructor._id === selectedId
    );
    setFormData({
      ...formData,
      instructor: {
        id: selectedInstructor?._id || "",
        name: selectedInstructor?.name || "",
      },
    });
  };

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
      target: [
        ...(formData.target || []),
        { id: `target_${Date.now()}`, description: "" },
      ],
    });
  };

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

  const removeTarget = (index) => {
    const updatedTargets = formData.target.filter((_, i) => i !== index);
    setFormData({ ...formData, target: updatedTargets });
  };

  const removeSection = (index) => {
    const updatedContent = formData.content.filter((_, i) => i !== index);
    setFormData({ ...formData, content: updatedContent });
  };

  const removeLesson = (sectionIndex, lessonIndex) => {
    const updatedContent = [...formData.content];
    updatedContent[sectionIndex].lessons = updatedContent[
      sectionIndex
    ].lessons.filter((_, i) => i !== lessonIndex);
    setFormData({ ...formData, content: updatedContent });
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-purple-900/20 to-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-in fade-in duration-300">
      <div className="bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl w-full max-w-4xl relative overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/80 via-blue-600/80 to-indigo-600/80"></div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-center mb-2">
              {isEditMode ? "✨ Update Course" : "🎓 Create New Course"}
            </h3>
            <p className="text-center text-purple-100 text-sm">
              {isEditMode
                ? "Enhance your course with new updates"
                : "Build an amazing learning experience"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200 z-20"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="max-h-[calc(90vh-200px)] overflow-y-auto custom-scrollbar">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Basic Information Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">
                  1
                </span>
                Basic Information
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Course Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter an engaging course title..."
                    value={formData.title || ""}
                    onChange={(e) => handleInputChange(e, "title")}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/80"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    placeholder="Describe what students will learn and achieve..."
                    value={formData.description || ""}
                    onChange={(e) => handleInputChange(e, "description")}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/80 resize-none font-mono text-sm leading-relaxed"
                    rows={8}
                    style={{ whiteSpace: "pre-wrap" }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category || ""}
                    onChange={(e) => handleInputChange(e, "category")}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/80"
                  >
                    <option value="">Select Category</option>
                    <option value="Programming">💻 Programming</option>
                    <option value="Theory">📚 Theory</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Level
                  </label>
                  <select
                    value={formData.level || ""}
                    onChange={(e) => handleInputChange(e, "level")}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/80"
                  >
                    <option value="">Select Level</option>
                    <option value="Beginner">🌱 Beginner</option>
                    <option value="Intermediate">🌿 Intermediate</option>
                    <option value="Advanced">🌳 Advanced</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Learning Targets */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">
                  2
                </span>
                Learning Targets
              </h4>

              <button
                type="button"
                onClick={addTarget}
                className="mb-4 px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                ➕ Add Learning Target
              </button>

              <div className="space-y-3">
                {(formData.target || []).map((target, index) => (
                  <div
                    key={target.id}
                    className="bg-white/80 rounded-xl p-4 border border-green-200 group hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex gap-3">
                      <span className="bg-green-100 text-green-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-1">
                        {index + 1}
                      </span>
                      <input
                        type="text"
                        placeholder="What will students achieve?"
                        value={target.description}
                        onChange={(e) => updateTarget(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all duration-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeTarget(index)}
                        className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg p-2 transition-all duration-200 opacity-0 group-hover:opacity-100"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructor & Pricing */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">
                  3
                </span>
                Instructor & Pricing
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Instructor
                  </label>
                  <select
                    value={formData.instructor?.id || ""}
                    onChange={handleInstructorChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 bg-white/80"
                    required
                  >
                    <option value="">👨‍🏫 Select Instructor</option>
                    {instructors.map((instructor) => (
                      <option key={instructor._id} value={instructor._id}>
                        {instructor.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={formData.price || ""}
                    onChange={(e) => handleInputChange(e, "price")}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 bg-white/80"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Currency
                  </label>
                  <input
                    type="text"
                    placeholder="VND"
                    value={formData.currency || ""}
                    onChange={(e) => handleInputChange(e, "currency")}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 bg-white/80"
                  />
                </div>
              </div>
            </div>

            {/* Duration & Schedule */}
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-100">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">
                  4
                </span>
                Duration & Schedule
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Total Hours
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={formData.duration?.totalHours || ""}
                    onChange={(e) =>
                      handleInputChange(e, "duration", "totalHours")
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 bg-white/80"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={
                      formData.duration?.startDate
                        ? new Date(formData.duration.startDate)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      handleInputChange(e, "duration", "startDate")
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 bg-white/80"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={
                      formData.duration?.endDate
                        ? new Date(formData.duration.endDate)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      handleInputChange(e, "duration", "endDate")
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 bg-white/80"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
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
                      <label
                        key={day}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={
                            formData.schedule?.daysOfWeek?.includes(day) ||
                            false
                          }
                          onChange={() => handleDaysOfWeekChange(day)}
                          className="h-5 w-5 text-orange-500 border-gray-300 rounded focus:ring-orange-300"
                        />
                        <span
                          className={`text-sm font-medium ${
                            formData.schedule?.daysOfWeek?.includes(day)
                              ? "text-orange-500"
                              : "text-gray-700"
                          }`}
                        >
                          {day.slice(0, 3)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Time Slot
                  </label>
                  <select
                    value={formData.schedule?.shift || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        schedule: {
                          ...formData.schedule,
                          shift: e.target.value,
                        },
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 bg-white/80"
                  >
                    <option value="">⏰ Select Time Slot</option>
                    <option value="18:00-20:00">🌅 Shift 1: 18:00-20:00</option>
                    <option value="19:00-21:00">🌇 Shift 2: 19:00-21:00</option>
                    <option value="20:00-22:00">🌃 Shift 3: 20:00-22:00</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Course Content */}
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">
                  5
                </span>
                Course Content
              </h4>

              <button
                type="button"
                onClick={addSection}
                className="mb-6 px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-xl hover:from-indigo-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                📚 Add New Section
              </button>

              <div className="space-y-6">
                {(formData.content || []).map((section, sectionIndex) => (
                  <div
                    key={section.sectionId}
                    className="bg-white/80 rounded-xl p-6 border border-indigo-200 shadow-sm"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <span className="bg-indigo-100 text-indigo-600 rounded-full w-10 h-10 flex items-center justify-center font-bold">
                        {sectionIndex + 1}
                      </span>
                      <input
                        type="text"
                        placeholder="Section title..."
                        value={section.title || ""}
                        onChange={(e) =>
                          updateSection(sectionIndex, "title", e.target.value)
                        }
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => removeSection(sectionIndex)}
                        className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg p-2 transition-all duration-200"
                      >
                        🗑️
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => addLesson(sectionIndex)}
                      className="mb-4 px-4 py-2 bg-gradient-to-r from-green-400 to-emerald-400 text-white rounded-lg hover:from-green-500 hover:to-emerald-500 transition-all duration-200 text-sm"
                    >
                      ➕ Add Lesson
                    </button>

                    <div className="space-y-4">
                      {(section.lessons || []).map((lesson, lessonIndex) => (
                        <div
                          key={lesson.lessonId}
                          className="ml-6 bg-gray-50 rounded-lg p-4 border-l-4 border-indigo-400"
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <span className="bg-indigo-200 text-indigo-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                              {lessonIndex + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                removeLesson(sectionIndex, lessonIndex)
                              }
                              className="ml-auto text-red-400 hover:text-red-600 hover:bg-red-50 rounded p-1 transition-all duration-200"
                            >
                              ❌
                            </button>
                          </div>

                          <div className="grid gap-3">
                            <input
                              type="text"
                              placeholder="Lesson title..."
                              value={lesson.title || ""}
                              onChange={(e) =>
                                updateLesson(
                                  sectionIndex,
                                  lessonIndex,
                                  "title",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
                            />
                            <input
                              type="text"
                              placeholder="Video URL..."
                              value={lesson.videoUrl || ""}
                              onChange={(e) =>
                                updateLesson(
                                  sectionIndex,
                                  lessonIndex,
                                  "videoUrl",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
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
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
                              min="0"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Settings */}
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="bg-gray-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">
                  6
                </span>
                Additional Settings
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status || ""}
                    onChange={(e) => handleInputChange(e, "status")}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gray-500 focus:ring-2 focus:ring-gray-200 transition-all duration-200 bg-white/80"
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="Active">✅ Active</option>
                    <option value="Inactive">❌ Inactive</option>
                    <option value="Draft">📝 Draft</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Max Enrollment
                  </label>
                  <input
                    type="number"
                    placeholder="50"
                    value={formData.maxEnrollment || ""}
                    onChange={(e) => handleInputChange(e, "maxEnrollment")}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gray-500 focus:ring-2 focus:ring-gray-200 transition-all duration-200 bg-white/80"
                    min="0"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Course Thumbnail
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleInputChange(e, "thumbnail")}
                    className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl focus:border-gray-500 transition-all duration-200 bg-white/80 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                  />
                  {isEditMode &&
                    formData.thumbnail &&
                    typeof formData.thumbnail === "string" && (
                      <img
                        src={formData.thumbnail}
                        alt="Current Thumbnail"
                        className="mt-4 w-32 h-24 object-cover rounded-lg shadow-md border-2 border-gray-200"
                      />
                    )}
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 px-8 py-6 border-t border-gray-200 flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-8 py-3 text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium disabled:opacity-50 disabled:transform-none min-w-[120px]"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                Processing...
              </div>
            ) : (
              <span className="flex items-center justify-center">
                {isEditMode ? " Update Course" : " Create Course"}
              </span>
            )}
          </button>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #6366f1, #8b5cf6);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #4f46e5, #7c3aed);
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-in-from-bottom-4 {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-in {
          animation-fill-mode: both;
        }

        .fade-in {
          animation-name: fade-in;
        }

        .slide-in-from-bottom-4 {
          animation-name: slide-in-from-bottom-4;
        }

        .duration-300 {
          animation-duration: 300ms;
        }

        .duration-500 {
          animation-duration: 500ms;
        }
      `}</style>
    </div>
  );
};

export default AddCourseModal;
