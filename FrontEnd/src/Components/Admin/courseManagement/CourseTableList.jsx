import React, { useContext, useEffect, useState } from "react";
import { Search, ChevronUp, Pencil, UserPlus, Trash2 } from "lucide-react";
import { AppContext } from "../../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../../Loading";
import AddCourseModal from "./AddCourseModal";
import DeleteCourseModal from "./DeleteCourseModal";

const TABS = [
  { label: "All", value: "all" },
  { label: "Course", value: "course" },
  { label: "Add new student", value: "newStudent" },
];

const TABLE_HEAD = ["Image", "Title", "Teacher","Status", "Create At", "Update & Delete"];

const CourseTableList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const { backendUrl } = useContext(AppContext);
  const [courseData, setCourseData] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);

  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Initialize formData with schedule field
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    target: [],
    instructor: { id: "", name: "" },
    category: "",
    level: "",
    duration: { totalHours: "", startDate: "", endDate: "" },
    price: "",
    currency: "",
    status: "",
    thumbnail: null,
    content: [],
    maxEnrollment: "",
    schedule: { daysOfWeek: [], shift: "" },
  });

  const fetchingCourseData = async () => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;
      const { data } = await axios.get(`${backendUrl}/api/admin/getCourse`);
      if (data.success && Array.isArray(data.courses)) {
        setCourseData(data.courses);
        setFilteredCourses(data.courses);
      } else {
        setCourseData([]);
        toast.error(data.message || "No data received");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load course data"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchingInstructors = async () => {
    try {
      axios.defaults.withCredentials = true;

      const { data } = await axios.get(
        `${backendUrl}/api/admin/getInstructors`
      );

      if (data.success) {
        setInstructors(data.instructors);
      } else {
        setInstructors([]);
        toast.error(data.message || "No instructors found");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load instructors"
      );
    }
  };

  useEffect(() => {
    let filtered = courseData;

    if (searchQuery.trim() !== "") {
      const query = searchQuery.trim().toLowerCase();
      filtered = courseData.filter(
        (course) =>
          course.title?.toLowerCase().includes(query) ||
          course.instructor?.name?.toLowerCase().includes(query)
      );
    }

    setFilteredCourses(filtered);
    setCurrentPage(1);
  }, [searchQuery, courseData]);

  // Page split
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Array.isArray(filteredCourses)
    ? filteredCourses.slice(indexOfFirstItem, indexOfLastItem)
    : [];
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

  const handleEditCourse = (course) => {
    // Điền dữ liệu khóa học vào formData
    setFormData({
      title: course.title || "",
      description: course.description || "",
      target: Array.isArray(course.target) ? course.target : [],
      instructor: course.instructor || { id: "", name: "" },
      category: course.category || "",
      level: course.level || "",
      duration: course.duration || {
        totalHours: "",
        startDate: "",
        endDate: "",
      },
      price: course.price || "",
      currency: course.currency || "",
      status: course.status || "",
      thumbnail: course.thumbnail || null, // Lưu URL hoặc null
      content: course.content || [],
      maxEnrollment: course.maxEnrollment || "",
      schedule: course.schedule || { daysOfWeek: [], shift: "" },
    });
    setSelectedCourseId(course._id);
    setIsEditMode(true);
    setShowAddModal(true);
  };

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;

    try {
      setLoading(true);

      axios.defaults.withCredentials = true;

      const response = await axios.delete(
        `${backendUrl}/api/admin/deleteCourse/${courseToDelete._id}`
      );

      const { data } = response;

      if (data.success) {
        toast.success("Course deleted successfully");
        await fetchingCourseData();
      } else {
        toast.error(data.message || "Failed to delete course");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
      setCourseToDelete(null);
    }
  };

  const openDeleteModal = (course) => {
    setCourseToDelete(course);
    setShowDeleteModal(true);
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setShowAddModal(false);
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;

      // Create FormData to handle both JSON and file
      const submissionData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (
          key === "instructor" ||
          key === "duration" ||
          key === "content" ||
          key === "schedule" ||
          key === "target"
        ) {
          submissionData.append(key, JSON.stringify(value)); // Stringify nested objects/arrays
        } else if (key === "thumbnail" && value && typeof value !== "string") {
          submissionData.append(key, value); // Chỉ thêm file mới, không thêm URL cũ
        } else if (key !== "thumbnail") {
          submissionData.append(key, value); // Scalars
        }
      });

      let response;
      if (isEditMode) {
        // Cập nhật khóa học
        response = await axios.put(
          `${backendUrl}/api/admin/updateCourse/${selectedCourseId}`,
          submissionData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        // Tạo mới khóa học
        response = await axios.post(
          `${backendUrl}/api/admin/createCourse`,
          submissionData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      const { data } = response;
      if (data.success) {
        toast.success(
          isEditMode
            ? "Course updated successfully"
            : "Course added successfully"
        );
        await fetchingCourseData();
        resetForm();
        setIsEditMode(false);
        setSelectedCourseId(null);
      } else {
        toast.error(
          data.message || `Failed to ${isEditMode ? "update" : "add"} course`
        );
        setShowAddModal(true);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          `Something went wrong. Please try again.`
      );
      setShowAddModal(true);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      instructor: { id: "", name: "" },
      category: "",
      level: "",
      duration: { totalHours: "", startDate: "", endDate: "" },
      price: "",
      currency: "",
      status: "",
      thumbnail: null,
      content: [],
      maxEnrollment: "",
      schedule: { daysOfWeek: [], shift: "" },
    });
  };

  useEffect(() => {
    fetchingCourseData();
    fetchingInstructors();
  }, [backendUrl]);

  return (
    <div className="w-full h-full bg-white rounded-lg shadow-md border border-gray-200 relative">
      <AddCourseModal
        show={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
          setIsEditMode(false);
          setSelectedCourseId(null);
        }}
        handleSubmit={handleOnSubmit}
        formData={formData}
        setFormData={setFormData}
        loading={loading}
        isEditMode={isEditMode}
        instructors={instructors}
      />

      <DeleteCourseModal
        show={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setCourseToDelete(null);
        }}
        onConfirm={handleDeleteCourse}
      />

      {/* Header */}
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h5 className="text-xl font-bold text-gray-800">Course list</h5>
            <p className="text-sm text-gray-600 mt-1">
              See information about all courses
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition">
              View All
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 border rounded-md hover:bg-blue-700 transition"
              onClick={() => {
                setIsEditMode(false);
                setShowAddModal(true);
              }}
            >
              <UserPlus size={16} /> Add Course
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex gap-2 w-full md:w-auto">
            {TABS.map(({ label, value }) => (
              <button
                key={value}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition"
              >
                {label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            />
          </div>
        </div>
      </div>

      {/* Data table */}
      {loading ? (
        <div className="flex justify-center items-center h-64 bg-gray-100/50">
          <Loading />
        </div>
      ) : currentItems.length === 0 ? (
        <div className=" p-4 text-center text-gray-500">
          No matching courses found
        </div>
      ) : (
        <div className="overflow-x-auto px-0">
          <table className="w-full min-w-max text-left">
            <thead>
              <tr className="bg-gray-50 border-y border-gray-200">
                {TABLE_HEAD.map((head, index) => (
                  <th
                    key={head}
                    className="p-4 text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center justify-between gap-2">
                      {head}
                      {index !== TABLE_HEAD.length - 1 && (
                        <ChevronUp size={16} className="text-gray-500" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={TABLE_HEAD.length}
                    className="p-4 text-center text-gray-500"
                  >
                    No courses found.
                  </td>
                </tr>
              ) : (
                currentItems.map((course, index) => {
                  const isLast = index === currentItems.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-gray-100";

                  return (
                    <tr
                      key={course._id}
                      className="hover:bg-gray-50 transition-all duration-200"
                    >
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        </div>
                      </td>

                      <td className={classes}>
                        <span className="text-sm font-medium text-gray-800">
                          {course.title}
                        </span>
                      </td>

                      <td className={classes}>
                        <span className="text-sm text-gray-700">
                          {course.instructor.name}
                        </span>
                      </td>

                      <td className={classes}>
                        <span className="text-sm text-gray-700">
                          {course.status}
                        </span>
                      </td>

                      <td className={classes}>
                        <span className="text-sm text-gray-600">
                          {new Date(course.createdAt).toLocaleDateString()}
                        </span>
                      </td>

                      <td className={classes}>
                        <button
                          className="text-gray-600 hover:text-blue-600 transition"
                          onClick={() => handleEditCourse(course)}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className="pl-2 text-red-600 hover:text-red-800 transition"
                          onClick={() => openDeleteModal(course)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between p-4 border-t border-gray-200">
        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages || 1}
        </span>

        <div className="flex gap-2">
          <button
            className="px-4 py-2 text-sm border text-gray-700 border-gray-300 rounded-sm hover:bg-gray-100 transition disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className="px-4 py-2 text-sm border text-gray-700 border-gray-300 rounded-sm hover:bg-gray-100 transition disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseTableList;
