import React, { useState } from "react";
import { Pencil, Trash2, X, ChevronDown, ChevronUp } from "lucide-react";
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
  const [showSchedule, setShowSchedule] = useState(false);
  const [showTargets, setShowTargets] = useState(false);
  const [showEnrolledUsers, setShowEnrolledUsers] = useState(false);

  if (!isOpen || !course) return null;

  // Tìm giảng viên từ instructorList dựa trên course.instructor.id
  const instructor = instructorList?.find(
    (i) => i._id === course.instructor?.id
  );

  // Định dạng duration
  const formatDuration = (duration) => {
    if (!duration) return "Not set";
    const { totalHours, startDate, endDate } = duration;
    const start = startDate
      ? new Date(startDate).toLocaleDateString("vi-VN")
      : "Not set";
    const end = endDate
      ? new Date(endDate).toLocaleDateString("vi-VN")
      : "Not set";
    return `${totalHours || "Not set"} hours, from ${start} to ${end}`;
  };

  // Định dạng enrolledDate
  const formatEnrolledDate = (date) => {
    if (!date) return "Not set";
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
      <div className="bg-white rounded-xl p-8 w-11/12 max-w-5xl shadow-2xl flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Course Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-semibold transition-colors duration-200"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-8 flex-1 min-h-0">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-6 shadow-inner">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Basic Information
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-600 font-medium">Title:</span>
                  <p className="text-gray-800 mt-1">
                    {course.title || "Not set"}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Category:</span>
                  <p className="text-gray-800 mt-1">
                    {course.category || "Not set"}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Level:</span>
                  <p className="text-gray-800 mt-1">
                    {course.level || "Not set"}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Price:</span>
                  <p className="text-gray-800 mt-1">
                    {course.price
                      ? `${course.price} ${course.currency || ""}`
                      : "Not set"}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Status:</span>
                  <p className="text-gray-800 mt-1">
                    {course.status || "Not set"}
                  </p>
                </div>
              </div>
            </div>

            {/* Instructor & Thumbnail */}
            <div className="bg-gray-50 rounded-xl p-6 shadow-inner">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Instructor & Thumbnail
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-600 font-medium">Instructor:</span>
                  <p className="text-gray-800 mt-1">
                    {instructor?.name || "Not set"}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Thumbnail:</span>
                  <div className="mt-1">
                    {course.thumbnail ? (
                      <img
                        src={course.thumbnail}
                        alt={course.title || "Course Thumbnail"}
                        className="w-50 h-32 object-cover rounded"
                      />
                    ) : (
                      <p className="text-gray-800">Not set</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Course Targets */}
          {course.target?.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-6 shadow-inner">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  Course Information
                </h3>
                <button
                  onClick={() => setShowTargets(!showTargets)}
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <span className="mr-2">View Details</span>
                  {showTargets ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>
              </div>
              {showTargets && (
                <div className="space-y-4">
                  <div>
                    <span className="text-gray-600 font-medium">
                      Description:
                    </span>
                    <p className="text-gray-800 mt-1">
                      {course.description || "Not set"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600 font-medium">Targets:</span>
                    <ul className="space-y-2 list-disc pl-5 mt-1">
                      {course.target.map((item, index) => (
                        <li key={index} className="text-gray-800">
                          {item.description || "Not set"}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Schedule & Enrollment */}
          <div className="bg-gray-50 rounded-xl p-6 shadow-inner">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Schedule & Enrollment
              </h3>
              <button
                onClick={() => setShowSchedule(!showSchedule)}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <span className="mr-2">View Details</span>
                {showSchedule ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>
            </div>
            {showSchedule && (
              <div className="space-y-3">
                <div>
                  <span className="text-gray-600 font-medium">Duration:</span>
                  <p className="text-gray-800 mt-1">
                    {formatDuration(course.duration)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Schedule:</span>
                  <p className="text-gray-800 mt-1">
                    {course.schedule?.daysOfWeek?.length > 0
                      ? `${course.schedule.daysOfWeek.join(", ")} | Shift: ${
                          course.schedule.shift || "Not set"
                        }`
                      : "Not set"}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">
                    Max Enrollment:
                  </span>
                  <p className="text-gray-800 mt-1">
                    {course.maxEnrollment || "Unlimited"}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">
                    Enrolled Users:
                  </span>
                  <p className="text-gray-800 mt-1">
                    {course.enrolledUsers?.length || 0} student(s)
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Enrolled Users */}
          {course.enrolledUsers?.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-6 shadow-inner">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  Enrolled Users
                </h3>
                <button
                  onClick={() => setShowEnrolledUsers(!showEnrolledUsers)}
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <span className="mr-2">View Details</span>
                  {showEnrolledUsers ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>
              </div>
              {showEnrolledUsers && (
                <div className="overflow-x-auto max-h-64">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-3 text-left text-gray-700 font-medium">
                          Full Name
                        </th>
                        <th className="border border-gray-300 p-3 text-left text-gray-700 font-medium">
                          Email
                        </th>
                        <th className="border border-gray-300 p-3 text-left text-gray-700 font-medium">
                          Enrolled Date
                        </th>
                        <th className="border border-gray-300 p-3 text-left text-gray-700 font-medium">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {course.enrolledUsers.map((user, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="border border-gray-300 p-3 text-gray-800">
                            {(user.lastName || "") +
                              " " +
                              (user.firstName || "") || "Not set"}
                          </td>
                          <td className="border border-gray-300 p-3 text-gray-800">
                            {user.email || "Not set"}
                          </td>
                          <td className="border border-gray-300 p-3 text-gray-800">
                            {formatEnrolledDate(user.enrolledDate)}
                          </td>
                          <td className="border border-gray-300 p-3">
                            <div className="flex gap-2">
                              <button
                                className="p-2 rounded hover:bg-blue-100 text-gray-600 hover:text-blue-600 transition"
                                onClick={() => {
                                  setSelectedUserId(user.userId);
                                  setShowEditModal(true);
                                }}
                                title="Edit"
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                className="p-2 rounded hover:bg-red-100 text-red-600 hover:text-red-700 transition"
                                onClick={() => {
                                  setSelectedUserId(user.userId);
                                  setShowDeleteModal(true);
                                }}
                                title="Delete"
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
              )}
            </div>
          )}
        </div>

        {/* Edit and Delete Modals */}
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
