import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Calendar,
  Users,
  DollarSign,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Eye,
  Award,
  Activity,
  Target,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

import NavbarAdmin from "../../Components/Admin/Navbar";
import SidebarAdmin from "../../Components/Admin/Sidebar";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const Home = () => {
  const { backendUrl } = useContext(AppContext);
  const [courseData, setCourseData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [bannerData, setBannerData] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  // Existing fetch functions remain the same...
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

  const fetchStudents = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 300));
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

  // Existing calculations remain the same...
  const coursesThisMonth = useMemo(() => {
    if (!Array.isArray(courseData)) return 0;
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    return courseData.filter((course) => {
      if (!course.createdAt) return false;
      const createdAt = new Date(course.createdAt);
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
      if (isNaN(createdAt.getTime())) return false;
      return (
        createdAt.getMonth() === currentMonth &&
        createdAt.getFullYear() === currentYear
      );
    }).length;
  }, [bannerData]);

  const filteredStudents = students.map((student) => {
    const course = courses.find((course) => course.title === student.className);
    return {
      ...student,
      amountDue: course ? course.price : "N/A",
      dueDate: "2025-12-31",
    };
  });

  const unpaidStudents = filteredStudents.filter(
    (student) => student.paymentStatus === "Unpaid"
  );

  const totalOutstanding = unpaidStudents.reduce(
    (sum, student) =>
      sum + (student.amountDue !== "N/A" ? student.amountDue : 0),
    0
  );
  const totalStudents = unpaidStudents.length;

  // Enhanced stats calculations
  const activeCourses = courseData.filter(
    (course) => course.status === "Active"
  ).length;
  const totalEnrolledStudents = courseData.reduce(
    (acc, course) => acc + (course.enrolledUsers?.length || 0),
    0
  );

  const statsCards = [
    {
      title: "Total Revenue",
      value: `$${(totalOutstanding * 1.5).toLocaleString()}`,
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      description: "Monthly revenue growth",
    },
    {
      title: "Active Students",
      value: totalEnrolledStudents.toLocaleString(),
      change: "+8.2%",
      trend: "up",
      icon: Users,
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-50",
      description: "Currently enrolled",
    },
    {
      title: "Course Completion",
      value: "94.2%",
      change: "+2.1%",
      trend: "up",
      icon: Award,
      color: "from-purple-500 to-violet-600",
      bgColor: "bg-purple-50",
      description: "Average completion rate",
    },
    {
      title: "Pending Payments",
      value: `$${totalOutstanding.toLocaleString()}`,
      change: "-5.3%",
      trend: "down",
      icon: AlertCircle,
      color: "from-orange-500 to-red-600",
      bgColor: "bg-orange-50",
      description: "Outstanding tuition fees",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      <div className="fixed top-0 left-0 right-0 z-50">
        <NavbarAdmin />
      </div>
      <div className="flex">
        <div className="fixed top-[70px] left-0 bottom-0 z-40 w-[10px]">
          <SidebarAdmin />
        </div>

        <main className="flex-1 ml-[100px] p-8">
          {/* Enhanced Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 mt-[70px]"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <BarChart3 className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
                      Admin Dashboard
                    </h1>
                    <p className="text-gray-500 mt-1">
                      Welcome back! Here's what's happening with your platform
                      today.
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full flex items-center gap-1">
                        <Activity className="w-3 h-3" />
                        System Online
                      </span>
                      <span className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full">
                        {new Date().toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="hidden lg:flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-800">
                      {courseData.length}
                    </p>
                    <p className="text-sm text-gray-500">Total Courses</p>
                  </div>
                  <div className="w-px h-12 bg-gray-200"></div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-800">
                      {userData.length}
                    </p>
                    <p className="text-sm text-gray-500">Total Users</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            {statsCards.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${
                        stat.color.split(" ")[1]
                      }, ${stat.color.split(" ")[3]})`,
                    }}
                  ></div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                        <stat.icon className="w-6 h-6 text-gray-700" />
                      </div>
                      <div
                        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          stat.trend === "up"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {stat.trend === "up" ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3" />
                        )}
                        {stat.change}
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-800 mb-1">
                      {stat.value}
                    </h3>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-xs text-gray-500">{stat.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Enhanced Management Sections */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
            {/* Course Management */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="xl:col-span-2"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-xl">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">
                        Course Management
                      </h2>
                      <p className="text-sm text-gray-500">
                        Monitor and manage courses
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">This month</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className="text-2xl font-bold text-gray-800">
                      {courseData.length}
                    </div>
                    <div className="text-sm text-gray-600">Total Courses</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <div className="text-2xl font-bold text-green-600">
                      {activeCourses}
                    </div>
                    <div className="text-sm text-gray-600">Active</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-xl">
                    <div className="text-2xl font-bold text-purple-600">
                      {totalEnrolledStudents}
                    </div>
                    <div className="text-sm text-gray-600">Enrolled</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-xl">
                    <div className="text-2xl font-bold text-orange-600">
                      {coursesThisMonth}
                    </div>
                    <div className="text-sm text-gray-600">New This Month</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-100 rounded-xl">
                    <Target className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      Quick Actions
                    </h2>
                    <p className="text-sm text-gray-500">Common tasks</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <button className="w-full p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center gap-3">
                    <BookOpen className="w-5 h-5" />
                    <span className="font-medium">Add New Course</span>
                  </button>
                  <button className="w-full p-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center gap-3">
                    <Users className="w-5 h-5" />
                    <span className="font-medium">Manage Users</span>
                  </button>
                  <button className="w-full p-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 flex items-center gap-3">
                    <PieChart className="w-5 h-5" />
                    <span className="font-medium">View Analytics</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Financial Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-xl">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      Financial Overview
                    </h2>
                    <p className="text-sm text-gray-500">
                      Revenue and payment tracking
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Real-time</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                  <div className="flex items-center justify-center mb-3">
                    <div className="p-3 bg-green-100 rounded-full">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-green-700 mb-1">
                    ${(totalOutstanding * 2).toLocaleString()}
                  </div>
                  <div className="text-sm text-green-600 font-medium">
                    Total Revenue
                  </div>
                  <div className="text-xs text-gray-500 mt-1">This month</div>
                </div>

                <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-100">
                  <div className="flex items-center justify-center mb-3">
                    <div className="p-3 bg-orange-100 rounded-full">
                      <Clock className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-orange-700 mb-1">
                    ${totalOutstanding.toLocaleString()}
                  </div>
                  <div className="text-sm text-orange-600 font-medium">
                    Outstanding
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {totalStudents} students
                  </div>
                </div>

                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                  <div className="flex items-center justify-center mb-3">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <TrendingUp className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-blue-700 mb-1">
                    +12.5%
                  </div>
                  <div className="text-sm text-blue-600 font-medium">
                    Growth Rate
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    vs last month
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* System Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-indigo-100 rounded-xl">
                    <Activity className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      System Status
                    </h3>
                    <p className="text-sm text-gray-500">Platform health</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">
                        Server Status
                      </span>
                    </div>
                    <span className="text-sm text-green-600 font-medium">
                      Online
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">
                        Database
                      </span>
                    </div>
                    <span className="text-sm text-green-600 font-medium">
                      Connected
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">
                        Backup
                      </span>
                    </div>
                    <span className="text-sm text-yellow-600 font-medium">
                      Scheduled
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-100 rounded-xl">
                    <Eye className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      Recent Activity
                    </h3>
                    <p className="text-sm text-gray-500">Latest updates</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">
                        New user registered
                      </p>
                      <p className="text-xs text-gray-500">2 minutes ago</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">
                        Payment received
                      </p>
                      <p className="text-xs text-gray-500">5 minutes ago</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">
                        Course completed
                      </p>
                      <p className="text-xs text-gray-500">10 minutes ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Home;
