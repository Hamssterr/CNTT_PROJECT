import React, { useContext, useEffect, useState } from "react";

import { Search, ChevronUp, Pencil, UserPlus, Trash2, Eye } from "lucide-react";
import Loading from "../../Loading";
import { AppContext } from "../../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

import AddClassModal from "./Modal/AddClassModal";
import ViewClassModal from "./Modal/ViewClassModal";
import EditClassModal from "./Modal/EditClassModal";
import DeleteClassModal from "./Modal/DeleteClassModal";

const TABS = [
  { label: "All", value: "all" },
  { label: "Newest", value: "newClass" },
];

const TABLE_HEAD = [
  "Class Name",
  "Room",
  "Course",
  "Schedule",
  "Students",
  "Actions",
];

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
    <div className="w-full bg-white rounded-lg shadow-md border border-gray-200">
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

      {/* Header */}
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h5 className="text-xl font-bold text-gray-800">Class List</h5>
            <p className="text-sm text-gray-600 mt-1">
              Manage all classes of courses
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
              onClick={() => setShowAddModal(true)}
            >
              <UserPlus size={16} /> Add Class
            </button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex gap-2 w-full md:w-auto">
            {TABS.map(({ label, value }) => (
              <button
                key={value}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                {label}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search classes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            />
          </div>
        </div>
      </div>

      {/* Table List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loading />
        </div>
      ) : classData.length === 0 ? (
        <div className="p-4 text-center text-gray-500">No Class Found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-y border-gray-200">
                {TABLE_HEAD.map((head, index) => (
                  <th
                    className="p-4 text-sm font-semibold text-gray-700"
                    key={head}
                  >
                    <div className="flex items-center gap-2">
                      {head}
                      {index !== TABLE_HEAD.length - 1 && (
                        <ChevronUp size={16} className="text-gray-600" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {classData.map((cls) => (
                <tr key={cls._id} className="hover:bg-gray-50 transition-all">
                  <td className="p-4 text-sm font-medium text-gray-800">
                    {cls.className || "N/A"}
                  </td>
                  <td className="p-4 text-sm text-gray-700">
                    {cls.room || "N/A"}
                  </td>
                  <td className="p-4 text-sm text-gray-700">
                    {cls.courseId?.title || "N/A"}
                  </td>
                  <td className="p-4 text-sm text-gray-700">
                    {formatSchedule(cls.schedule)}
                  </td>
                  <td className="p-4 pl-9 text-sm text-gray-700">
                    {cls.students?.length || 0}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="text-gray-600 hover:text-blue-600 mr-2"
                        title="View Details"
                        onClick={() => handleViewDetails(cls)}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="text-gray-600 hover:text-blue-600 mr-2"
                        onClick={() => handleEditClass(cls)}
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => {
                          setSelectedClass(cls);
                          setShowDeleteModal(true);
                        }}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ClassTableList;
