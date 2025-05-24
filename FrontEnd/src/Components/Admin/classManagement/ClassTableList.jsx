import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  ChevronUp,
  Pencil,
  UserPlus,
  Trash2,
  Eye,
  Filter,
  Download,
  Calendar,
  Users,
  Book,
} from "lucide-react";
import Loading from "../../Loading";
import { AppContext } from "../../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

import AddClassModal from "./Modal/AddClassModal";
import ViewClassModal from "./Modal/ViewClassModal";
import EditClassModal from "./Modal/EditClassModal";
import DeleteClassModal from "./Modal/DeleteClassModal";

const TABS = [
  { label: "All Classes", value: "all", icon: Book },
  { label: "Recent Added", value: "newClass", icon: Calendar },
];

const TABLE_HEAD = [
  "Class Name",
  "Room",
  "Schedule",
  "Students",
  "Actions",
];

const ActionButton = ({ icon: Icon, onClick, tooltip, className }) => (
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    className={`p-2 rounded-lg transition-all ${className}`}
    title={tooltip}
  >
    <Icon size={18} />
  </motion.button>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-64 text-gray-500">
    <Book size={48} className="mb-4 text-gray-400" />
    <h3 className="text-xl font-medium mb-2">No Classes Found</h3>
    <p className="text-gray-400">Start by adding a new class to your system</p>
  </div>
);

