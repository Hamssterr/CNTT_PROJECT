import React from "react";

const ViewCourseModal = ({ isOpen, onClose, course, instructorList }) => {
  if (!isOpen || !course) return null;

  // Tìm giảng viên từ instructorList dựa trên course.instructor.id
  const instructor = instructorList?.find(
    (i) => i._id === course.instructor?.id
  );

  // Định dạng duration
  const formatDuration = (duration) => {
    if (!duration) return "N/A";
    const { totalHours, startDate, endDate } = duration;
    const start = startDate
      ? new Date(startDate).toLocaleDateString("vi-VN")
      : "N/A";
    const end = endDate ? new Date(endDate).toLocaleDateString("vi-VN") : "N/A";
    return `${totalHours || "N/A"} hours, from ${start} to ${end}`;
  };

  return (
    <div className="fixed inset-0 bg-black/30 bg-opacity-40 z-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl relative z-50 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4 text-center">
          Course Details
        </h3>
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <p>
              <strong>Title:</strong> {course.title || "N/A"}
            </p>
            <p>
              <strong>Description:</strong> {course.description || "N/A"}
            </p>
            <p>
              <strong>Instructor:</strong> {instructor?.name || "Unknown"}
            </p>
            <p>
              <strong>Category:</strong> {course.category || "N/A"}
            </p>
            <p>
              <strong>Level:</strong> {course.level || "N/A"}
            </p>
            <p>
              <strong>Duration:</strong> {formatDuration(course.duration)}
            </p>
            <p>
              <strong>Price:</strong>{" "}
              {course.price
                ? `${course.price} ${course.currency || ""}`
                : "N/A"}
            </p>
            <p>
              <strong>Status:</strong> {course.status || "N/A"}
            </p>
            <p>
              <strong>Max Enrollment:</strong>{" "}
              {course.maxEnrollment || "Unlimited"}
            </p>
            <p>
              <strong>Schedule:</strong>{" "}
              {course.schedule?.daysOfWeek?.length > 0 ? (
                <>
                  {course.schedule.daysOfWeek.join(", ")}
                  <br />
                  <strong>Shift:</strong> {course.schedule.shift || "N/A"}
                </>
              ) : (
                "N/A"
              )}
            </p>

            <p>
              <strong>Thumbnail:</strong>{" "}
              {course.thumbnail ? (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-24 h-24 object-cover rounded mt-2"
                />
              ) : (
                "N/A"
              )}
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCourseModal;
