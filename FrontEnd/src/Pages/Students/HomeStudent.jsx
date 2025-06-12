import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PdfViewer from "../../Components/Teacher/PdfViewer";
import {
  Calendar,
  BookOpen,
  Clock,
  User,
  FileText,
  Download,
  Eye,
  TrendingUp,
  Award,
  Target,
  Activity,
  Bell,
  ChevronRight,
  Sparkles,
  GraduationCap,
  MapPin,
  Users,
  PlayCircle,
  CheckCircle,
  AlertCircle,
  Star,
  BarChart3,
} from "lucide-react";

import StudentNavbar from "../../Components/Student/Navbar";
import StudentSidebar from "../../Components/Student/SideBar";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { Navigate, useNavigate } from "react-router-dom";

export const HomeStudent = () => {
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [classData, setClassData] = useState([]);
  const [studentData, setStudentData] = useState(null);
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [recentMaterials, setRecentMaterials] = useState([]);

  const [pdfViewer, setPdfViewer] = useState({
    open: false,
    url: "",
    name: "",
  });

  // Fetch student dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;

      // Fetch classes
      const classResponse = await axios.get(
        `${backendUrl}/api/student/getClassByIdStudent`
      );
      if (classResponse.data.success) {
        setClassData(classResponse.data.classes);

        // Process upcoming classes
        const upcoming = processUpcomingClasses(classResponse.data.classes);
        setUpcomingClasses(upcoming);

        // Process recent materials
        const materials = processRecentMaterials(classResponse.data.classes);
        setRecentMaterials(materials);
      }

      // Fetch student profile
      const profileResponse = await axios.get(
        `${backendUrl}/api/student/dashboard`
      );
      if (profileResponse.data.success) {
        setStudentData(profileResponse.data.data);
      }
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Process upcoming classes based on TimeTable logic
  const processUpcomingClasses = (classes) => {
    const currentDate = new Date();
    const upcoming = [];

    classes.forEach((classItem) => {
      const nextClassDay = getNextClassDay(
        classItem.courseId?.duration?.startDate,
        classItem.courseId?.duration?.endDate,
        classItem.schedule?.daysOfWeek,
        currentDate
      );

      if (nextClassDay !== "N/A") {
        upcoming.push({
          id: classItem._id,
          courseTitle: classItem.courseId?.title || "Unknown Course",
          instructor: classItem.instructor?.name || "Unknown Instructor",
          room: classItem.room || "N/A",
          timing: classItem.schedule?.shift || "N/A",
          nextClassDay: nextClassDay,
          category: classItem.courseId?.category || "Unknown",
        });
      }
    });

    return upcoming.slice(0, 3); // Get next 3 classes
  };

  // Process recent materials based on LectureMaterials logic
  const processRecentMaterials = (classes) => {
    const materials = [];

    classes.forEach((classItem) => {
      if (classItem.materials && classItem.materials.length > 0) {
        classItem.materials.forEach((material) => {
          materials.push({
            id: material._id || Math.random(),
            name: material.name,
            className: classItem.courseId?.title || "Unknown Course",
            uploadedAt: material.uploadedAt,
            url: material.url,
            size: material.size || "Unknown",
          });
        });
      }
    });

    // Sort by upload date and get recent 4
    return materials
      .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
      .slice(0, 4);
  };

  // Helper function from TimeTable
  const getNextClassDay = (startDate, endDate, daysOfWeek, currentDate) => {
    if (
      !startDate ||
      !endDate ||
      !daysOfWeek ||
      !Array.isArray(daysOfWeek) ||
      !currentDate
    ) {
      return "N/A";
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date(currentDate);

    if (
      isNaN(start.getTime()) ||
      isNaN(end.getTime()) ||
      isNaN(today.getTime())
    ) {
      return "N/A";
    }

    if (today < start || today > end) {
      return "N/A";
    }

    const daysMap = {
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
      Sunday: 0,
    };

    const todayDay = today.getDay();
    let minDiff = 7;
    let nextDay = null;

    for (const day of daysOfWeek) {
      const targetDay = daysMap[day];
      if (targetDay === undefined) continue;
      const diff = (targetDay - todayDay + 7) % 7 || 7;
      if (diff < minDiff) {
        minDiff = diff;
        nextDay = day;
      }
    }

    if (!nextDay) return "N/A";

    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + minDiff);

    if (nextDate > end) {
      return "N/A";
    }

    return nextDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  };

  useEffect(() => {
    fetchDashboardData();
  }, [backendUrl]);

  // Stats calculations
  const totalClasses = classData.length;
  const completedAssignments = Math.floor(totalClasses * 0.8); // Mock data
  const averageGrade = "85.2"; // Mock data
  const attendanceRate = "92.5"; // Mock data

  const statsCards = [
    {
      title: "Enrolled Courses",
      value: totalClasses,
      icon: BookOpen,
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-50",
      change: "+2 this semester",
    },
    {
      title: "Completed Tasks",
      value: completedAssignments,
      icon: CheckCircle,
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      change: "+5 this week",
    },
    {
      title: "Average Grade",
      value: `${averageGrade}%`,
      icon: Award,
      color: "from-purple-500 to-violet-600",
      bgColor: "bg-purple-50",
      change: "+2.1% improvement",
    },
    {
      title: "Attendance",
      value: `${attendanceRate}%`,
      icon: Target,
      color: "from-orange-500 to-red-600",
      bgColor: "bg-orange-50",
      change: "Excellent record",
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="fixed top-0 left-0 right-0 z-50">
          <StudentNavbar />
        </div>
        <div className="flex flex-1">
          <div className="fixed top-[70px] left-0 bottom-0 z-40 w-[280px]">
            <StudentSidebar />
          </div>
          <main className="flex-1 ml-[280px] p-8 mt-[70px]">
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">
                  Loading your dashboard...
                </p>
              </motion.div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <StudentNavbar />
      </div>

      {/* Main Container */}
      <div className="flex flex-1">
        {/* Fixed Sidebar */}
        <div className="fixed top-[70px] left-0 bottom-0 z-40 w-[280px]">
          <StudentSidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 ml-[80px] p-8 mt-[70px] bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 min-h-screen">
          {/* Enhanced Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <GraduationCap className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
                      Welcome Back,{" "}
                      {studentData?.firstName + " " + studentData?.lastName ||
                        "Student"}
                      !
                    </h1>
                    <p className="text-gray-500 mt-1">
                      Ready to continue your learning journey today?
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full flex items-center gap-1">
                        <Activity className="w-3 h-3" />
                        Active Student
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
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
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
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                        <stat.icon className="w-6 h-6 text-gray-700" />
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-800">
                          {stat.value}
                        </div>
                      </div>
                    </div>

                    <h3 className="text-sm font-medium text-gray-600 mb-1">
                      {stat.title}
                    </h3>
                    <p className="text-xs text-gray-500">{stat.change}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Main Dashboard Content */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
            {/* Upcoming Classes */}
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
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">
                        Upcoming Classes
                      </h2>
                      <p className="text-sm text-gray-500">
                        Your next scheduled classes
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      (window.location.href = "/student/timetable")
                    }
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                  >
                    View All <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </div>

                <div className="space-y-4">
                  {upcomingClasses.length > 0 ? (
                    upcomingClasses.map((classItem, index) => (
                      <motion.div
                        key={classItem.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800 mb-1">
                              {classItem.courseTitle}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                {classItem.instructor}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {classItem.room}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {classItem.timing}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-blue-600">
                              {classItem.nextClassDay}
                            </div>
                            <div className="text-xs text-gray-500">
                              {classItem.category}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No upcoming classes scheduled</p>
                    </div>
                  )}
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
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate("/student/timetable")}
                    className="w-full p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center gap-3"
                  >
                    <Calendar className="w-5 h-5" />
                    <span className="font-medium">View Timetable</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate("/student/lecture-materials")}
                    className="w-full p-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center gap-3"
                  >
                    <BookOpen className="w-5 h-5" />
                    <span className="font-medium">Study Materials</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => (window.location.href = "/student/tuition")}
                    className="w-full p-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 flex items-center gap-3"
                  >
                    <BarChart3 className="w-5 h-5" />
                    <span className="font-medium">View Tuition</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Recent Materials */}
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
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      Recent Study Materials
                    </h2>
                    <p className="text-sm text-gray-500">
                      Latest uploads from your instructors
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    (window.location.href = "/student/lecture-materials")
                  }
                  className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-1"
                >
                  View All <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {recentMaterials.length > 0 ? (
                  recentMaterials.map((material, index) => (
                    <motion.div
                      key={material.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100 hover:shadow-md transition-all duration-200 group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <FileText className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-1 hover:bg-green-200 rounded-lg transition-colors"
                            title="View"
                            onClick={() =>
                              setPdfViewer({
                                open: true,
                                url: material.url,
                                name: material.name,
                              })
                            }
                          >
                            <Eye className="w-4 h-4 text-green-600" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-1 hover:bg-green-200 rounded-lg transition-colors"
                            title="Download"
                          >
                            <Download className="w-4 h-4 text-green-600" />
                          </motion.button>
                        </div>
                      </div>

                      <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2">
                        {material.name}
                      </h3>
                      <p className="text-xs text-gray-600 mb-2">
                        {material.className}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(material.uploadedAt).toLocaleDateString()}
                      </p>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No recent materials available</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Progress Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-100 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Learning Progress
                  </h2>
                  <p className="text-sm text-gray-500">
                    Your academic journey overview
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                  <div className="flex items-center justify-center mb-3">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-blue-700 mb-1">
                    {totalClasses}
                  </div>
                  <div className="text-sm text-blue-600 font-medium">
                    Enrolled Courses
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Active this semester
                  </div>
                </div>

                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                  <div className="flex items-center justify-center mb-3">
                    <div className="p-3 bg-green-100 rounded-full">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-green-700 mb-1">
                    {attendanceRate}%
                  </div>
                  <div className="text-sm text-green-600 font-medium">
                    Attendance Rate
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Excellent record
                  </div>
                </div>

                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-100">
                  <div className="flex items-center justify-center mb-3">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Award className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-purple-700 mb-1">
                    {averageGrade}%
                  </div>
                  <div className="text-sm text-purple-600 font-medium">
                    Average Grade
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Keep up the good work!
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
      {pdfViewer.open && (
        <PdfViewer
          fileUrl={pdfViewer.url}
          fileName={pdfViewer.name}
          onClose={() => setPdfViewer({ open: false, url: "", name: "" })}
        />
      )}
    </div>
  );
};

export default HomeStudent;
