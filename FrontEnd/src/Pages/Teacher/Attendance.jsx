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
  const [savedAttendance, setSavedAttendance] = useState({});
  const [currentDate] = useState(new Date().toISOString().split("T")[0]);

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

  // Kiểm tra tất cả học sinh đã được điểm danh chưa
  const allMarked = (cls.students || []).every(
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
    <div>
      <Navbar />
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-8 ml-25">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Attendance</h1>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loading />
            </div>
          ) : classes.length === 0 ? (
            <div className="text-center text-gray-500">No classes found.</div>
          ) : (
            <>
              {/* Danh sách lớp */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {classes.map((cls) => (
                  <div
                    key={cls._id}
                    className={`bg-white rounded-xl shadow-lg p-6 cursor-pointer transition-all duration-300 hover:shadow-xl ${
                      selectedClass && selectedClass._id === cls._id
                        ? "ring-2 ring-blue-500"
                        : ""
                    }`}
                    onClick={() => setSelectedClass(cls)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-800">
                        {cls.className}
                      </h3>
                    </div>
                    <div className="space-y-2 mb-2">
                      <p className="flex items-center text-gray-600">
                        <BookOpen size={18} className="mr-2 text-blue-500" />
                        {cls.courseId?.title}
                      </p>
                      <p className="flex items-center text-gray-600">
                        <Calendar size={18} className="mr-2 text-green-500" />
                        {cls.schedule?.daysOfWeek?.join(", ") || "N/A"}
                      </p>
                      <p className="flex items-center text-gray-600">
                        <Clock size={18} className="mr-2 text-yellow-500" />
                        {cls.schedule?.shift || "N/A"}
                      </p>
                      <p className="flex items-center text-gray-600">
                        <Users size={18} className="mr-2 text-purple-500" />
                        {cls.students?.length || 0} Students
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Hiển thị học sinh và điểm danh */}
              {selectedClass && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        {selectedClass.className}
                      </h2>
                      <p className="text-sm text-gray-600">
                        Date: {currentDate}
                      </p>
                    </div>
                    <button
                      onClick={() => handleSaveAttendance(selectedClass._id)}
                      disabled={
                        savedAttendance[`${selectedClass._id}-${currentDate}`] || !selectedClass.students || selectedClass.students.length === 0
                      }
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                        savedAttendance[`${selectedClass._id}-${currentDate}`] || !selectedClass.students || selectedClass.students.length === 0
                          ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                          : "bg-green-500 text-white hover:bg-green-600"
                      }`}
                    >
                      <Save size={20} />
                      {savedAttendance[`${selectedClass._id}-${currentDate}`]
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
                            <div className="text-green-800 text-sm">
                              Present
                            </div>
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
                        {selectedClass.students?.map((student) => (
                          <tr key={student._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                  {student.name
                                    ? student.name.charAt(0)
                                    : student.firstName
                                    ? student.firstName.charAt(0)
                                    : ""}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {` ${student.lastName + " " || ""}${
                                      student.firstName || ""
                                    }`}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
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
                                  className={`p-2 rounded-full ${
                                    attendanceData[
                                      `${selectedClass._id}-${student._id}`
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
                                  className={`p-2 rounded-full ${
                                    attendanceData[
                                      `${selectedClass._id}-${student._id}`
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Attendance;
