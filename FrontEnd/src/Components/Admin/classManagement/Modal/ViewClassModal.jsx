import React from "react";

const ViewClassModal = ({ show, onClose, classData }) => {
  if (!show || !classData) return null;

  // Định dạng lịch học
  const formatSchedule = (schedule) => {
    if (!schedule || !schedule.daysOfWeek?.length) {
      return { daysOfWeekStr: "N/A", shiftStr: "N/A" };
    }

    return {
      daysOfWeekStr: schedule.daysOfWeek.join(", "),
      shiftStr: schedule.shift || "N/A",
    };
  };

  // Định dạng ngày đăng ký
  const formatEnrolledDate = (date) => {
    if (!date) return "N/A";
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
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl relative z-60 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4 text-center">Class Details</h3>
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <p>
              <strong>Class Name:</strong> {classData.className || "N/A"}
            </p>
            <p>
              <strong>Room:</strong> {classData.room || "N/A"}
            </p>
            <p>
              <strong>Course:</strong> {classData.courseId?.title || "N/A"}
            </p>
            <p>
              <strong>Schedule - Days:</strong> {daysOfWeekStr}
            </p>
            <p>
              <strong>Schedule - Shift:</strong> {shiftStr}
            </p>
            <p>
              <strong>Students:</strong> {classData.students?.length || 0}
            </p>
            {classData.students?.length > 0 && (
              <div className="mt-2">
                <strong>Student List:</strong>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2 text-left">Name</th>
                        <th className="border border-gray-300 p-2 text-left">Email</th>
                        <th className="border border-gray-300 p-2 text-left">Enrolled Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classData.students.map((student, index) => (
                        <tr key={index}>
                          <td className="border border-gray-300 p-2">
                            {(student.lastName || "") + " " + (student.firstName || "") || "N/A"}
                          </td>
                          <td className="border border-gray-300 p-2">
                            {student.email || "N/A"}
                          </td>
                          <td className="border border-gray-300 p-2">
                            {formatEnrolledDate(student.enrolledDate)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end pt-4">
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

export default ViewClassModal;