const ClassTableList = () => {
  const { backendUrl } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [classData, setClassData] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  // Hàm lấy dữ liệu lớp học
  const fetchClassData = async () => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;
      const response = await axios.get(`${backendUrl}/api/admin/getClasses`);
      const { data } = response;
      if (data.success && Array.isArray(data.classes)) {
        setClassData(data.classes);
      } else {
        setClassData([]);
        toast.error(data.message || "No classes found");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load classes");
    } finally {
      setLoading(false);
    }
  };

  // Hàm lấy danh sách khóa học
  const fetchCourses = async () => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.get(`${backendUrl}/api/admin/getCourse`);
      const { data } = response;
      if (data.success && Array.isArray(data.courses)) {
        setCourses(data.courses);
      } else {
        setCourses([]);
        toast.error(data.message || "No courses found");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load courses");
    }
  };

  // Hàm lấy danh sách người dùng
  const fetchUsers = async () => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.get(`${backendUrl}/api/admin/getStudents`);
      const { data } = response;
      if (data.success && Array.isArray(data.students)) {
        setStudents(data.students);
      } else {
        setStudents([]);
        toast.error(data.message || "No students found");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load students");
    }
  };

  // Lọc dữ liệu theo searchQuery
  useEffect(() => {
    if (searchQuery.trim() === "") {
      fetchClassData(); // Làm mới classData khi không có query
      return;
    }
    const query = searchQuery.trim().toLowerCase();
    const filtered = classData.filter(
      (cls) =>
        cls.className?.toLowerCase().includes(query) ||
        cls.room?.toLowerCase().includes(query) ||
        cls.courseId?.title?.toLowerCase().includes(query)
    );
    setClassData(filtered);
  }, [searchQuery]);

  // Gọi API khi component mount
  useEffect(() => {
    fetchClassData();
    fetchCourses();
    fetchUsers();
  }, [backendUrl]);

  // Định dạng lịch học
  const formatSchedule = (schedule) => {
    if (!schedule || !schedule.daysOfWeek?.length) return "N/A";
    return `${schedule.daysOfWeek.join(", ")} - ${schedule.shift || "N/A"}`;
  };

  // Xử lý thêm lớp học
  const handleAddClass = async (formData) => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;
      const response = await axios.post(
        `${backendUrl}/api/admin/createClass`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const { data } = response;
      if (data.success) {
        toast.success(data.message || "Class created successfully");
        await fetchClassData();
        setShowAddModal(false);
      } else {
        toast.error(data.message || "Failed to create class");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create class");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý xem chi tiết lớp học
  const handleViewDetails = async (cls) => {
    try {
      // setLoading(true);
      axios.defaults.withCredentials = true;
      const response = await axios.get(
        `${backendUrl}/api/admin/getClassesById/${cls._id}`
      );
      const { data } = response;
      if (data.success) {
        setSelectedClass(data.class);
        setShowViewModal(true);
      } else {
        toast.error(data.message || "Failed to load class details");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load class details"
      );
    } finally {
      setLoading(false);
    }
  };

  // Xử lý chỉnh sửa lớp học
  const handleEditClass = async (cls) => {
    if (!cls || !cls._id) {
      toast.error("Invalid class data");
      return;
    }
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;
      const response = await axios.get(
        `${backendUrl}/api/admin/getClassesById/${cls._id}`
      );
      const { data } = response;
      if (data.success) {
        setSelectedClass(data.class);
        setShowEditModal(true);
      } else {
        toast.error(data.message || "Failed to load class details");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load class details"
      );
    } finally {
      setLoading(false);
    }
  };

  // Xử lý cập nhật lớp học
  const handleUpdateClass = async (formData) => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;
      const response = await axios.put(
        `${backendUrl}/api/admin/updateClass/${selectedClass._id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const { data } = response;
      if (data.success) {
        toast.success(data.message || "Class updated successfully");
        await fetchClassData();
        setShowEditModal(false);
        setSelectedClass(null);
      } else {
        toast.error(data.message || "Failed to update class");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update class");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý thêm học viên
  const handleAddStudent = async (studentId) => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;
      const response = await axios.post(
        `${backendUrl}/api/admin/registerEnrollStudentById/${selectedClass.courseId._id}`,
        {
          userId: studentId,
          courseId: selectedClass.courseId._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const { data } = response;
      if (data.success) {
        toast.success(data.message || "Student enrolled successfully");
        // Refresh class details
        const classResponse = await axios.get(
          `${backendUrl}/api/admin/getClassesById/${selectedClass._id}`
        );
        if (classResponse.data.success) {
          setSelectedClass(classResponse.data.class);
        }
        await fetchClassData();
      } else {
        toast.error(data.message || "Failed to enroll student");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to enroll student");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý xóa học viên
  const handleRemoveStudent = async (studentId) => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;
      const response = await axios.delete(
        `${backendUrl}/api/admin/${selectedClass.courseId._id}/removeEnrollStudent/${studentId}`,
        {
          userId: studentId,
          courseId: selectedClass.courseId._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const { data } = response;
      if (data.success) {
        toast.success(data.message || "Student removed successfully");
        // Refresh class details
        const classResponse = await axios.get(
          `${backendUrl}/api/admin/getClassesById/${selectedClass._id}`
        );
        if (classResponse.data.success) {
          setSelectedClass(classResponse.data.class);
        }
        await fetchClassData();
      } else {
        toast.error(data.message || "Failed to remove student");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove student");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý xóa lớp học
  const handleDeleteClass = async (classId) => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;
      const response = await axios.delete(
        `${backendUrl}/api/admin/deleteClass/${classId}`
      );
      const { data } = response;
      if (data.success) {
        toast.success(data.message || "Class deleted successfully");
        await fetchClassData();
        setShowDeleteModal(false);
        setSelectedClass(null);
      } else {
        toast.error(data.message || "Failed to delete class");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete class");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl shadow-lg">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">Class Management</h1>
              <p className="text-blue-100 mt-1">
                Total {classData.length} classes across {courses.length} courses
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all shadow-md"
              onClick={() => setShowAddModal(true)}
            >
              <UserPlus size={18} />
              Create New Class
            </motion.button>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col md:flex-row items-center gap-4 mt-6">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by class name, room or course..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 text-white placeholder-blue-100 border border-blue-400/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
              />
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-100"
                size={20}
              />
            </div>
            <div className="flex gap-2">
              {TABS.map(({ label, value, icon: Icon }) => (
                <button
                  key={value}
                  className="px-6 py-3 text-sm font-medium text-blue-100 bg-blue-500/20 rounded-xl hover:bg-blue-500/30 transition-all flex items-center gap-2"
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
              <button className="p-3 text-blue-100 bg-blue-500/20 rounded-xl hover:bg-blue-500/30 transition-all">
                <Filter size={16} />
              </button>
              <button className="p-3 text-blue-100 bg-blue-500/20 rounded-xl hover:bg-blue-500/30 transition-all">
                <Download size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loading />
          </div>
        ) : classData.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50">
                  {TABLE_HEAD.map((head, index) => (
                    <th
                      key={head}
                      className="px-6 py-4 text-sm font-semibold text-gray-700"
                    >
                      <div className="flex items-center gap-2">
                        {head}
                        {index !== TABLE_HEAD.length - 1 && (
                          <ChevronUp
                            size={16}
                            className="text-gray-400 cursor-pointer hover:text-blue-500"
                          />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {classData.map((cls, idx) => (
                  <motion.tr
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={cls._id}
                    className={`hover:bg-blue-50/50 transition-all ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Book size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {cls.className || "N/A"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {cls.courseId?.title || "N/A"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-sm text-gray-600">
                          {cls.room || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {formatSchedule(cls.schedule)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {cls.students?.length || 0} students
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <ActionButton
                          icon={Eye}
                          onClick={() => handleViewDetails(cls)}
                          tooltip="View Details"
                          className="hover:text-blue-600 hover:bg-blue-50"
                        />
                        <ActionButton
                          icon={Pencil}
                          onClick={() => handleEditClass(cls)}
                          tooltip="Edit Class"
                          className="hover:text-green-600 hover:bg-green-50"
                        />
                        <ActionButton
                          icon={Trash2}
                          onClick={() => {
                            setSelectedClass(cls);
                            setShowDeleteModal(true);
                          }}
                          tooltip="Delete Class"
                          className="hover:text-red-600 hover:bg-red-50"
                        />
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddClassModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddClass}
        loading={loading}
        courses={courses}
      />
      <ViewClassModal
        show={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedClass(null);
        }}
        classData={selectedClass}
      />
      <EditClassModal
        show={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedClass(null);
        }}
        onSubmit={handleUpdateClass}
        loading={loading}
        courses={courses}
        classData={selectedClass}
        students={students}
        onAddStudent={handleAddStudent}
        onRemoveStudent={handleRemoveStudent}
      />

      <DeleteClassModal
        show={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          selectedClass(null);
        }}
        onConfirm={() => handleDeleteClass(selectedClass?._id)}
        classData={selectedClass}
      />
    </div>
  );
};

export default ClassTableList;
