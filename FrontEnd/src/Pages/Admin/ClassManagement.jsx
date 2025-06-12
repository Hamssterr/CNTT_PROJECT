import React, { useContext, useEffect, useState } from "react";
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
import { motion } from "framer-motion";
import NavbarAdmin from "../../Components/Admin/Navbar";
import SidebarAdmin from "../../Components/Admin/Sidebar";
import Loading from "../../Components/Loading";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import AddClassModal from "../../Components/Admin/classManagement/Modal/AddClassModal";
import ViewClassModal from "../../Components/Admin/classManagement/Modal/ViewClassModal";
import EditClassModal from "../../Components/Admin/classManagement/Modal/EditClassModal";
import DeleteClassModal from "../../Components/Admin/classManagement/Modal/DeleteClassModal";

const TABS = [
  { label: "All Classes", value: "all", icon: Book },
  { label: "Recent Added", value: "newClass", icon: Calendar },
];

const TABLE_HEAD = ["Class Name", "Room", "Schedule", "Students", "Actions"];

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

const ClassManagement = () => {
  const { backendUrl } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [classData, setClassData] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]); // For filtered data
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const [itemsPerPage] = useState(5); // Items per page

  // Fetch classes data
  const fetchClassData = async () => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;
      const response = await axios.get(`${backendUrl}/api/admin/getClasses`);
      const { data } = response;
      if (data.success && Array.isArray(data.classes)) {
        setClassData(data.classes);
        setFilteredClasses(data.classes); // Initialize filteredClasses
      } else {
        setClassData([]);
        setFilteredClasses([]);
        toast.error(data.message || "No classes found");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load classes");
    } finally {
      setLoading(false);
    }
  };

  // Fetch courses data
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

  // Fetch students data
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

  // Filter classes based on searchQuery
  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();
    if (query === "") {
      setFilteredClasses(classData);
    } else {
      const filtered = classData.filter(
        (cls) =>
          cls.className?.toLowerCase().includes(query) ||
          cls.room?.toLowerCase().includes(query) ||
          cls.courseId?.title?.toLowerCase().includes(query)
      );
      setFilteredClasses(filtered);
    }
    setCurrentPage(1); // Reset to page 1 on search
  }, [searchQuery, classData]);

  // Fetch data on mount
  useEffect(() => {
    fetchClassData();
    fetchCourses();
    fetchUsers();
  }, [backendUrl]);

  // Pagination logic
  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredClasses.slice(indexOfFirstItem, indexOfLastItem);

  // Format schedule
  const formatSchedule = (schedule) => {
    if (!schedule || !schedule.daysOfWeek?.length) return "N/A";
    return `${schedule.daysOfWeek.join(", ")} - ${schedule.shift || "N/A"}`;
  };

  // Handle add class
  const handleAddClass = async (formData) => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;
      const response = await axios.post(
        `${backendUrl}/api/admin/createClass`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
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

  // Handle view class details
  const handleViewDetails = async (cls) => {
    try {
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
      toast.error(error.response?.data?.message || "Failed to load class details");
    } finally {
      setLoading(false);
    }
  };

  // Handle edit class
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
      toast.error(error.response?.data?.message || "Failed to load class details");
    } finally {
      setLoading(false);
    }
  };

  // Handle update class
  const handleUpdateClass = async (formData) => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;
      const response = await axios.put(
        `${backendUrl}/api/admin/updateClass/${selectedClass._id}`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
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

  // Handle add student
  const handleAddStudent = async (studentId) => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;
      const response = await axios.post(
        `${backendUrl}/api/admin/registerEnrollStudentById/${selectedClass.courseId._id}`,
        { userId: studentId, courseId: selectedClass.courseId._id },
        { headers: { "Content-Type": "application/json" } }
      );
      const { data } = response;
      if (data.success) {
        toast.success(data.message || "Student enrolled successfully");
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

  // Handle remove student
  const handleRemoveStudent = async (studentId) => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;
      const response = await axios.delete(
        `${backendUrl}/api/admin/${selectedClass.courseId._id}/removeEnrollStudent/${studentId}`,
        {
          data: { userId: studentId, courseId: selectedClass.courseId._id },
          headers: { "Content-Type": "application/json" },
        }
      );
      const { data } = response;
      if (data.success) {
        toast.success(data.message || "Student removed successfully");
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

  // Handle delete class
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
    <div className="flex flex-col min-h-screen mt-[85px]">
      <div className="fixed top-0 left-0 right-0 z-50">
        <NavbarAdmin />
      </div>
      <div className="flex flex-1">
        <div className="fixed top-[70px] left-0 bottom-0 z-40 w-[280px]">
          <SidebarAdmin />
        </div>
        <main className="flex-1 p-3 sm:p-5 md:ml-30">
          {/* Header Section */}
          <div className="mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              Class Management
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Monitor and manage class
            </p>
          </div>

          {/* Content */}
          <div className="mt-4 sm:mt-6">
            <div className="space-y-4 sm:space-y-6">
              {/* Dashboard Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl sm:rounded-2xl shadow-lg">
                <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3 sm:gap-0">
                    <div>
                      <h1 className="text-xl sm:text-2xl font-bold">
                        Class Management
                      </h1>
                      <p className="text-blue-100 mt-1 text-sm sm:text-base">
                        Total {classData.length} classes across {courses.length}{" "}
                        courses
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-blue-600 rounded-lg sm:rounded-xl hover:bg-blue-50 transition-all shadow-md text-sm sm:text-base w-full sm:w-auto"
                      onClick={() => setShowAddModal(true)}
                    >
                      <UserPlus size={16} className="sm:w-[18px] sm:h-[18px]" />
                      <span className="sm:hidden">Create Class</span>
                      <span className="hidden sm:inline">Create New Class</span>
                    </motion.button>
                  </div>

                  {/* Search & Filter Bar */}
                  <div className="flex flex-col gap-3 sm:gap-4 mt-4 sm:mt-6">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search classes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-white/10 text-white placeholder-blue-100 border border-blue-400/30 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 transition-all text-sm sm:text-base"
                      />
                      <Search
                        className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-blue-100"
                        size={16}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2 sm:justify-start">
                      {TABS.map(({ label, value, icon: Icon }) => (
                        <button
                          key={value}
                          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-blue-100 bg-blue-500/20 rounded-lg sm:rounded-xl hover:bg-blue-500/30 transition-all"
                        >
                          <Icon size={14} className="sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">{label}</span>
                          <span className="sm:hidden">
                            {label.split(" ")[0]}
                          </span>
                        </button>
                      ))}
                      <button className="p-2 sm:p-2.5 text-blue-100 bg-blue-500/20 rounded-lg sm:rounded-xl hover:bg-blue-500/30 transition-all">
                        <Filter size={14} className="sm:w-4 sm:h-4" />
                      </button>
                      <button className="p-2 sm:p-2.5 text-blue-100 bg-blue-500/20 rounded-lg sm:rounded-xl hover:bg-blue-500/30 transition-all">
                        <Download size={14} className="sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Area */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200/50">
                {loading ? (
                  <div className="flex justify-center items-center h-40 sm:h-64">
                    <Loading />
                  </div>
                ) : filteredClasses.length === 0 ? (
                  <EmptyState />
                ) : (
                  <>
                    {/* Mobile Card View */}
                    <div className="block sm:hidden">
                      <div className="divide-y divide-gray-100">
                        {currentItems.map((cls, idx) => (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            key={cls._id}
                            className="p-4 hover:bg-blue-50/50 transition-all"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3 flex-1">
                                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                  <Book size={18} className="text-blue-600" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="font-medium text-gray-800 truncate">
                                    {cls.className || "N/A"}
                                  </p>
                                  <p className="text-sm text-gray-500 truncate">
                                    {cls.courseId?.title || "N/A"}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 ml-2">
                                <ActionButton
                                  icon={Eye}
                                  onClick={() => handleViewDetails(cls)}
                                  tooltip="View"
                                  className="hover:text-blue-600 hover:bg-blue-50 p-1.5"
                                />
                                <ActionButton
                                  icon={Pencil}
                                  onClick={() => handleEditClass(cls)}
                                  tooltip="Edit"
                                  className="hover:text-green-600 hover:bg-green-50 p-1.5"
                                />
                                <ActionButton
                                  icon={Trash2}
                                  onClick={() => {
                                    setSelectedClass(cls);
                                    setShowDeleteModal(true);
                                  }}
                                  tooltip="Delete"
                                  className="hover:text-red-600 hover:bg-red-50 p-1.5"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                <span className="text-gray-600 truncate">
                                  {cls.room || "N/A"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users
                                  size={14}
                                  className="text-gray-400 flex-shrink-0"
                                />
                                <span className="text-gray-600">
                                  {cls.students?.length || 0} students
                                </span>
                              </div>
                              <div className="col-span-2">
                                <span className="text-gray-600 text-xs">
                                  {formatSchedule(cls.schedule)}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden sm:block overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50/50">
                            {TABLE_HEAD.map((head, index) => (
                              <th
                                key={head}
                                className="px-4 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm font-semibold text-gray-700 text-left"
                              >
                                <div className="flex items-center gap-2">
                                  {head}
                                  {index !== TABLE_HEAD.length - 1 && (
                                    <ChevronUp
                                      size={14}
                                      className="text-gray-400 cursor-pointer hover:text-blue-500"
                                    />
                                  )}
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {currentItems.map((cls, idx) => (
                            <motion.tr
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              key={cls._id}
                              className={`hover:bg-blue-50/50 transition-all ${
                                idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                              }`}
                            >
                              <td className="px-4 lg:px-6 py-3 lg:py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <Book
                                      size={16}
                                      className="lg:w-5 lg:h-5 text-blue-600"
                                    />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-medium text-gray-800 text-sm lg:text-base truncate">
                                      {cls.className || "N/A"}
                                    </p>
                                    <p className="text-xs lg:text-sm text-gray-500 truncate">
                                      {cls.courseId?.title || "N/A"}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 lg:px-6 py-3 lg:py-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                  <span className="text-xs lg:text-sm text-gray-600">
                                    {cls.room || "N/A"}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 lg:px-6 py-3 lg:py-4">
                                <span className="text-xs lg:text-sm text-gray-600">
                                  {formatSchedule(cls.schedule)}
                                </span>
                              </td>
                              <td className="px-4 lg:px-6 py-3 lg:py-4">
                                <div className="flex items-center gap-2">
                                  <Users size={14} className="text-gray-400" />
                                  <span className="text-xs lg:text-sm text-gray-600">
                                    {cls.students?.length || 0} students
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 lg:px-6 py-3 lg:py-4">
                                <div className="flex items-center gap-2 lg:gap-3">
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

                    {/* Enhanced Footer */}
                    <div className="flex flex-col sm:flex-row items-center justify-between p-4 lg:p-6 bg-gray-50/50 backdrop-blur-sm border-t border-gray-200/50 gap-4">
                      <div className="text-sm text-gray-600 font-medium order-2 sm:order-1">
                        Showing{" "}
                        <span className="text-gray-900 font-semibold">
                          {currentItems.length > 0 ? indexOfFirstItem + 1 : 0}-
                          {indexOfFirstItem + currentItems.length}
                        </span>{" "}
                        of{" "}
                        <span className="text-gray-900 font-semibold">
                          {filteredClasses.length}
                        </span>{" "}
                        classes
                      </div>
                      <div className="flex items-center gap-2 lg:gap-3 order-1 sm:order-2">
                        <button
                          className="px-3 lg:px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                          disabled={currentPage === 1}
                        >
                          Previous
                        </button>
                        <div className="flex items-center gap-2">
                          <span className="px-3 lg:px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-100 rounded-xl">
                            {currentPage}
                          </span>
                          <span className="text-gray-500 text-sm">
                            of {totalPages}
                          </span>
                        </div>
                        <button
                          disabled={
                            currentPage === totalPages || totalPages === 0
                          }
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages)
                            )
                          }
                          className="px-3 lg:px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </>
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
                  setSelectedClass(null);
                }}
                onConfirm={() => handleDeleteClass(selectedClass?._id)}
                classData={selectedClass}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClassManagement;