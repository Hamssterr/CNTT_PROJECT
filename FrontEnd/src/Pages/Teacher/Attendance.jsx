import React, { useState, useEffect, useContext } from "react";
import Navbar from "../../Components/Teacher/NavBar";
import Sidebar from "../../Components/Teacher/SideBar";
import { Users, BookOpen, Calendar, Clock, Check, X, Save } from "lucide-react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import Loading from "../../Components/Loading";
import Swal from "sweetalert2";
function Attendance() {
  const { backendUrl, user } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [attendanceData, setAttendanceData] = useState({});
  const [savedAttendance, setSavedAttendance] = useState(() => {
    // Lấy dữ liệu từ localStorage với key 'savedAttendance'
    const saved = localStorage.getItem("savedAttendance");
    // Nếu có dữ liệu, chuyển từ chuỗi JSON về object. Nếu không, trả về object rỗng.
    return saved ? JSON.parse(saved) : {};
  });
  const [currentDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    // Mỗi khi `savedAttendance` thay đổi, lưu nó vào localStorage.
    localStorage.setItem("savedAttendance", JSON.stringify(savedAttendance));
  }, [savedAttendance]);
  // Lấy danh sách lớp (class) mà giáo viên này dạy
  const fetchClasses = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/admin/getClasses`, {
        withCredentials: true,
      });
      if (data.success && Array.isArray(data.classes)) {
        // Lọc theo instructor.id và user._id
        const filteredClasses = data.classes.filter(
          (cls) =>
            cls.instructor &&
            cls.instructor.id &&
            user &&
            String(cls.instructor.id) === String(user._id)
        );
        setClasses(filteredClasses);
      } else {
        setClasses([]);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchClasses();
    }
    // eslint-disable-next-line
  }, [backendUrl, user]);

  // Điểm danh
  const handleAttendance = (classId, studentId, status) => {
    if (savedAttendance[`${classId}-${currentDate}`]) return; // Không cho sửa nếu đã lưu
    setAttendanceData((prev) => ({
      ...prev,
      [`${classId}-${studentId}`]: status,
    }));
  };

  // Lưu điểm danh (có thể gọi API ở đây)
  const handleSaveAttendance = async (classId) => {
    const cls = classes.find((c) => c._id === classId);
    if (!cls) return;

    // Kiểm tra xem lớp có học sinh không
    if (!cls.students || cls.students.length === 0) {
      Swal.fire({
        icon: "info",
        title: "No Students",
        text: "This class has no students to mark attendance for.",
        confirmButtonText: "OK",
      });
      return;
    }

    // Kiểm tra tất cả học sinh đã được điểm danh chưa
    const allMarked = cls.students.every(
      (student) =>
        attendanceData[`${classId}-${student._id}`] === "present" ||
        attendanceData[`${classId}-${student._id}`] === "absent"
    );

    if (!allMarked) {
      Swal.fire({
        icon: "error",
        title: "Incomplete Attendance",
        text: "Please mark attendance for all students before saving.",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      // Gửi dữ liệu điểm danh lên backend
      await axios.post(`${backendUrl}/api/teacher/save`, {
        classId,
        date: currentDate,
        attendanceData,
      });

      // Cập nhật trạng thái đã lưu
      setSavedAttendance((prev) => ({
        ...prev,
        [`${classId}-${currentDate}`]: true,
      }));

      // Hiển thị thông báo thành công
      Swal.fire({
        icon: "success",
        title: "Attendance Saved",
        text: "Attendance has been successfully saved for today.",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error saving attendance:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to save attendance. Please try again.",
        confirmButtonText: "OK",
      });
    }
  };

  // Thống kê điểm danh
  const getAttendanceStats = (cls) => {
    if (!cls) return { present: 0, absent: 0, total: 0 };
    const students = cls.students || [];
    const stats = students.reduce(
      (acc, student) => {
        const status = attendanceData[`${cls._id}-${student._id}`];
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
      <div className="flex flex-col md:flex-row min-h-screen">
        <div className="fixed top-[70px] left-0 bottom-0 z-40 w-[280px]">
          <Sidebar />
        </div>
        <div className="flex-1 p-4 sm:p-6 md:p-8 md:ml-20">
          {/* Enhanced Header */}
          <div className="mb-6 md:mb-8 mt-[70px]">
            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Attendance Management
            </h1>
            <p className="mt-2 text-gray-600">
              Track and manage student attendance for your classes
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loading />
            </div>
          ) : classes.length === 0 ? (
            <div className="text-center bg-white rounded-xl shadow-sm p-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No Classes Found
              </h3>
              <p className="text-gray-500">
                You haven't been assigned to any classes yet.
              </p>
            </div>
          ) : (
            <>
              {/* Class Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                {classes.map((cls) => (
                  <div
                    key={cls._id}
                    onClick={() => setSelectedClass(cls)}
                    className={`
                      bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-5
                      cursor-pointer border border-transparent
                      ${
                        selectedClass?._id === cls._id
                          ? "ring-2 ring-blue-500 border-blue-500"
                          : ""
                      }
                    `}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-bold text-gray-800">
                        {cls.className}
                      </h3>
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
                        {cls.students?.length || 0} Students
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600">
                        <BookOpen className="w-5 h-5 mr-3 text-blue-500" />
                        <span className="text-sm">
                          {cls.courseId?.title || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-5 h-5 mr-3 text-green-500" />
                        <span className="text-sm">
                          {cls.schedule?.daysOfWeek?.join(", ") || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-5 h-5 mr-3 text-yellow-500" />
                        <span className="text-sm">
                          {cls.schedule?.shift || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Attendance Section */}
              {selectedClass && (
                <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 mb-1">
                        {selectedClass.className}
                      </h2>
                      <p className="text-sm text-gray-600">
                        Date:{" "}
                        {new Date(currentDate).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <button
                      onClick={() => handleSaveAttendance(selectedClass._id)}
                      disabled={
                        savedAttendance[
                          `${selectedClass._id}-${currentDate}`
                        ] || !selectedClass.students?.length // Thêm điều kiện này
                      }
                      className={`
                        w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg
                        transition-all duration-200 font-medium
                        ${
                          !selectedClass.students?.length
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed" // Thêm style cho trường hợp không có học sinh
                            : savedAttendance[
                                `${selectedClass._id}-${currentDate}`
                              ]
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-500 hover:bg-blue-600 text-white"
                        }
                      `}
                    >
                      <Save size={18} />
                      {!selectedClass.students?.length
                        ? "No Students"
                        : savedAttendance[`${selectedClass._id}-${currentDate}`]
                        ? "Saved"
                        : "Save Attendance"}
                    </button>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    {(() => {
                      const stats = getAttendanceStats(selectedClass);
                      return (
                        <>
                          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                            <div className="flex items-center">
                              <Users className="h-8 w-8 text-blue-500 mr-3" />
                              <div>
                                <div className="text-2xl font-bold text-blue-700">
                                  {stats.total}
                                </div>
                                <div className="text-sm text-blue-600">
                                  Total Students
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
                            <div className="flex items-center">
                              <Check className="h-8 w-8 text-green-500 mr-3" />
                              <div>
                                <div className="text-2xl font-bold text-green-700">
                                  {stats.present}
                                </div>
                                <div className="text-sm text-green-600">
                                  Present
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4">
                            <div className="flex items-center">
                              <X className="h-8 w-8 text-red-500 mr-3" />
                              <div>
                                <div className="text-2xl font-bold text-red-700">
                                  {stats.absent}
                                </div>
                                <div className="text-sm text-red-600">
                                  Absent
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  {/* Student List */}
                  <div className="overflow-hidden rounded-xl border border-gray-200">
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
                        <tbody className="divide-y divide-gray-200">
                          {selectedClass.students?.map((student) => (
                            <tr
                              key={student._id}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-4 py-3 sm:px-6 sm:py-4">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-600 font-semibold">
                                    {student.name?.charAt(0) ||
                                      student.firstName?.charAt(0)}
                                  </div>
                                  <div className="ml-3">
                                    <div className="text-sm font-medium text-gray-900">
                                      {student.name ||
                                        `${student.lastName} ${student.firstName}`}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 sm:px-6 sm:py-4">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() =>
                                      handleAttendance(
                                        selectedClass._id,
                                        student._id,
                                        "present"
                                      )
                                    }
                                    disabled={
                                      savedAttendance[
                                        `${selectedClass._id}-${currentDate}`
                                      ]
                                    }
                                    className={`
                                      p-2 rounded-lg transition-colors
                                      ${
                                        attendanceData[
                                          `${selectedClass._id}-${student._id}`
                                        ] === "present"
                                          ? "bg-green-100 text-green-600"
                                          : "hover:bg-gray-100 text-gray-400"
                                      }
                                    `}
                                  >
                                    <Check size={20} />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleAttendance(
                                        selectedClass._id,
                                        student._id,
                                        "absent"
                                      )
                                    }
                                    disabled={
                                      savedAttendance[
                                        `${selectedClass._id}-${currentDate}`
                                      ]
                                    }
                                    className={`
                                      p-2 rounded-lg transition-colors
                                      ${
                                        attendanceData[
                                          `${selectedClass._id}-${student._id}`
                                        ] === "absent"
                                          ? "bg-red-100 text-red-600"
                                          : "hover:bg-gray-100 text-gray-400"
                                      }
                                    `}
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
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Attendance;
