import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { AppContext } from "../../../context/AppContext";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  BookOpen,
  Sparkles,
  GraduationCap,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Eye,
  Users,
  Star,
  Baby,
  Heart,
  Target,
  Award,
  CheckCircle,
  RefreshCw,
} from "lucide-react";

import Loading from "../../Loading";
import CourseDetailModal from "./CourseDetailModal";

const TimeTableManagementForParent = () => {
  const { backendUrl } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [classData, setClassData] = useState([]);
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedDayFilter, setSelectedDayFilter] = useState("all");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCourseForDetail, setSelectedCourseForDetail] = useState(null);
  const [showFilters, setShowFilters] = useState(true);

  // Existing functions remain the same...
  const fetchClassData = async () => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;

      const response = await axios.get(
        `${backendUrl}/api/parent/getClassWithHaveChildren`
      );
      const { data } = response;

      if (Array.isArray(data.data)) {
        const classMap = new Map();
        data.data.forEach((classItem) => {
          if (classMap.has(classItem._id)) {
            const existing = classMap.get(classItem._id);
            existing.students = [
              ...existing.students,
              ...classItem.students.filter(
                (newStudent) =>
                  !existing.students.some(
                    (existingStudent) =>
                      existingStudent.userId === newStudent.userId
                  )
              ),
            ];
          } else {
            classMap.set(classItem._id, { ...classItem });
          }
        });

        const uniqueClasses = Array.from(classMap.values());
        setClassData(uniqueClasses);

        const classIds = uniqueClasses.map((classItem) => classItem._id);
        const uniqueClassIds = new Set(classIds);
        if (uniqueClassIds.size !== classIds.length) {
          console.warn("Duplicate class IDs detected:", classIds);
        }

        const uniqueChildren = Array.from(
          new Set(
            uniqueClasses.flatMap((classItem) =>
              classItem.students.map((student, index) => {
                const userId =
                  student.userId || `fallback-${classItem._id}-${index}`;
                return JSON.stringify({
                  id: userId,
                  name: `${student.firstName || "Unknown"} ${
                    student.lastName || "Student"
                  }`.trim(),
                });
              })
            )
          ),
          (str) => JSON.parse(str)
        );

        setChildren(uniqueChildren);
        if (uniqueChildren.length > 0) {
          setSelectedChildId(uniqueChildren[0].id);
        } else {
          setSelectedChildId("");
        }
      } else {
        setClassData([]);
        setChildren([]);
        toast.error(data.message || "No timetable found");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to load timetable data";
      toast.error(errorMessage);
      setClassData([]);
      setChildren([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassData();
  }, [backendUrl]);

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

    const daysMap = {
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
      Sunday: 0,
    };

    let referenceDate = today < start ? start : today;
    const referenceDay = referenceDate.getDay();
    const referenceDayName = Object.keys(daysMap).find(
      (key) => daysMap[key] === referenceDay
    );

    if (daysOfWeek.includes(referenceDayName)) {
      const label =
        referenceDate.getTime() === today.getTime()
          ? "Current Day"
          : "Next Day";
      return `${referenceDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })} (${label})`;
    }

    let minDiff = 7;
    let nextDay = null;

    for (const day of daysOfWeek) {
      const targetDay = daysMap[day];
      if (targetDay === undefined) continue;
      const diff = (targetDay - referenceDay + 7) % 7 || 7;
      if (diff < minDiff) {
        minDiff = diff;
        nextDay = day;
      }
    }

    if (!nextDay) return "N/A";

    const nextDate = new Date(referenceDate);
    nextDate.setDate(referenceDate.getDate() + minDiff);

    if (nextDate > end) {
      return "N/A";
    }

    return `${nextDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })} (Next Day)`;
  };

  const timetable = useMemo(() => {
    const currentDate = new Date();
    const timetableData = classData.map((classItem) => {
      const course = {
        id: classItem._id,
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
        startDate: classItem.courseId?.duration?.startDate,
        endDate: classItem.courseId?.duration?.endDate,
        studentIds: classItem.students.map(
          (student) =>
            student.userId || `fallback-${classItem._id}-${student._id}`
        ),
      };
      return course;
    });

    return timetableData;
  }, [classData]);

  const selectedChildTimetable = useMemo(() => {
    if (!selectedChildId) return [];
    const filtered = timetable.filter((course) =>
      course.studentIds.includes(selectedChildId)
    );
    return filtered;
  }, [timetable, selectedChildId]);

  const filteredTimetable = useMemo(() => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    return selectedChildTimetable.filter((course) => {
      const startDate = course.startDate ? new Date(course.startDate) : null;
      const endDate = course.endDate ? new Date(course.endDate) : null;
      const isValidDate =
        startDate &&
        endDate &&
        !isNaN(startDate.getTime()) &&
        !isNaN(endDate.getTime());

      let statusMatch = true;
      if (selectedDayFilter === "upcoming" && isValidDate) {
        startDate.setHours(0, 0, 0, 0);
        statusMatch = startDate > currentDate;
      } else if (selectedDayFilter === "ongoing" && isValidDate) {
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        statusMatch = startDate <= currentDate && currentDate <= endDate;
      }

      const matches =
        (selectedCategory === "all" || course.category === selectedCategory) &&
        (selectedLevel === "all" || course.level === selectedLevel) &&
        statusMatch;

      return matches;
    });
  }, [
    selectedChildTimetable,
    selectedCategory,
    selectedLevel,
    selectedDayFilter,
  ]);

  const dayOrder = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const groupedTimetableByDay = useMemo(() => {
    const grouped = filteredTimetable.reduce((acc, course) => {
      let day;
      if (course.nextClassDay === "N/A" && selectedDayFilter === "upcoming") {
        day = "Upcoming";
      } else {
        day = course.nextClassDay
          .split(",")[0]
          .replace(/\s*\((Current|Next)\s*Day\)$/, "");
      }

      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(course);
      acc[day].sort((a, b) => {
        const timeA = new Date(`1970/01/01 ${a.timing.split(" - ")[0]}`);
        const timeB = new Date(`1970/01/01 ${b.timing.split(" - ")[0]}`);
        return timeA - timeB;
      });
      return acc;
    }, {});

    const sortedGrouped = {};
    if (grouped["Upcoming"]) {
      sortedGrouped["Upcoming"] = grouped["Upcoming"];
    }
    dayOrder.forEach((day) => {
      if (grouped[day]) {
        sortedGrouped[day] = grouped[day];
      }
    });
    return sortedGrouped;
  }, [filteredTimetable, selectedDayFilter]);

  const handleChildChange = (e) => {
    setSelectedChildId(e.target.value);
    setSelectedCategory("all");
    setSelectedLevel("all");
    setSelectedDayFilter("all");
  };

  const handleViewDetails = (course) => {
    setSelectedCourseForDetail(course);
    setIsDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setSelectedCourseForDetail(null);
  };

  const availableCategories = useMemo(() => {
    const categories = new Set(
      selectedChildTimetable.map((course) => course.category)
    );
    const categoryList = ["all", ...Array.from(categories).sort()];
    return categoryList;
  }, [selectedChildTimetable]);

  const availableLevels = useMemo(() => {
    const levels = new Set(
      selectedChildTimetable.map((course) => course.level)
    );
    const levelList = ["all", ...Array.from(levels).sort()];
    return levelList;
  }, [selectedChildTimetable]);

  const getGradeColor = (index) => {
    const colors = [
      "from-blue-500 to-cyan-500",
      "from-purple-500 to-pink-500",
      "from-green-500 to-emerald-500",
      "from-orange-500 to-red-500",
      "from-indigo-500 to-purple-500",
    ];
    return colors[index % colors.length];
  };

  const getLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-700";
      case "intermediate":
        return "bg-yellow-100 text-yellow-700";
      case "advanced":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading timetable...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl">
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
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Children's Timetable
                  </h1>
                  <p className="text-gray-500 mt-1">
                    Manage and view your children's class schedules
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full">
                      {children.length} children
                    </span>
                    <span className="text-sm text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Family Schedule
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

        {children.length > 0 ? (
          <>
            {/* Child Selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="flex items-center gap-3 mb-4 md:mb-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">
                      Select Child
                    </h3>
                  </div>

                  <div className="relative flex-1 max-w-md w-full md:w-auto">
                    <select
                      value={selectedChildId}
                      onChange={handleChildChange}
                      className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none"
                    >
                      {children.map((child) => (
                        <option key={child.id} value={child.id}>
                          {child.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {selectedChildId && selectedChildTimetable.length > 0 ? (
              <>
                {/* Filters Section with Toggle */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-8"
                >
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 overflow-hidden">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                          <Filter className="w-5 h-5 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">
                          Filter Courses
                        </h3>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200"
                      >
                        <span className="font-medium">
                          {showFilters ? "Hide" : "Show"} Filters
                        </span>
                        <motion.div
                          animate={{ rotate: showFilters ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </motion.div>
                      </motion.button>
                    </div>

                    <AnimatePresence>
                      {showFilters && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="grid grid-cols-1 md:grid-cols-3 gap-6"
                        >
                          {/* Category Filter */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Category
                            </label>
                            <div className="relative">
                              <select
                                value={selectedCategory}
                                onChange={(e) =>
                                  setSelectedCategory(e.target.value)
                                }
                                className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none"
                                disabled={availableCategories.length <= 1}
                              >
                                {availableCategories.map((category) => (
                                  <option key={category} value={category}>
                                    {category === "all"
                                      ? "All Categories"
                                      : category}
                                  </option>
                                ))}
                              </select>
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <BookOpen className="w-5 h-5 text-gray-400" />
                              </div>
                              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                              </div>
                            </div>
                          </div>

                          {/* Level Filter */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Level
                            </label>
                            <div className="relative">
                              <select
                                value={selectedLevel}
                                onChange={(e) =>
                                  setSelectedLevel(e.target.value)
                                }
                                className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none"
                                disabled={availableLevels.length <= 1}
                              >
                                {availableLevels.map((level) => (
                                  <option key={level} value={level}>
                                    {level === "all" ? "All Levels" : level}
                                  </option>
                                ))}
                              </select>
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Star className="w-5 h-5 text-gray-400" />
                              </div>
                              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                              </div>
                            </div>
                          </div>

                          {/* Status Filter */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Course Status
                            </label>
                            <div className="relative">
                              <select
                                value={selectedDayFilter}
                                onChange={(e) =>
                                  setSelectedDayFilter(e.target.value)
                                }
                                className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none"
                              >
                                <option value="all">All Courses</option>
                                <option value="upcoming">
                                  Upcoming Courses
                                </option>
                                <option value="ongoing">Ongoing Courses</option>
                              </select>
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Calendar className="w-5 h-5 text-gray-400" />
                              </div>
                              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>

                {/* Timetable Display */}
                <AnimatePresence mode="wait">
                  {Object.keys(groupedTimetableByDay).length === 0 ? (
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
                        No classes match your current filter criteria. Try
                        adjusting the filters above.
                      </p>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSelectedCategory("all");
                          setSelectedLevel("all");
                          setSelectedDayFilter("all");
                        }}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 font-medium transition-all duration-200"
                      >
                        Clear all filters
                      </motion.button>
                    </motion.div>
                  ) : (
                    <div className="space-y-8">
                      {Object.entries(groupedTimetableByDay).map(
                        ([day, courses], dayIndex) => (
                          <motion.div
                            key={day}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: dayIndex * 0.1 }}
                            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50"
                          >
                            <div className="flex items-center gap-3 mb-6">
                              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                <Calendar className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h3 className="text-2xl font-bold text-gray-800">
                                  {day}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {courses.length} classes scheduled
                                </p>
                              </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                              {courses.map((course, courseIndex) => (
                                <motion.div
                                  key={course.id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: courseIndex * 0.1 }}
                                  className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                                >
                                  {/* Course Header */}
                                  <div
                                    className={`h-2 bg-gradient-to-r ${getGradeColor(
                                      courseIndex
                                    )}`}
                                  ></div>

                                  <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                      <div className="flex-1">
                                        <h4 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors mb-2">
                                          {course.courseTitle}
                                        </h4>
                                        <div className="flex items-center gap-2 mb-3">
                                          <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(
                                              course.level
                                            )}`}
                                          >
                                            {course.level}
                                          </span>
                                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                            {course.category}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Course Details */}
                                    <div className="space-y-3 mb-6">
                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                          <User className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div>
                                          <p className="text-xs text-gray-500 font-medium">
                                            Instructor
                                          </p>
                                          <p className="text-sm font-semibold text-gray-800">
                                            {course.instructor}
                                          </p>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                          <Clock className="w-4 h-4 text-green-600" />
                                        </div>
                                        <div>
                                          <p className="text-xs text-gray-500 font-medium">
                                            Time
                                          </p>
                                          <p className="text-sm font-semibold text-gray-800">
                                            {course.timing}
                                          </p>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                          <MapPin className="w-4 h-4 text-purple-600" />
                                        </div>
                                        <div>
                                          <p className="text-xs text-gray-500 font-medium">
                                            Room
                                          </p>
                                          <p className="text-sm font-semibold text-gray-800">
                                            {course.roomNumber}
                                          </p>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Action Button */}
                                    <motion.button
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                      onClick={() => handleViewDetails(course)}
                                      className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                                    >
                                      <Eye className="w-4 h-4" />
                                      View Details
                                    </motion.button>
                                  </div>

                                  {/* Hover effect overlay */}
                                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/5 to-purple-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"></div>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )
                      )}
                    </div>
                  )}
                </AnimatePresence>
              </>
            ) : selectedChildId ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <div className="relative mx-auto mb-6 w-24 h-24">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-12 h-12 text-gray-400" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  No Classes Enrolled
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  This child is not currently enrolled in any classes. Contact
                  the administration to enroll in courses.
                </p>
              </motion.div>
            ) : null}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="relative mx-auto mb-6 w-24 h-24">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <Baby className="w-12 h-12 text-gray-400" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No Children Found
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              You don't have any children registered in the system yet. Please
              contact support or register your children first.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchClassData}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 font-medium transition-all duration-200 flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Data
            </motion.button>
          </motion.div>
        )}
      </div>

      <CourseDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseModal}
        course={selectedCourseForDetail}
      />
    </div>
  );
};

export default TimeTableManagementForParent;
