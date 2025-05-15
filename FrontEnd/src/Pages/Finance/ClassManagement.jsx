import React, { useState, useEffect, useContext } from "react";
import Modal from "react-modal";
import Swal from "sweetalert2";
import { Edit3, Trash2, Plus } from "lucide-react";
import axios from "axios";
import SideBar from "../../Components/Academic-Finance/SideBar";
import NavBar from "../../Components/Academic-Finance/NavBar";
import { AppContext } from "../../context/AppContext";

Modal.setAppElement("#root");

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const ClassManagement = () => {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]); // State to store courses
  const [searchQuery, setSearchQuery] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [leadUsers, setLeadUsers] = useState([]);

  const fetchLeadUsers = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/consultant/getLeadUsers`
      );
      if (data.success) {
        setLeadUsers(data.leadUsers);
      }
    } catch (error) {
      console.error("Failed to fetch lead users:", error);
    }
  };
  const { backendUrl } = useContext(AppContext);

  // Fetch classes
  const fetchClasses = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/academic-finance/getClasses`
      );
      if (data.success) {
        setClasses(data.classes);
      } else {
        Swal.fire("Error", data.message || "Failed to fetch classes, please try again.", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Failed to fetch classes.", "error");
    }
  };
  // Fetch teachers
  const fetchTeachers = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/admin/getInstructors`
      );
      if (data.success) {
        setTeachers(data.instructors);
      } else {
        Swal.fire(
          "Error",
          data.message || "Failed to fetch teachers.",
          "error"
        );
      }
    } catch (error) {
      Swal.fire("Error", "Failed to fetch teachers.", "error");
    }
  };

  // Fetch courses
  const fetchCourses = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/course/getAllCourse`);
      if (data.success) {
        setCourses(data.courses);
      } else {
        Swal.fire("Error", data.message || "Failed to fetch courses.", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Failed to fetch courses.", "error");
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchTeachers();
    fetchCourses(); // Fetch courses when component mounts
    fetchLeadUsers(); // Fetch lead users when component mounts
  }, []);

  const getStudentCount = (className) => {
    return leadUsers.filter((lead) => lead.course === className).length;
  };

  const getAvailableCourses = () => {
    // Lấy danh sách tên lớp đã được tạo
    const existingClasses = classes.map((cls) => cls.className);

    // Lọc ra những khóa học chưa được sử dụng
    return courses.filter((course) => !existingClasses.includes(course.title));
  };

  // Open modal for adding a new class
  const handleAddNew = () => {
    setSelectedClass({
      className: "",
      teacher: "",
      students: "",
      startDate: "",
    });
    setSelectedDays([]);
    setStartTime("");
    setEndTime("");
    setModalIsOpen(true);
  };

  // Open modal for editing a class
  const handleEdit = (cls) => {
    setSelectedClass({
      id: cls._id,
      className: cls.className,
      teacher: cls.teacher,
      students: cls.students,
      startDate: new Date(cls.startDate).toISOString().split("T")[0],
    });
    setSelectedDays(cls.classTime ? cls.classTime.split(", ") : []);
    setStartTime(cls.startTime || "");
    setEndTime(cls.endTime || "");
    setModalIsOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedClass(null);
  };

  // Save class (add or update)
  const handleSave = async () => {
    try {
      if (
        !selectedClass.className ||
        !selectedClass.teacher ||
        !selectedClass.startDate ||
        !startTime ||
        !endTime ||
        selectedDays.length === 0
      ) {
        Swal.fire("Error", "Please fill in all required fields.", "error");
        return;
      }

      const classData = {
        className: selectedClass.className,
        teacher: selectedClass.teacher,
        startDate: new Date(selectedClass.startDate).getTime(),
        classTime: selectedDays.join(", "),
        startTime,
        endTime,
      };

      let response;
      if (selectedClass.id) {
        response = await axios.put(
          `${backendUrl}/api/academic-finance/updateClass/${selectedClass.id}`,
          classData
        );
      } else {
        response = await axios.post(
          `${backendUrl}/api/academic-finance/addNewClass`,
          classData
        );
      }

      if (response.data.success) {
        Swal.fire(
          "Success",
          `Class ${selectedClass.id ? "updated" : "added"} successfully!`,
          "success"
        );
        fetchClasses();
        closeModal();
      } else {
        Swal.fire(
          "Error",
          response.data.message || "Operation failed.",
          "error"
        );
      }
    } catch (error) {
      Swal.fire("Error", "Operation failed. Please try again.", "error");
    }
  };

  // Thêm hàm handleDelete
  const handleDelete = async (classId) => {
    try {
      // Hiển thị thông báo xác nhận trước khi xóa
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        // Gửi yêu cầu xóa lớp học
        const response = await axios.delete(
          `${backendUrl}/api/academic-finance/deleteClass/${classId}`
        );

        if (response.data.success) {
          Swal.fire("Deleted!", "The class has been deleted.", "success");
          fetchClasses(); // Cập nhật danh sách lớp học sau khi xóa
        } else {
          Swal.fire(
            "Error",
            response.data.message || "Failed to delete the class.",
            "error"
          );
        }
      }
    } catch (error) {
      Swal.fire("Error", "Operation failed. Please try again.", "error");
    }
  };

  return (
    <div>
      <NavBar />
      <div className="flex min-h-screen bg-gray-100">
        <SideBar />
        <div className="flex-1 p-8 ml-25">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Class Management
            </h1>
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Search classes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleAddNew}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                <Plus size={16} />
                Add New Class
              </button>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 text-center">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                    Class Name
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                    Teacher
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                    Total Students
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                    Time
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {classes.map((cls) => (
                  <tr key={cls._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                      {cls.className}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                      {cls.teacher}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                      {getStudentCount(cls.className)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                      {new Date(cls.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                      {cls.classTime
                        ? `${cls.classTime} ${cls.startTime} - ${cls.endTime}`
                        : "Not scheduled"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(cls)}
                          className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm flex items-center gap-1"
                        >
                          <Edit3 size={16} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(cls._id)}
                          className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm flex items-center gap-1"
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            closeTimeoutMS={300}
            contentLabel="Add/Edit Class Modal"
            className="myModal"
            overlayClassName="myOverlay"
            ariaHideApp={false}
          >
            <div className="relative bg-white rounded-lg shadow-lg max-w-4xl w-full mx-auto p-6">
              <div className="flex justify-between items-center pb-4 mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">
                  {selectedClass?.id ? "Edit Class" : "Add New Class"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 transition"
                >
                  ✕
                </button>
              </div>

              {selectedClass && (
                <div className="space-y-4">
                  {/* Class Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Class Name
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={selectedClass.className}
                      onChange={(e) =>
                        setSelectedClass({
                          ...selectedClass,
                          className: e.target.value,
                        })
                      }
                    >
                      <option value="" disabled>
                        Select a course
                      </option>
                      {getAvailableCourses().map((course) => (
                        <option key={course._id} value={course.title}>
                          {course.title}
                        </option>
                      ))}
                    </select>
                    {getAvailableCourses().length === 0 && (
                      <p className="mt-1 text-sm text-red-500">
                        All courses have been assigned to classes
                      </p>
                    )}
                  </div>

                  {/* Other fields remain unchanged */}
                  {/* Teacher */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teacher
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={selectedClass.teacher}
                      onChange={(e) =>
                        setSelectedClass({
                          ...selectedClass,
                          teacher: e.target.value,
                        })
                      }
                    >
                      <option value="" disabled>
                        Select a teacher
                      </option>
                      {teachers.map((teacher) => (
                        <option key={teacher._id} value={teacher.name}>
                          {teacher.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Start Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={selectedClass.startDate}
                      onChange={(e) =>
                        setSelectedClass({
                          ...selectedClass,
                          startDate: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Class Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Class Time
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {daysOfWeek.map((day) => (
                        <label key={day} className="inline-flex items-center">
                          <input
                            type="checkbox"
                            value={day}
                            checked={selectedDays.includes(day)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedDays([...selectedDays, day]);
                              } else {
                                setSelectedDays(
                                  selectedDays.filter((d) => d !== day)
                                );
                              }
                            }}
                            className="form-checkbox h-4 w-4 text-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {day}
                          </span>
                        </label>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  Save
                </button>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default ClassManagement;
