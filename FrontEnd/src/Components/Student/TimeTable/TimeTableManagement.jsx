import React, { useContext, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  BookOpen,
  Filter,
  Search,
  GraduationCap,
  Target,
  ChevronDown,
  Sparkles,
  CalendarDays,
  Timer,
  Users,
  Building,
  Tag,
  TrendingUp,
  RefreshCw,
} from "lucide-react";

import Loading from "../../Loading";
import axios from "axios";
import { AppContext } from "../../../context/AppContext";
import { toast } from "react-toastify";

const TimeTableManagement = () => {
  const { backendUrl } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [classData, setClassData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedDay, setSelectedDay] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchClassData = async () => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;

      const response = await axios.get(
        `${backendUrl}/api/student/getClassByIdStudent`
      );
      const { data } = response;
      if (data.success && Array.isArray(data.classes)) {
        setClassData(data.classes);
      } else {
        setClassData([]);
        toast.error(data.message || "No timetable found");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load timetable data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassData();
  }, [backendUrl]);

  // Hàm tìm ngày học tiếp theo dựa trên ngày hiện tại
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

    // Kiểm tra ngày hợp lệ
    if (
      isNaN(start.getTime()) ||
      isNaN(end.getTime()) ||
      isNaN(today.getTime())
    ) {
      return "N/A";
    }

    // Kiểm tra nếu hôm nay nằm ngoài khoảng thời gian khóa học
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
    let minDiff = 7; // Khoảng cách nhỏ nhất đến ngày học tiếp theo
    let nextDay = null;

    // Tìm ngày học tiếp theo gần nhất
    for (const day of daysOfWeek) {
      const targetDay = daysMap[day];
      if (targetDay === undefined) continue; // Bỏ qua ngày không hợp lệ
      const diff = (targetDay - todayDay + 7) % 7 || 7; // Đảm bảo diff không bằng 0
      if (diff < minDiff) {
        minDiff = diff;
        nextDay = day;
      }
    }

    if (!nextDay) return "N/A";

    // Tính ngày cụ thể của ngày học tiếp theo
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + minDiff);

    // Kiểm tra nếu ngày tiếp theo vượt quá endDate
    if (nextDate > end) {
      return "N/A";
    }

    return nextDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const timetable = useMemo(() => {
    const currentDate = new Date(); // Lấy ngày hiện tại
    return classData.map((classItem, index) => ({
      id: classItem._id || index,
      courseTitle: classItem.courseId?.title || "Unknown Course",
      roomNumber: classItem.room || "N/A",
      instructor: classItem.instructor?.name || "Unknown Instructor",
      timing: classItem.schedule?.shift || "N/A",
      nextClassDay: getNextClassDay(
        classItem.courseId?.duration?.startDate,
        classItem.courseId?.duration?.endDate,
        classItem.schedule?.daysOfWeek,
        currentDate
      ),
      category: classItem.courseId?.category || "Unknown",
      level: classItem.courseId?.level || "Unknown",
    }));
  }, [classData]);

  const filteredTimetable = useMemo(() => {
    return timetable.filter((course) => {
      const matchesCategory =
        selectedCategory === "all" || course.category === selectedCategory;
      const matchesLevel =
        selectedLevel === "all" || course.level === selectedLevel;
      const matchesDay =
        selectedDay === "all" || course.nextClassDay.includes(selectedDay);
      const matchesSearch =
        course.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCategory && matchesLevel && matchesDay && matchesSearch;
    });
  }, [timetable, selectedCategory, selectedLevel, selectedDay, searchTerm]);

  const getCategoryColor = (category) => {
    switch (category) {
      case "Theory":
        return "from-blue-100 to-blue-50 border-blue-200 text-blue-700";
      case "Practical":
        return "from-green-100 to-green-50 border-green-200 text-green-700";
      default:
        return "from-gray-100 to-gray-50 border-gray-200 text-gray-700";
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-700";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-700";
      case "Advanced":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your timetable...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
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
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
                    My Timetable
                  </h1>
                  <p className="text-gray-500 mt-1">
                    Manage your class schedule and stay organized
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full">
                      {timetable.length} classes
                    </span>
                    <span className="text-sm text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full">
                      Active schedule
                    </span>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchClassData}
                className="p-3 bg-blue-100 hover:bg-blue-200 rounded-xl transition-all duration-200 group"
                title="Refresh timetable"
              >
                <RefreshCw className="w-5 h-5 text-blue-600 group-hover:rotate-180 transition-transform duration-500" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-xl">
                <Filter className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Filters & Search
                </h2>
                <p className="text-sm text-gray-500">Customize your view</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search courses or instructors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-8 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none"
                >
                  <option value="all">All Categories</option>
                  <option value="Theory">Theory</option>
                  <option value="Practical">Practical</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>

              {/* Level Filter */}
              <div className="relative">
                <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full pl-10 pr-8 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none"
                >
                  <option value="all">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>

              {/* Day Filter */}
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                  className="w-full pl-10 pr-8 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none"
                >
                  <option value="all">All Days</option>
                  {timetable
                    .map((course) => course.nextClassDay)
                    .filter(
                      (value, index, self) =>
                        value !== "N/A" && self.indexOf(value) === index
                    )
                    .map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>

            {/* Active Filters Display */}
            {(selectedCategory !== "all" ||
              selectedLevel !== "all" ||
              selectedDay !== "all" ||
              searchTerm) && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-600 font-medium">
                  Active filters:
                </span>
                {selectedCategory !== "all" && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                    Category: {selectedCategory}
                  </span>
                )}
                {selectedLevel !== "all" && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                    Level: {selectedLevel}
                  </span>
                )}
                {selectedDay !== "all" && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                    Day: {selectedDay}
                  </span>
                )}
                {searchTerm && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full">
                    Search: "{searchTerm}"
                  </span>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Enhanced Class Cards */}
        <AnimatePresence mode="wait">
          {filteredTimetable.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-16"
            >
              <div className="relative mx-auto mb-6 w-24 h-24">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                  <Calendar className="w-12 h-12 text-gray-400" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <Search className="w-4 h-4 text-white" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No classes found
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Try adjusting your search criteria or filters to find your
                classes.
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedLevel("all");
                  setSelectedDay("all");
                  setSearchTerm("");
                }}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 font-medium transition-all duration-200"
              >
                Clear all filters
              </motion.button>
            </motion.div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredTimetable.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ delay: index * 0.1 }}
                  className={`group relative overflow-hidden bg-gradient-to-br ${getCategoryColor(
                    course.category
                  )} 
                    backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2`}
                >
                  {/* Course Title */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                          {course.courseTitle}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(
                              course.level
                            )}`}
                          >
                            {course.level}
                          </span>
                          <span className="px-3 py-1 bg-white/50 text-gray-700 rounded-full text-xs font-medium">
                            {course.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-2 bg-white/50 rounded-xl">
                        <BookOpen className="w-5 h-5 text-gray-600" />
                      </div>
                    </div>

                    {/* Class Details */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/50 rounded-lg">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">
                            Instructor
                          </p>
                          <p className="text-sm font-semibold text-gray-700">
                            {course.instructor}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/50 rounded-lg">
                          <MapPin className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">
                            Room
                          </p>
                          <p className="text-sm font-semibold text-gray-700">
                            {course.roomNumber}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/50 rounded-lg">
                          <Clock className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">
                            Time
                          </p>
                          <p className="text-sm font-semibold text-gray-700">
                            {course.timing}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/50 rounded-lg">
                          <Calendar className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">
                            Next Class
                          </p>
                          <p className="text-sm font-semibold text-gray-700">
                            {course.nextClassDay === "N/A" ? (
                              <span className="text-orange-600">
                                No upcoming class
                              </span>
                            ) : (
                              course.nextClassDay
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                  {/* Next class indicator */}
                  {course.nextClassDay !== "N/A" && (
                    <div className="absolute top-4 right-4">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg"></div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Summary Stats */}
        {filteredTimetable.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-100 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    Schedule Summary
                  </h3>
                  <p className="text-sm text-gray-500">Your class overview</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600">
                    {filteredTimetable.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Classes</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">
                    {
                      filteredTimetable.filter((c) => c.nextClassDay !== "N/A")
                        .length
                    }
                  </div>
                  <div className="text-sm text-gray-600">Upcoming</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600">
                    {
                      [...new Set(filteredTimetable.map((c) => c.instructor))]
                        .length
                    }
                  </div>
                  <div className="text-sm text-gray-600">Instructors</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-xl">
                  <div className="text-2xl font-bold text-orange-600">
                    {
                      [...new Set(filteredTimetable.map((c) => c.category))]
                        .length
                    }
                  </div>
                  <div className="text-sm text-gray-600">Categories</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TimeTableManagement;
