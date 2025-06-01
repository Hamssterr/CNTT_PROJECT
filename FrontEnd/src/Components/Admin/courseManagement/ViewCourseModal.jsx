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
    <div className="fixed inset-0 bg-black/30 bg-opacity-40 z-40 flex justify-center items-center p-2 sm:p-4">
      <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 w-full max-w-sm sm:max-w-2xl lg:max-w-5xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 sm:mb-6 lg:mb-8 flex-shrink-0">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">Course Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl sm:text-2xl font-semibold transition-colors duration-200 p-1"
          >
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="space-y-4 sm:space-y-6 lg:space-y-8 flex-1 overflow-y-auto">
          {/* Basic Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-gray-50 rounded-xl p-4 sm:p-6 shadow-inner">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
                Basic Information
              </h3>
              <div className="space-y-2 sm:space-y-3">
                <div>
                  <span className="text-gray-600 font-medium text-sm sm:text-base">Title:</span>
                  <p className="text-gray-800 mt-1 text-sm sm:text-base break-words">
                    {course.title || "Not set"}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600 font-medium text-sm sm:text-base">Category:</span>
                  <p className="text-gray-800 mt-1 text-sm sm:text-base">
                    {course.category || "Not set"}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600 font-medium text-sm sm:text-base">Level:</span>
                  <p className="text-gray-800 mt-1 text-sm sm:text-base">
                    {course.level || "Not set"}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600 font-medium text-sm sm:text-base">Price:</span>
                  <p className="text-gray-800 mt-1 text-sm sm:text-base">
                    {course.price
                      ? `${course.price} ${course.currency || ""}`
                      : "Not set"}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600 font-medium text-sm sm:text-base">Status:</span>
                  <p className="text-gray-800 mt-1 text-sm sm:text-base">
                    {course.status || "Not set"}
                  </p>
                </div>
              </div>
            </div>

            {/* Instructor & Thumbnail */}
            <div className="bg-gray-50 rounded-xl p-4 sm:p-6 shadow-inner">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
                Instructor & Thumbnail
              </h3>
              <div className="space-y-2 sm:space-y-3">
                <div>
                  <span className="text-gray-600 font-medium text-sm sm:text-base">Instructor:</span>
                  <p className="text-gray-800 mt-1 text-sm sm:text-base break-words">
                    {instructor?.name || "Not set"}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600 font-medium text-sm sm:text-base">Thumbnail:</span>
                  <div className="mt-1">
                    {course.thumbnail ? (
                      <img
                        src={course.thumbnail}
                        alt={course.title || "Course Thumbnail"}
                        className="w-full max-w-48 h-24 sm:h-32 object-cover rounded"
                      />
                    ) : (
                      <p className="text-gray-800 text-sm sm:text-base">Not set</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Course Targets */}
          {course.target?.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-4 sm:p-6 shadow-inner">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                  Course Information
                </h3>
                <button
                  onClick={() => setShowTargets(!showTargets)}
                  className="flex items-center text-blue-600 hover:text-blue-800 text-sm sm:text-base"
                >
                  <span className="mr-1 sm:mr-2">View Details</span>
                  {showTargets ? (
                    <ChevronUp size={14} className="sm:w-4 sm:h-4" />
                  ) : (
                    <ChevronDown size={14} className="sm:w-4 sm:h-4" />
                  )}
                </button>
              </div>
              {showTargets && (
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <span className="text-gray-600 font-medium text-sm sm:text-base" >
                      Description:
                    </span>
                    <p className="text-gray-800 mt-1 text-sm sm:text-base break-words" style={{ whiteSpace: "pre-line" }}>
                      {course.description || "Not set"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600 font-medium text-sm sm:text-base">Targets:</span>
                    <ul className="space-y-1 sm:space-y-2 list-disc pl-4 sm:pl-5 mt-1">
                      {course.target.map((item, index) => (
                        <li key={index} className="text-gray-800 text-sm sm:text-base break-words">
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
          <div className="bg-gray-50 rounded-xl p-4 sm:p-6 shadow-inner">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                Schedule & Enrollment
              </h3>
              <button
                onClick={() => setShowSchedule(!showSchedule)}
                className="flex items-center text-blue-600 hover:text-blue-800 text-sm sm:text-base"
              >
                <span className="mr-1 sm:mr-2">View Details</span>
                {showSchedule ? (
                  <ChevronUp size={14} className="sm:w-4 sm:h-4" />
                ) : (
                  <ChevronDown size={14} className="sm:w-4 sm:h-4" />
                )}
              </button>
            </div>
            {showSchedule && (
              <div className="space-y-2 sm:space-y-3">
                <div>
                  <span className="text-gray-600 font-medium text-sm sm:text-base">Duration:</span>
                  <p className="text-gray-800 mt-1 text-sm sm:text-base break-words">
                    {formatDuration(course.duration)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600 font-medium text-sm sm:text-base">Schedule:</span>
                  <p className="text-gray-800 mt-1 text-sm sm:text-base break-words">
                    {course.schedule?.daysOfWeek?.length > 0
                      ? `${course.schedule.daysOfWeek.join(", ")} | Shift: ${
                          course.schedule.shift || "Not set"
                        }`
                      : "Not set"}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600 font-medium text-sm sm:text-base">
                    Max Enrollment:
                  </span>
                  <p className="text-gray-800 mt-1 text-sm sm:text-base">
                    {course.maxEnrollment || "Unlimited"}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600 font-medium text-sm sm:text-base">
                    Enrolled Users:
                  </span>
                  <p className="text-gray-800 mt-1 text-sm sm:text-base">
                    {course.enrolledUsers?.length || 0} student(s)
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Enrolled Users */}
          {course.enrolledUsers?.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-4 sm:p-6 shadow-inner">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                  Enrolled Users
                </h3>
                <button
                  onClick={() => setShowEnrolledUsers(!showEnrolledUsers)}
                  className="flex items-center text-blue-600 hover:text-blue-800 text-sm sm:text-base"
                >
                  <span className="mr-1 sm:mr-2">View Details</span>
                  {showEnrolledUsers ? (
                    <ChevronUp size={14} className="sm:w-4 sm:h-4" />
                  ) : (
                    <ChevronDown size={14} className="sm:w-4 sm:h-4" />
                  )}
                </button>
              </div>
              {showEnrolledUsers && (
                <div className="overflow-hidden">
                  {/* Mobile Card View */}
                  <div className="block lg:hidden space-y-3">
                    {course.enrolledUsers.map((user, index) => (
                      <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                        <div className="space-y-2">
                          <div>
                            <span className="text-xs text-gray-500 font-medium">Full Name:</span>
                            <p className="text-sm text-gray-800 break-words">
                              {(user.lastName || "") +
                                " " +
                                (user.firstName || "") || "Not set"}
                            </p>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500 font-medium">Email:</span>
                            <p className="text-sm text-gray-800 break-all">
                              {user.email || "Not set"}
                            </p>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500 font-medium">Enrolled Date:</span>
                            <p className="text-sm text-gray-800">
                              {formatEnrolledDate(user.enrolledDate)}
                            </p>
                          </div>
                          <div className="flex gap-2 pt-2">
                            <button
                              className="p-2 rounded hover:bg-blue-100 text-gray-600 hover:text-blue-600 transition"
                              onClick={() => {
                                setSelectedUserId(user.userId);
                                setShowEditModal(true);
                              }}
                              title="Edit"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              className="p-2 rounded hover:bg-red-100 text-red-600 hover:text-red-700 transition"
                              onClick={() => {
                                setSelectedUserId(user.userId);
                                setShowDeleteModal(true);
                              }}
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden lg:block overflow-x-auto max-h-64">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 p-3 text-left text-gray-700 font-medium text-sm">
                            Full Name
                          </th>
                          <th className="border border-gray-300 p-3 text-left text-gray-700 font-medium text-sm">
                            Email
                          </th>
                          <th className="border border-gray-300 p-3 text-left text-gray-700 font-medium text-sm">
                            Enrolled Date
                          </th>
                          <th className="border border-gray-300 p-3 text-left text-gray-700 font-medium text-sm">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {course.enrolledUsers.map((user, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="border border-gray-300 p-3 text-gray-800 text-sm">
                              {(user.lastName || "") +
                                " " +
                                (user.firstName || "") || "Not set"}
                            </td>
                            <td className="border border-gray-300 p-3 text-gray-800 text-sm break-all">
                              {user.email || "Not set"}
                            </td>
                            <td className="border border-gray-300 p-3 text-gray-800 text-sm">
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