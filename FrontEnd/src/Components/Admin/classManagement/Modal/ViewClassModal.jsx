import React, { useState } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";

const ViewClassModal = ({ show, onClose, classData }) => {
  const [showSchedule, setShowSchedule] = useState(false);
  const [showStudents, setShowStudents] = useState(false);

  if (!show || !classData) return null;

  // Định dạng lịch học
  const formatSchedule = (schedule) => {
    if (!schedule || !schedule.daysOfWeek?.length) {
      return { daysOfWeekStr: "Not set", shiftStr: "Not set" };
    }

    return {
      daysOfWeekStr: schedule.daysOfWeek.join(", "),
      shiftStr: schedule.shift || "Not set",
    };
  };

  // Định dạng ngày đăng ký
  const formatEnrolledDate = (date) => {
    if (!date) return "Not set";
    const d = new Date(date);
    return d.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).replace(",", " -");
  };

  const { daysOfWeekStr, shiftStr } = formatSchedule(classData.schedule);

  return (
    <div className="fixed inset-0 bg-black/30 bg-opacity-40 z-50 flex justify-center items-center">
      <div className="bg-white rounded-xl p-8 w-11/12 max-w-5xl shadow-2xl flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Class Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-semibold transition-colors duration-200"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-8 flex-1 min-h-0">
          {/* Basic Information */}
          <div className="bg-gray-50 rounded-xl p-6 shadow-inner">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Basic Information
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-gray-600 font-medium">Class Name:</span>
                <p className="text-gray-800 mt-1">
                  {classData.className || "Not set"}
                </p>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Room:</span>
                <p className="text-gray-800 mt-1">
                  {classData.room || "Not set"}
                </p>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Course:</span>
                <p className="text-gray-800 mt-1">
                  {classData.courseId?.title || "Not set"}
                </p>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="bg-gray-50 rounded-xl p-6 shadow-inner">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Schedule</h3>
              <button
                onClick={() => setShowSchedule(!showSchedule)}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <span className="mr-2">View Details</span>
                {showSchedule ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>
            {showSchedule && (
              <div className="space-y-3">
                <div>
                  <span className="text-gray-600 font-medium">Days:</span>
                  <p className="text-gray-800 mt-1">{daysOfWeekStr}</p>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Shift:</span>
                  <p className="text-gray-800 mt-1">{shiftStr}</p>
                </div>
              </div>
            )}
          </div>

          {/* Students */}
          {classData.students?.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-6 shadow-inner">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Students</h3>
                <button
                  onClick={() => setShowStudents(!showStudents)}
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <span className="mr-2">View Details</span>
                  {showStudents ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>
              {showStudents && (
                <div className="overflow-x-auto max-h-64">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-3 text-left text-gray-700 font-medium">
                          Name
                        </th>
                        <th className="border border-gray-300 p-3 text-left text-gray-700 font-medium">
                          Email
                        </th>
                        <th className="border border-gray-300 p-3 text-left text-gray-700 font-medium">
                          Enrolled Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {classData.students.map((student, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="border border-gray-300 p-3 text-gray-800">
                            {(student.lastName || "") +
                              " " +
                              (student.firstName || "") || "Not set"}
                          </td>
                          <td className="border border-gray-300 p-3 text-gray-800">
                            {student.email || "Not set"}
                          </td>
                          <td className="border border-gray-300 p-3 text-gray-800">
                            {formatEnrolledDate(student.enrolledDate)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Close Button */}
          <div className="flex justify-end">
            <button
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

export default ViewClassModal;