import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Calendar,
  Users,
  DollarSign,
  AlertCircle,
  // Added Filter icon
} from "lucide-react";

import NavbarAdmin from "../../Components/Admin/Navbar";
import SidebarAdmin from "../../Components/Admin/Sidebar";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import Swal from "sweetalert2";

const Home = () => {
  const { backendUrl } = useContext(AppContext);
  const [courseData, setCourseData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [bannerData, setBannerData] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchingCourseData = async () => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;
      const { data } = await axios.get(`${backendUrl}/api/admin/getCourse`);
      if (data.success && Array.isArray(data.courses)) {
        setCourseData(data.courses);
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

  const fetchingUserData = async () => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;

      const { data } = await axios.get(`${backendUrl}/api/admin/getDataUsers`);
      if (data.success) {
        setUserData(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  const fetchBannerData = async () => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;

      const { data } = await axios.get(`${backendUrl}/api/admin/getBanner`);
      if (data.success && Array.isArray(data.banners)) {
        setBannerData(data.banners);
      } else {
        setBannerData([]);
        toast.error(data.message || "No banners found");
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
      toast.error(
        error.response?.data?.message || "Failed to load banner data"
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch students with status "Contacted" from backend
  const fetchStudents = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate loading
      const { data } = await axios.get(
        `${backendUrl}/api/consultant/getLeadUsers`
      );
      if (data.success) {
        const transformedData = data.leadUsers
          .filter((lead) => lead.status === "Contacted")
          .map((lead) => ({
            id: lead._id,
            studentName: lead.studentName,
            parentName: lead.name,
            email: lead.email,
            phone: lead.phone,
            className: lead.course,
            paymentStatus: lead.paymentStatus,
          }));
        setStudents(transformedData);
      }
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch courses from backend
  const fetchCourses = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/course/getAllCourse`);
      if (data.success) {
        setCourses(data.courses);
      } else {
        Swal.fire("Error", data.message || "Failed to fetch courses.", "error");
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  };

  useEffect(() => {
    fetchingCourseData();
    fetchingUserData();
    fetchBannerData();
    fetchStudents();
    fetchCourses();
  }, [backendUrl]);

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

  const usersThisMonth = useMemo(() => {
    if (!Array.isArray(userData)) return 0;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return userData.filter((user) => {
      if (!user.createdAt) return false;
      const createdAt = new Date(user.createdAt);
      // Validate date
      if (isNaN(createdAt.getTime())) return false;
      return (
        createdAt.getMonth() === currentMonth &&
        createdAt.getFullYear() === currentYear
      );
    }).length;
  }, [userData]);

  const bannersThisMonth = useMemo(() => {
    if (!Array.isArray(bannerData)) return 0;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return bannerData.filter((user) => {
      if (!user.createdAt) return false;
      const createdAt = new Date(user.createdAt);
      // Validate date
      if (isNaN(createdAt.getTime())) return false;
      return (
        createdAt.getMonth() === currentMonth &&
        createdAt.getFullYear() === currentYear
      );
    }).length;
  }, [bannerData]);

  // Filter students based on search query
  const filteredStudents = students.map((student) => {
    const course = courses.find((course) => course.title === student.className);
    return {
      ...student,
      amountDue: course ? course.price : "N/A",
      dueDate: "2025-12-31",
    };
  });

  // Only count unpaid students for summary
  const unpaidStudents = filteredStudents.filter(
    (student) => student.paymentStatus === "Unpaid"
  );

  // Calculate summary metrics based on unpaid students
  const totalOutstanding = unpaidStudents.reduce(
    (sum, student) =>
      sum + (student.amountDue !== "N/A" ? student.amountDue : 0),
    0
  );
  const totalStudents = unpaidStudents.length;
  return (
    <div className=" flex flex-col min-h-screen">
      <NavbarAdmin />
      <div className=" flex flex-1">
        <SidebarAdmin />

        <main className="flex-1 p-5 md:ml-30">

          {/* Course Header Section */}
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
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

          {/* Tuition Header Section */}
          <div className="mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              Tuition Management
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Monitor and manage student tuition payments
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <div className="flex items-center">
                <div className="p-2 sm:p-3 bg-blue-50 rounded-lg">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
                </div>
                <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                    Students with Debt
                  </p>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                    {totalStudents}
                  </h3>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <div className="flex items-center">
                <div className="p-2 sm:p-3 bg-green-50 rounded-lg">
                  <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
                </div>
                <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                    Outstanding Amount
                  </p>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                    ${totalOutstanding}
                  </h3>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center">
                <div className="p-2 sm:p-3 bg-yellow-50 rounded-lg">
                  <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />
                </div>
                <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                    Payment Due
                  </p>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                    Today
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* User Header Section */}
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              User Management
            </h1>
            <p className="text-gray-600">Monitor and manage user</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 mt-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total User
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {userData.length}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 lg:p-6 shadow-lg border border-white/50 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-100/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-xs lg:text-sm font-medium text-gray-600">
                    New Users This Month
                  </p>
                  <p className="text-xl lg:text-2xl font-bold text-orange-600">
                    {usersThisMonth}
                  </p>
                </div>
                <div className="p-2 lg:p-3 bg-orange-100 rounded-full group-hover:bg-orange-200 transition-colors duration-300">
                  <Calendar className="w-5 h-5 lg:w-6 lg:h-6 text-orange-600" />
                </div>
              </div>
              {usersThisMonth === 0 && (
                <p className="text-xs text-gray-500 mt-2 italic">
                  No users added this month
                </p>
              )}
            </div>
          </div>

          {/* Banner Header Section */}
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Banner Management
            </h1>
            <p className="text-gray-600">Monitor and manage banner</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 mt-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Banner
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {bannerData.length}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 lg:p-6 shadow-lg border border-white/50 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-100/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-xs lg:text-sm font-medium text-gray-600">
                    New Banners This Month
                  </p>
                  <p className="text-xl lg:text-2xl font-bold text-orange-600">
                    {bannersThisMonth}
                  </p>
                </div>
                <div className="p-2 lg:p-3 bg-orange-100 rounded-full group-hover:bg-orange-200 transition-colors duration-300">
                  <Calendar className="w-5 h-5 lg:w-6 lg:h-6 text-orange-600" />
                </div>
              </div>
              {bannersThisMonth === 0 && (
                <p className="text-xs text-gray-500 mt-2 italic">
                  No banners added this month
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
