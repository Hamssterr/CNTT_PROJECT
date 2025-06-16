import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Search,
  ChevronUp,
  Pencil,
  UserPlus,
  Trash2,
  Eye,
  Plus,
  BookOpen,
  Calendar,
  Users,
  RotateCw , // Added Filter icon
} from "lucide-react";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

import NavbarAdmin from "../../Components/Admin/Navbar";
import SidebarAdmin from "../../Components/Admin/Sidebar";
import AddCourseModal from "../../Components/Admin/courseManagement/AddCourseModal";
import DeleteCourseModal from "../../Components/Admin/courseManagement/DeleteCourseModal";
import ViewCourseModal from "../../Components/Admin/courseManagement/ViewCourseModal";
import AddEnrolledStudentModal from "../../Components/Admin/courseManagement/EnrolledStudent/AddEnrolledStudentModal";

import ResponsiveCourseCard from "../../Components/Admin/courseManagement/ResponsiveCourseCard";

import Loading from "../../Components/Loading";

const TABS = [
  { label: "All", value: "all" },
  { label: "Newest", value: "newStudent" },
];

const TABLE_HEAD = [
  "Course",
  "Title",
  "Instructor",
  "Status",
  "Enrolled",
  "Duration",
  "Created",
  "Actions",
];

const Course = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all"); // Added activeTab state
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
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddEnrolledStudent, setShowAddEnrolledStudent] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [viewMode, setViewMode] = useState("table");

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

  // Logic to auto-update course status based on startDate
  useEffect(() => {
    const updateCourseStatus = async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const coursesToUpdate = courseData.filter((course) => {
        const startDate = new Date(course.duration?.startDate);
        startDate.setHours(0, 0, 0, 0);
        return (
          course.status === "Inactive" &&
          startDate <= today &&
          !isNaN(startDate.getTime())
        );
      });

      for (const course of coursesToUpdate) {
        try {
          await axios.put(
            `${backendUrl}/api/admin/updateCourse/${course._id}`,
            { status: "Active" },
            { withCredentials: true }
          );
        } catch (error) {
          console.error(
            `Failed to update status for course ${course._id}:`,
            error
          );
        }
      }
      if (coursesToUpdate.length > 0) {
        await fetchingCourseData();
      }
    };

    if (courseData.length > 0) {
      updateCourseStatus();
    }
  }, [backendUrl]);

  // Filter courses based on searchQuery and activeTab
  useEffect(() => {
    let filtered = courseData;

    // Apply tab filtering
    if (activeTab === "newStudent") {
      filtered = [...courseData].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      ); // Sort by newest
    }

    // Apply search filtering
    if (searchQuery.trim() !== "") {
      const query = searchQuery.trim().toLowerCase();
      filtered = filtered.filter(
        (course) =>
          course.title?.toLowerCase().includes(query) ||
          course.instructor?.name?.toLowerCase().includes(query)
      );
    }

    setFilteredCourses(filtered);
    setCurrentPage(1);
  }, [searchQuery, courseData, activeTab]);

  // Page split
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Array.isArray(filteredCourses)
    ? filteredCourses.slice(indexOfFirstItem, indexOfLastItem)
    : [];
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

  const handleToggleStatus = async (course) => {
    const newStatus = course.status === "Active" ? "Inactive" : "Active";
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;
      const response = await axios.put(
        `${backendUrl}/api/admin/updateCourse/${course._id}`,
        { status: newStatus },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const { data } = response;
      if (data.success) {
        toast.success(
          newStatus === "Active"
            ? "Active course successfully"
            : "UnActive course successfully"
        );
        await fetchingCourseData();
      } else {
        toast.error(data.message || "Can not update status course");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditCourse = (course) => {
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
      thumbnail: course.thumbnail || null,
      content: course.content || [],
      maxEnrollment: course.maxEnrollment || "",
      schedule: course.schedule || { daysOfWeek: [], shift: "" },
    });
    setSelectedCourseId(course._id);
    setIsEditMode(true);
    setShowAddModal(true);
  };

  const handleAddEnrolledStudent = (course) => {
    setSelectedCourseId(course._id);
    setShowAddEnrolledStudent(true);
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

  const handleView = (course) => {
    if (!course || !course._id) {
      toast.error("Invalid course data");
      return;
    }
    setSelectedCourseId(course);
    setShowDetailModal(true);
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
      const submissionData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (
          key === "instructor" ||
          key === "duration" ||
          key === "content" ||
          key === "schedule" ||
          key === "target"
        ) {
          submissionData.append(key, JSON.stringify(value));
        } else if (key === "thumbnail" && value && typeof value !== "string") {
          submissionData.append(key, value);
        } else if (key !== "thumbnail") {
          submissionData.append(key, value);
        }
      });
      let response;
      if (isEditMode) {
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

  const handleSubmitEnrolledStudent = async (phoneNumber) => {
    if (!selectedCourseId || !phoneNumber) {
      toast.error("Course ID or phone number is missing");
      return;
    }
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;
      const response = await axios.post(
        `${backendUrl}/api/admin/registerEnrollStudent/${selectedCourseId}`,
        { phoneNumber },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const { data } = response;
      if (data.success) {
        toast.success(data.message || "Student enrolled successfully");
        await fetchingCourseData();
        setShowAddEnrolledStudent(false);
        setSelectedCourseId(null);
      } else {
        toast.error(data.message || "Failed to enroll student");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to enroll student");
    } finally {
      setLoading(false);
    }
  };

  const handleReloadCourseData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${backendUrl}/api/admin/sync`);

      toast.success(
        response.data.message || "Course data reloaded successfully"
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to reload course data"
      );
    } finally {
      setLoading(false);
    }
  };

  const coursesThisMonth = useMemo(() => {
    if (!Array.isArray(courseData)) return 0;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return courseData.filter((course) => {
      if (!course.createdAt) return false;
      const createdAt = new Date(course.createdAt);
      // Validate date
      if (isNaN(createdAt.getTime())) return false;
      return (
        createdAt.getMonth() === currentMonth &&
        createdAt.getFullYear() === currentYear
      );
    }).length;
  }, [courseData]);

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
    <div className="flex flex-col min-h-screen mt-[85px]">
      <div className="fixed top-0 left-0 right-0 z-50">
        <NavbarAdmin />
      </div>
      <div className="flex flex-1">
        <div className="fixed top-[70px] left-0 bottom-0 z-40 w-[10px]">
          <SidebarAdmin />
        </div>
        <main className="flex-1 p-5 md:ml-30">
          {/* Header Section */}
          <div className="mb-4">
            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
              Course Management
            </h1>
            <p className="text-gray-600">Monitor and manage courses</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 mt-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Courses
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {courseData.length}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Courses
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    {
                      courseData.filter((course) => course.status === "Active")
                        .length
                    }
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <div className="w-6 h-6 bg-green-600 rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Students
                  </p>
                  <p className="text-3xl font-bold text-purple-600">
                    {courseData.reduce(
                      (acc, course) =>
                        acc + (course.enrolledUsers?.length || 0),
                      0
                    )}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 lg:p-6 shadow-lg border border-white/50 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-100/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-xs lg:text-sm font-medium text-gray-600">
                    New Courses This Month
                  </p>
                  <p className="text-xl lg:text-2xl font-bold text-orange-600">
                    {coursesThisMonth}
                  </p>
                </div>
                <div className="p-2 lg:p-3 bg-orange-100 rounded-full group-hover:bg-orange-200 transition-colors duration-300">
                  <Calendar className="w-5 h-5 lg:w-6 lg:h-6 text-orange-600" />
                </div>
              </div>
              {coursesThisMonth === 0 && (
                <p className="text-xs text-gray-500 mt-2 italic">
                  No courses added this month
                </p>
              )}
            </div>
          </div>

          {/* Enhanced Header */}
          <div className="p-4 lg:p-8 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 text-white rounded-xl lg:rounded-2xl border border-white/10 bg-opacity-90 backdrop-blur-lg shadow-xl mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 lg:mb-6">
              <div className="mb-4 lg:mb-0">
                <h2 className="text-xl lg:text-2xl font-bold mb-2">
                  Course Directory
                </h2>
                <p className="text-blue-100 text-sm lg:text-base">
                  Comprehensive overview of all educational content
                </p>
              </div>
              <button
                className="flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white/30 transition-all duration-300 group self-start"
                onClick={() => setShowAddModal(true)}
              >
                <Plus
                  size={18}
                  className="group-hover:rotate-90 transition-transform duration-300"
                />
                <span className="font-semibold text-sm lg:text-base">
                  Add New Course
                </span>
              </button>
            </div>

            {/* Enhanced Controls */}
            <div className="space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between lg:gap-6">
              {/* Tabs - Scrollable on mobile */}
              <div className="flex gap-1 lg:gap-2 bg-white/10 backdrop-blur-sm rounded-xl p-1 lg:p-2 overflow-x-auto">
                {TABS.map(({ label, value }) => (
                  <button
                    key={value}
                    onClick={() => setActiveTab(value)}
                    className={`px-3 lg:px-6 py-1.5 lg:py-2 rounded-lg font-medium transition-all duration-300 whitespace-nowrap text-sm lg:text-base ${
                      activeTab === value
                        ? "bg-white text-blue-600 shadow-lg"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Search and Filter */}
              <div className="flex gap-2 lg:gap-4">
                <div className="relative flex-1 lg:flex-none">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search courses..."
                    className="w-full lg:w-80 pl-10 lg:pl-12 pr-4 py-2 lg:py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/30 transition-all duration-300 text-sm lg:text-base"
                  />
                  <Search
                    size={16}
                    className="lg:hidden absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70"
                  />
                  <Search
                    size={20}
                    className="hidden lg:block absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70"
                  />
                </div>

                {/* View mode toggle for desktop */}
                <div className="hidden lg:flex gap-1 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode("cards")}
                    className={`px-3 py-2 rounded-lg transition-all duration-300 ${
                      viewMode === "cards" ? "bg-white/30" : "hover:bg-white/10"
                    }`}
                  >
                    <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                      <div className="bg-white rounded-sm"></div>
                      <div className="bg-white rounded-sm"></div>
                      <div className="bg-white rounded-sm"></div>
                      <div className="bg-white rounded-sm"></div>
                    </div>
                  </button>
                  <button
                    onClick={() => setViewMode("table")}
                    className={`px-3 py-2 rounded-lg transition-all duration-300 ${
                      viewMode === "table" ? "bg-white/30" : "hover:bg-white/10"
                    }`}
                  >
                    <div className="w-4 h-4 flex flex-col gap-0.5">
                      <div className="h-0.5 bg-white rounded"></div>
                      <div className="h-0.5 bg-white rounded"></div>
                      <div className="h-0.5 bg-white rounded"></div>
                      <div className="h-0.5 bg-white rounded"></div>
                    </div>
                  </button>
                </div>

                {/* Refresh Button - Updated styling */}
                <button
                  className="hidden lg:flex items-center justify-center w-13 h-13 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white/30 transition-all duration-300"
                  onClick={() => handleReloadCourseData()}
                >
                  <RotateCw
                    size={20}
                    className={`text-white/70 ${loading ? 'animate-spin' : 'hover:text-white'} transition-colors`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Table and Function Modals */}
          <div className="mt-6">
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
              <ViewCourseModal
                isOpen={showDetailModal}
                onClose={() => {
                  setShowDetailModal(false);
                  setSelectedCourseId(null);
                }}
                course={selectedCourseId}
                instructorList={instructors}
                courses={courseData}
                backendUrl={backendUrl}
                fetchingCourseData={fetchingCourseData}
              />
              <AddEnrolledStudentModal
                show={showAddEnrolledStudent}
                onClose={() => {
                  setShowAddEnrolledStudent(false);
                  setSelectedCourseId(null);
                }}
                onSubmit={handleSubmitEnrolledStudent}
                loading={loading}
              />

              {/* Content Area */}
              <div className="bg-white rounded-xl shadow-md border border-gray-200">
                {/* Mobile Card View (default) */}
                <div className="block lg:hidden">
                  <div className="p-4">
                    <div className="grid gap-4">
                      {currentItems.map((course) => (
                        <ResponsiveCourseCard
                          key={course._id}
                          course={course}
                          onView={handleView}
                          onEdit={handleEditCourse}
                          onAddStudent={handleAddEnrolledStudent}
                          onDelete={handleDeleteCourse}
                          onToggleStatus={handleToggleStatus}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Desktop View */}
                <div className="hidden lg:block">
                  {viewMode === "cards" ? (
                    <div className="p-4">
                      <div className="grid gap-4">
                        {currentItems.map((course) => (
                          <ResponsiveCourseCard
                            key={course._id}
                            course={course}
                            onView={handleView}
                            onEdit={handleEditCourse}
                            onAddStudent={handleAddEnrolledStudent}
                            onDelete={handleDeleteCourse}
                            onToggleStatus={handleToggleStatus}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50/80 backdrop-blur-sm border-b border-gray-200/50">
                            {TABLE_HEAD.map((head, index) => (
                              <th
                                key={head}
                                className="p-6 text-left text-sm font-semibold text-gray-700 hover:bg-gray-100/50 transition-colors duration-200 cursor-pointer"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  {head}
                                  {index !== TABLE_HEAD.length - 1 && (
                                    <ChevronUp
                                      size={16}
                                      className="text-gray-400 hover:text-gray-600 transition-colors"
                                    />
                                  )}
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100/50">
                          {currentItems.map((course) => (
                            <tr
                              key={course._id}
                              className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-300 group"
                            >
                              <td className="p-6">
                                <div className="relative">
                                  <img
                                    src={course.thumbnail}
                                    alt={course.title}
                                    className="w-12 h-12 rounded-xl object-cover shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                                  />
                                  <div
                                    className={`absolute -top-1 -right-1 w-4 h-4 shadow-sm ${
                                      course.status === "Active"
                                        ? "bg-green-500 rounded-full border-2 border-white"
                                        : "bg-red-500 rounded-full border-2 border-white"
                                    }`}
                                  ></div>
                                </div>
                              </td>
                              <td className="p-6">
                                <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                                  {course.title}
                                </div>
                              </td>
                              <td className="p-6">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                    {course.instructor.name.charAt(0)}
                                  </div>
                                  <span className="text-gray-700 font-medium">
                                    {course.instructor.name}
                                  </span>
                                </div>
                              </td>
                              <td className="p-6">
                                <button
                                  onClick={() => handleToggleStatus(course)}
                                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                                    course.status === "Active"
                                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                                      : "bg-red-100 text-red-700 hover:bg-red-200"
                                  }`}
                                >
                                  {course.status}
                                </button>
                              </td>
                              <td className="p-6">
                                <div className="flex items-center gap-2">
                                  <Users size={16} className="text-blue-500" />
                                  <span className="font-semibold text-gray-700">
                                    {course.enrolledUsers.length}
                                  </span>
                                </div>
                              </td>
                              <td className="p-6">
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                                  {course.duration.totalHours || "N/A"} Hours
                                </span>
                              </td>
                              <td className="p-6">
                                <span className="text-gray-600 font-medium">
                                  {new Date(
                                    course.createdAt
                                  ).toLocaleDateString("en-US", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </span>
                              </td>
                              <td className="p-6">
                                <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                                  <button
                                    className="p-2 rounded-xl hover:bg-blue-100 text-gray-500 hover:text-blue-600 transition-all duration-300"
                                    onClick={() => handleView(course)}
                                  >
                                    <Eye size={16} />
                                  </button>
                                  <button
                                    className="p-2 rounded-xl hover:bg-blue-100 text-gray-500 hover:text-blue-600 transition-all duration-300"
                                    onClick={() => handleEditCourse(course)}
                                  >
                                    <Pencil size={16} />
                                  </button>
                                  <button
                                    className="p-2 rounded-xl hover:bg-green-100 text-gray-500 hover:text-green-600 transition-all duration-300"
                                    onClick={() =>
                                      handleAddEnrolledStudent(course)
                                    }
                                  >
                                    <UserPlus size={16} />
                                  </button>
                                  <button
                                    className="p-2 rounded-xl hover:bg-red-100 text-gray-500 hover:text-red-600 transition-all duration-300"
                                    onClick={() => openDeleteModal(course)}
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
                      {filteredCourses.length}
                    </span>{" "}
                    courses
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
                      disabled={currentPage === totalPages || totalPages === 0}
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      className="px-3 lg:px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Course;
