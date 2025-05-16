import React, { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

import EditEnrolledStudentModal from "./EnrolledStudent/EditEnrolledStudentModal";
import DeleteEnrolledStudentModal from "./EnrolledStudent/DeleteEnrolledStudentModal";

const ViewCourseModal = ({
  isOpen,
  onClose,
  course,
  instructorList,
  courses,
  backendUrl,
  fetchingCourseData,
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [loading, setLoading] = useState(false);

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

  // Định dạng enrolledDate
  const formatEnrolledDate = (date) => {
    if (!date) return "N/A";

    const d = new Date(date);
    const datePart = d.toLocaleDateString("vi-VN", { dateStyle: "short" });
    const timePart = d.toLocaleTimeString("vi-VN", { timeStyle: "short" });

    return `${datePart} - ${timePart}`;
  };

  // Xử lý thay đổi khóa học
  const handleChangeCourse = async (userId, newCourseId) => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;
      const response = await axios.put(
        `${backendUrl}/api/admin/changeCourseEnrollStudent/${course._id}`,
        { userId, newCourseId },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const { data } = response;
      if (data.success) {
        toast.success(data.message || "Student course changed successfully");
        await fetchingCourseData();
        setShowEditModal(false);
        setSelectedUserId(null);
        onClose();
      } else {
        toast.error(data.message || "Failed to change course");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change course");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý xóa học viên
  const handleDeleteStudent = async () => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;
      const response = await axios.delete(
        `${backendUrl}/api/admin/${course._id}/removeEnrollStudent/${selectedUserId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const { data } = response;
      if (data.success) {
        toast.success(data.message || "Student removed successfully");
        await fetchingCourseData();
        setShowDeleteModal(false);
        setSelectedUserId(null);
        onClose();
      } else {
        toast.error(data.message || "Failed to remove student");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove student");
    } finally {
      setLoading(false);
    }
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

            <div>
              <strong>Enrolled Users:</strong>{" "}
              {course.enrolledUsers?.length > 0 ? (
                <div className="mt-2">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2 text-left">
                          Full name
                        </th>
                        <th className="border border-gray-300 p-2 text-left">
                          Email
                        </th>
                        <th className="border border-gray-300 p-2 text-left">
                          Enrolled Date
                        </th>
                         <th className="border border-gray-300 p-2 text-left">
                          Function
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {course.enrolledUsers.map((user, index) => (
                        <tr key={index}>
                          <td className="border border-gray-300 p-2">
                            {(user.lastName || "") +
                              " " +
                              (user.firstName || "") || "N/A"}
                          </td>
                          <td className="border border-gray-300 p-2">
                            {user.email || "N/A"}
                          </td>
                          <td className="border border-gray-300 p-2">
                            {formatEnrolledDate(user.enrolledDate)}
                          </td>
                          <td className="border border-gray-300 p-2">
                            <div className="flex gap-2">
                              <button
                                className="p-1 rounded hover:bg-blue-100 text-gray-600 hover:text-blue-600 transition"
                                onClick={() => {
                                  setSelectedUserId(user.userId);
                                  setShowEditModal(true);
                                }}
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                className="p-1 rounded hover:bg-red-100 text-red-600 hover:text-red-700 transition"
                                onClick={() => {
                                  setSelectedUserId(user.userId);
                                  setShowDeleteModal(true);
                                }}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                "No users enrolled"
              )}
            </div>
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

        <EditEnrolledStudentModal
          show={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUserId(null);
          }}
          onSubmit={handleChangeCourse}
          loading={loading}
          courses={courses}
          currentCourseId={course._id}
          userId={selectedUserId}
        />

        <DeleteEnrolledStudentModal
          show={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedUserId(null);
          }}
          onConfirm={handleDeleteStudent}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default ViewCourseModal;
