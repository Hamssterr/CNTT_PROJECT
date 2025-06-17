import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  BookOpen,
  Calendar,
  Clock,
  Heart,
  Star,
  TrendingUp,
  Award,
  Baby,
  GraduationCap,
  ChevronRight,
  Sparkles,
  Activity,
  Target,
  CheckCircle,
  Eye,
  ArrowUpRight,
  RefreshCw,
} from "lucide-react";

import ParentNavbar from "../../Components/Parent/Navbar";
import ParentSidebar from "../../Components/Parent/SideBar";
import Loading from "../../Components/Loading";

export const HomeParent = () => {
  const { backendUrl } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    children: [],
    upcomingClasses: [],
    totalCourses: 0,
    ongoingCourses: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch children data
        const childrenResponse = await axios.get(
          `${backendUrl}/api/parent/getDataChildrenForParent`,
          { withCredentials: true }
        );

        // Fetch class data
        const classResponse = await axios.get(
          `${backendUrl}/api/parent/getClassWithHaveChildren`,
          { withCredentials: true }
        );

        if (childrenResponse.data.success && classResponse.data.success) {
          const children = childrenResponse.data.data;
          const classes = classResponse.data.data;

          // Calculate statistics
          const currentDate = new Date();
          const ongoingCourses = classes.filter((course) => {
            const startDate = new Date(course.courseId?.duration?.startDate);
            const endDate = new Date(course.courseId?.duration?.endDate);
            return startDate <= currentDate && currentDate <= endDate;
          });

          // Get upcoming classes (next 5 classes)
          const upcomingClasses = classes
            .filter(
              (course) =>
                new Date(course.courseId?.duration?.startDate) > currentDate
            )
            .slice(0, 5);

          setDashboardData({
            children,
            upcomingClasses,
            totalCourses: classes.length,
            ongoingCourses: ongoingCourses.length,
          });
        }
      } catch (error) {
        toast.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [backendUrl]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="fixed top-0 left-0 right-0 z-50">
          <ParentNavbar />
        </div>
        <div className="flex flex-1">
          <div className="fixed top-[70px] left-0 bottom-0 z-40 w-[60px]">
            <ParentSidebar />
          </div>
          <main className="flex-1 md:ml-25 mt-[60px] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen flex items-center justify-center">
            <div className="p-4 md:p-8">
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

  const statsCards = [
    {
      title: "Total Children",
      value: dashboardData.children.length,
      icon: Users,
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-50",
      link: "/parent/children-management",
      linkText: "View Details",
      description: "Registered children",
    },
    {
      title: "Total Courses",
      value: dashboardData.totalCourses,
      icon: BookOpen,
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      link: "/parent/timetable",
      linkText: "View Timetable",
      description: "Enrolled courses",
    },
    {
      title: "Ongoing Courses",
      value: dashboardData.ongoingCourses,
      icon: Clock,
      color: "from-purple-500 to-violet-600",
      bgColor: "bg-purple-50",
      link: "/parent/timetable",
      linkText: "View Active",
      description: "Currently active",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <div className="fixed top-0 left-0 right-0 z-50">
        <ParentNavbar />
      </div>

      <div className="flex flex-1">
        <div className="fixed top-[70px] left-0 bottom-0 z-40 w-[60px]">
          <ParentSidebar />
        </div>

        <main className="flex-1 md:ml-25 mt-[60px] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
          <div className="p-4 md:p-8">
            <div className="max-w-7xl">
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
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <Heart className="w-8 h-8 text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <Sparkles className="w-3 h-3 text-white" />
                        </div>
                      </div>
                      <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          Parent Dashboard
                        </h1>
                        <p className="text-gray-500 mt-1">
                          Monitor your children's educational journey and
                          progress
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full flex items-center gap-1">
                            <Activity className="w-3 h-3" />
                            Family Dashboard
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
                        <p className="text-xs text-gray-500 mb-4">
                          {stat.description}
                        </p>

                        <Link
                          to={stat.link}
                          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors group-hover:gap-3 duration-300"
                        >
                          {stat.linkText}
                          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:scale-110" />
                        </Link>
                      </div>

                      {/* Hover effect overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-50/5 to-blue-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Enhanced Content Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Children Overview */}
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
                          <Baby className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-gray-800">
                            My Children
                          </h2>
                          <p className="text-sm text-gray-500">
                            Your registered children
                          </p>
                        </div>
                      </div>

                      <Link
                        to="/parent/children-management"
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                      >
                        View All <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>

                    {dashboardData.children.length > 0 ? (
                      <div className="space-y-4">
                        {dashboardData.children.map((child, index) => (
                          <motion.div
                            key={child.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 hover:shadow-md transition-all duration-200 group"
                          >
                            <div className="relative">
                              <motion.img
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                src={
                                  child.profileImage ||
                                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    `${child.firstName} ${child.lastName}`
                                  )}&background=random&color=fff&size=80&font-size=0.5&bold=true`
                                }
                                alt={`${child.firstName}'s profile`}
                                className="w-16 h-16 rounded-2xl object-cover border-4 border-white shadow-md"
                              />
                              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                <CheckCircle className="w-3 h-3 text-white" />
                              </div>
                            </div>

                            <div className="flex-1">
                              <h4 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                {`${child.firstName} ${child.lastName}`}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-500">
                                  Student ID:
                                </span>
                                <span className="text-xs font-medium text-gray-700">
                                  {child.id}
                                </span>
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                  Active
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                      >
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Baby className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium">
                          No children registered
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          Add your children to get started
                        </p>
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                {/* Upcoming Classes */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-green-100 rounded-xl">
                        <Calendar className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-800">
                          Upcoming Classes
                        </h2>
                        <p className="text-sm text-gray-500">
                          Next scheduled classes
                        </p>
                      </div>
                    </div>

                    {dashboardData.upcomingClasses.length > 0 ? (
                      <div className="space-y-4">
                        {dashboardData.upcomingClasses.map((course, index) => (
                          <motion.div
                            key={course._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 hover:shadow-md transition-all duration-200"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-bold text-gray-800 text-sm">
                                {course.courseId?.title || "Unnamed Course"}
                              </h4>
                              <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full font-medium">
                                {course.schedule?.shift || "N/A"}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <Clock className="w-3 h-3" />
                              <span>
                                {course.schedule?.daysOfWeek?.join(", ") ||
                                  "Schedule not set"}
                              </span>
                            </div>
                          </motion.div>
                        ))}

                        <Link
                          to="/parent/timetable"
                          className="block text-center text-sm text-green-600 hover:text-green-700 font-medium mt-4 p-2 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          View Full Timetable
                        </Link>
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                      >
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Calendar className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium">
                          No upcoming classes
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          Check back later for updates
                        </p>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomeParent;
