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
    if (user) {
      fetchClasses();
    }
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
              value={new Date(selectedClass.createdAt).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}
              icon={<Calendar size={18} className="text-orange-500" />}
            />
            <InfoCard
              label="Instructor"
              value={selectedClass.instructor?.name || "Not assigned"}
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
                              `${student.lastName} ${student.firstName}`}
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar />
      <div className="flex flex-col md:flex-row min-h-screen">
        <Sidebar />
        <div className="flex-1 p-4 sm:p-6 md:p-8 md:ml-20">
          {/* Enhanced Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 md:mb-8"
          >
            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              My Classes
            </h1>
            <p className="mt-2 text-gray-600">
              Manage your teaching schedule and student lists
            </p>
          </motion.div>

          {/* Quick Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <BookOpen className="h-6 w-6 text-blue-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Total Classes</p>
                  <p className="text-xl font-bold text-gray-800">
                    {classes.length}
                  </p>
                </div>
              </div>
            </motion.div>
            {/* Add more stat cards as needed */}
          </div>

          {/* Classes Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loading />
            </div>
          ) : classes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center bg-white rounded-xl shadow-sm p-8"
            >
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No Classes Found
              </h3>
              <p className="text-gray-500">
                You haven't been assigned to any classes yet.
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {classes.map((cls) => (
                <motion.div
                  key={cls._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  {/* Class Card Header */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-bold text-gray-800">
                        {cls.className}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          cls.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {cls.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600">
                        <BookOpen className="w-5 h-5 mr-3 text-blue-500" />
                        <span className="text-sm">{cls.courseId?.title}</span>
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
                      <div className="flex items-center text-gray-600">
                        <Users className="w-5 h-5 mr-3 text-purple-500" />
                        <span className="text-sm">
                          {cls.students?.length || 0} Students
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setSelectedClass(cls);
                        setShowModal(true);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors duration-200"
                    >
                      <Info className="w-4 h-4" />
                      <span className="font-medium">View Details</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Enhanced Modal */}
          <Modal
            isOpen={showModal}
            onRequestClose={() => setShowModal(false)}
            style={customModalStyles}
            contentLabel="Class Details"
          >
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-4xl w-[95vw] md:w-full mx-4 md:mx-0"
              >
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">
                      {selectedClass?.className}
                    </h2>
                    <button
                      onClick={() => setShowModal(false)}
                      className="p-1 hover:bg-white/10 rounded-full transition-colors"
                    >
                      <X className="w-6 h-6 text-white" />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {/* Class Details Grid */}
                  {selectedClass && (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <InfoCard
                          label="Course"
                          value={selectedClass?.courseId?.title || "N/A"}
                          icon={
                            <BookOpen size={18} className="text-blue-500" />
                          }
                        />
                        <InfoCard
                          label="Schedule"
                          value={
                            selectedClass?.schedule?.daysOfWeek?.length
                              ? `${selectedClass.schedule.daysOfWeek.join(
                                  ", "
                                )} - ${selectedClass.schedule.shift || "N/A"}`
                              : "N/A"
                          }
                          icon={
                            <Calendar size={18} className="text-green-500" />
                          }
                        />
                        <InfoCard
                          label="Room"
                          value={selectedClass?.room || "N/A"}
                          icon={<Clock size={18} className="text-yellow-500" />}
                        />
                        <InfoCard
                          label="Students"
                          value={`${
                            selectedClass?.students?.length || 0
                          } enrolled`}
                          icon={<Users size={18} className="text-purple-500" />}
                        />
                        <InfoCard
                          label="Created Date"
                          value={
                            selectedClass?.createdAt
                              ? new Date(
                                  selectedClass.createdAt
                                ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })
                              : "N/A"
                          }
                          icon={
                            <Calendar size={18} className="text-orange-500" />
                          }
                        />
                        <InfoCard
                          label="Instructor"
                          value={
                            selectedClass?.instructor?.name || "Not assigned"
                          }
                          icon={<Users size={18} className="text-indigo-500" />}
                        />
                      </div>

                      {/* Student List Section */}
                      <div className="bg-gray-50 rounded-xl p-4 md:p-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                          <h3 className="text-lg font-semibold text-gray-800">
                            Student List
                          </h3>
                          {selectedClass?.students?.length > 0 && (
                            <button
                              onClick={() => exportStudentsCSV(selectedClass)}
                              className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium w-full sm:w-auto justify-center sm:justify-start"
                            >
                              <Download className="w-4 h-4" />
                              <span>Export List</span>
                            </button>
                          )}
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
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
                                      {(
                                        student.name || student.firstName
                                      )?.charAt(0)}
                                    </div>
                                    <div>
                                      <div className="font-medium text-gray-800">
                                        {student.name ||
                                          `${student.lastName} ${student.firstName}`}
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
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default MyClasses;
