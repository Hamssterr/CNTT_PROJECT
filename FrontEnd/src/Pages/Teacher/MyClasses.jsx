import React, { useState, useEffect, useContext } from "react";
import Navbar from "../../Components/Teacher/NavBar";
import Sidebar from "../../Components/Teacher/SideBar";
import { Users, BookOpen, Calendar, Clock, Info, Download } from "lucide-react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import Loading from "../../Components/Loading";

function MyClasses() {
  const { backendUrl, user } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Lấy danh sách lớp (class) mà giáo viên này dạy
  const fetchClasses = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/admin/getClasses`, {
        withCredentials: true,
      });
      if (data.success && Array.isArray(data.classes)) {
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
    fetchClasses();
    // eslint-disable-next-line
  }, [backendUrl, user]);

  // Xuất danh sách học sinh ra CSV
  const exportStudentsCSV = (cls) => {
    if (!cls.students || cls.students.length === 0) return;
    const header = "Name,Email\n";
    const rows = cls.students
      .map(
        (s) =>
          `"${s.name || `${s.firstName || ""} ${s.lastName || ""}`}",${
            s.email || ""
          }`
      )
      .join("\n");
    const csvContent = header + rows;
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${cls.className.replace(/\s+/g, "_")}_students.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <Navbar />
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-8 ml-25">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">My Classes</h1>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loading />
            </div>
          ) : classes.length === 0 ? (
            <div className="text-center text-gray-500">No classes found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {classes.map((cls) => (
                <div
                  key={cls._id}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 relative"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-800">
                      {cls.className}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        cls.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {cls.isActive ? "Active" : "Inactive"}
                    </span>
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
                  <div className="flex gap-2 mt-4">
                    <button
                      className="flex items-center gap-1 px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm"
                      onClick={() => {
                        setSelectedClass(cls);
                        setShowModal(true);
                      }}
                    >
                      <Info size={16} /> Details
                    </button>
                    <button
                      className="flex items-center gap-1 px-3 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200 text-sm"
                      onClick={() => exportStudentsCSV(cls)}
                    >
                      <Download size={16} /> Export Students
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Modal xem chi tiết lớp */}
          {showModal && selectedClass && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg relative">
                <button
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowModal(false)}
                >
                  ×
                </button>
                <h2 className="text-2xl font-bold mb-4">
                  {selectedClass.className}
                </h2>
                <p className="mb-2">
                  <span className="font-semibold">Course:</span>{" "}
                  {selectedClass.courseId?.title}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Schedule:</span>{" "}
                  {selectedClass.schedule?.daysOfWeek?.join(", ")} -{" "}
                  {selectedClass.schedule?.shift}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Room:</span>{" "}
                  {selectedClass.room}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Instructor:</span>{" "}
                  {selectedClass.instructor?.name}
                </p>
                <p className="mb-4">
                  <span className="font-semibold">Created At:</span>{" "}
                  {new Date(selectedClass.createdAt).toLocaleDateString()}
                </p>
                <div>
                  <span className="font-semibold">Students:</span>
                  <ul className="list-disc ml-6 mt-2 max-h-32 overflow-y-auto">
                    {selectedClass.students?.length > 0 ? (
                      selectedClass.students.map((s) => (
                        <li key={s._id}>
                          {s.name || `${s.firstName || ""} ${s.lastName || ""}`}{" "}
                          <span className="text-xs text-gray-500">
                            {s.email}
                          </span>
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-400">No students</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyClasses;
