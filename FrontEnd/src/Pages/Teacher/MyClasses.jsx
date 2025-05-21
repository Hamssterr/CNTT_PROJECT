import React, { useState, useEffect, useContext } from "react";
import Navbar from "../../Components/Teacher/NavBar";
import Sidebar from "../../Components/Teacher/SideBar";
import {
  Users,
  BookOpen,
  Calendar,
  Clock,
  Info,
  Download,
  X,
} from "lucide-react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import Loading from "../../Components/Loading";
import Modal from "react-modal";
import { motion, AnimatePresence } from "framer-motion";

// Thêm styles cho modal
const customModalStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: 1000,
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    padding: 0,
    border: "none",
    background: "transparent",
    overflow: "visible",
  },
};

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

  // Component cho thẻ thông tin
  const InfoCard = ({ label, value, icon }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-50 p-4 rounded-lg"
    >
      <div className="flex items-center gap-2 text-gray-600 mb-1">
        {icon}
        <span className="font-semibold">{label}</span>
      </div>
      <div className="text-gray-800">{value}</div>
    </motion.div>
  );

  // Thay thế modal cũ bằng modal mới
  const renderClassDetailsModal = () => (
    <Modal
      isOpen={showModal}
      onRequestClose={() => setShowModal(false)}
      style={customModalStyles}
      contentLabel="Class Details"
    >
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl relative"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
            onClick={() => setShowModal(false)}
          >
            <X size={20} className="text-gray-500" />
          </motion.button>

          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold mb-6 text-gray-800"
          >
            {selectedClass.className}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <InfoCard
              label="Course"
              value={selectedClass.courseId?.title}
              icon={<BookOpen size={18} className="text-blue-500" />}
            />
            <InfoCard
              label="Schedule"
              value={`${selectedClass.schedule?.daysOfWeek?.join(", ")} - ${
                selectedClass.schedule?.shift
              }`}
              icon={<Calendar size={18} className="text-green-500" />}
            />
            <InfoCard
              label="Room"
              value={selectedClass.room}
              icon={<Clock size={18} className="text-yellow-500" />}
            />
            <InfoCard
              label="Students"
              value={`${selectedClass.students?.length || 0} enrolled`}
              icon={<Users size={18} className="text-purple-500" />}
            />
            <InfoCard
              label="Created Date"
              value={new Date(selectedClass.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
              icon={<Calendar size={18} className="text-orange-500" />}
            />
            <InfoCard
              label="Instructor"
              value={selectedClass.instructor?.name || 'Not assigned'}
              icon={<Users size={18} className="text-indigo-500" />}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-50 rounded-lg p-6"
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Student List
            </h3>
            <div className="max-h-64 overflow-y-auto pr-4">
              {selectedClass.students?.length > 0 ? (
                <div className="space-y-3">
                  {selectedClass.students.map((student) => (
                    <motion.div
                      key={student._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                          {(student.name || student.firstName)?.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">
                            {student.name ||
                              `${student.firstName} ${student.lastName}`}
                          </div>
                          <div className="text-sm text-gray-500">
                            {student.email}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  No students enrolled yet
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 flex justify-end gap-3"
          >
            <button
              onClick={() => exportStudentsCSV(selectedClass)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Download size={18} />
              Export Student List
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </Modal>
  );

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
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Modal xem chi tiết lớp */}
          {showModal && selectedClass && renderClassDetailsModal()}
        </div>
      </div>
    </div>
  );
}

export default MyClasses;
