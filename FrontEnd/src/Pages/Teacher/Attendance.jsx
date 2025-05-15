import React, { useState } from "react";
import Navbar from "../../Components/Teacher/NavBar";
import Sidebar from "../../Components/Teacher/SideBar";
import { Users, Check, X, Save, Clock, Calendar } from "lucide-react";

// Mock data for classes and students
const mockClasses = [
  {
    id: 1,
    name: "Advanced Mathematics",
    schedule: "Monday, Wednesday",
    time: "9:00 AM - 10:30 AM",
    students: [
      { id: 1, name: "John Doe", attendance: null },
      { id: 2, name: "Jane Smith", attendance: null },
      { id: 3, name: "Alice Johnson", attendance: null },
    ],
  },
  {
    id: 2,
    name: "Basic Physics",
    schedule: "Tuesday, Thursday",
    time: "2:00 PM - 3:30 PM",
    students: [
      { id: 4, name: "Bob Wilson", attendance: null },
      { id: 5, name: "Carol Brown", attendance: null },
    ],
  },
];

function Attendance() {
  const [selectedClass, setSelectedClass] = useState(null);
  const [attendanceData, setAttendanceData] = useState({});
  const [savedAttendance, setSavedAttendance] = useState({});
  const [currentDate] = useState(new Date().toISOString().split("T")[0]);

  const handleAttendance = (classId, studentId, status) => {
    if (savedAttendance[`${classId}-${currentDate}`]) return; // Prevent changes if already saved

    setAttendanceData((prev) => ({
      ...prev,
      [`${classId}-${studentId}`]: status,
    }));
  };

  const handleSaveAttendance = (classId) => {
    setSavedAttendance((prev) => ({
      ...prev,
      [`${classId}-${currentDate}`]: true,
    }));
    // Here you would typically save to backend
    console.log("Saving attendance for class:", classId, attendanceData);
  };

  const getAttendanceStats = (classId) => {
    if (!classId) return { present: 0, absent: 0, total: 0 };

    const students = mockClasses.find((c) => c.id === classId)?.students || [];
    const stats = students.reduce(
      (acc, student) => {
        const status = attendanceData[`${classId}-${student.id}`];
        if (status === "present") acc.present++;
        if (status === "absent") acc.absent++;
        return acc;
      },
      { present: 0, absent: 0 }
    );

    stats.total = students.length;
    return stats;
  };

  return (
    <div>
      <Navbar />
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-8 ml-25">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Attendance Management
          </h1>

          {/* Class Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {mockClasses.map((cls) => (
              <div
                key={cls.id}
                onClick={() => setSelectedClass(cls.id)}
                className={`bg-white rounded-xl shadow-lg p-6 cursor-pointer transition-all duration-300 hover:shadow-xl ${
                  selectedClass === cls.id ? "ring-2 ring-blue-500" : ""
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Users className="text-blue-500" size={24} />
                  <h3 className="text-lg font-semibold text-gray-800">
                    {cls.name}
                  </h3>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p className="flex items-center gap-2">
                    <Calendar size={16} />
                    {cls.schedule}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock size={16} />
                    {cls.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Attendance Sheet */}
          {selectedClass && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {mockClasses.find((c) => c.id === selectedClass)?.name}
                  </h2>
                  <p className="text-sm text-gray-600">Date: {currentDate}</p>
                </div>
                <button
                  onClick={() => handleSaveAttendance(selectedClass)}
                  disabled={savedAttendance[`${selectedClass}-${currentDate}`]}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    savedAttendance[`${selectedClass}-${currentDate}`]
                      ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                      : "bg-green-500 text-white hover:bg-green-600"
                  }`}
                >
                  <Save size={20} />
                  {savedAttendance[`${selectedClass}-${currentDate}`]
                    ? "Saved"
                    : "Save Attendance"}
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                {(() => {
                  const stats = getAttendanceStats(selectedClass);
                  return (
                    <>
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="text-blue-600 text-2xl font-bold">
                          {stats.total}
                        </div>
                        <div className="text-blue-800 text-sm">
                          Total Students
                        </div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="text-green-600 text-2xl font-bold">
                          {stats.present}
                        </div>
                        <div className="text-green-800 text-sm">Present</div>
                      </div>
                      <div className="bg-red-50 rounded-lg p-4">
                        <div className="text-red-600 text-2xl font-bold">
                          {stats.absent}
                        </div>
                        <div className="text-red-800 text-sm">Absent</div>
                      </div>
                    </>
                  );
                })()}
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student Name
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Attendance
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockClasses
                      .find((c) => c.id === selectedClass)
                      ?.students.map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                {student.name.charAt(0)}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {student.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() =>
                                  handleAttendance(
                                    selectedClass,
                                    student.id,
                                    "present"
                                  )
                                }
                                disabled={
                                  savedAttendance[
                                    `${selectedClass}-${currentDate}`
                                  ]
                                }
                                className={`p-2 rounded-full ${
                                  attendanceData[
                                    `${selectedClass}-${student.id}`
                                  ] === "present"
                                    ? "bg-green-100 text-green-600"
                                    : "hover:bg-gray-100"
                                }`}
                              >
                                <Check size={20} />
                              </button>
                              <button
                                onClick={() =>
                                  handleAttendance(
                                    selectedClass,
                                    student.id,
                                    "absent"
                                  )
                                }
                                disabled={
                                  savedAttendance[
                                    `${selectedClass}-${currentDate}`
                                  ]
                                }
                                className={`p-2 rounded-full ${
                                  attendanceData[
                                    `${selectedClass}-${student.id}`
                                  ] === "absent"
                                    ? "bg-red-100 text-red-600"
                                    : "hover:bg-gray-100"
                                }`}
                              >
                                <X size={20} />
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
      </div>
    </div>
  );
}

export default Attendance;
