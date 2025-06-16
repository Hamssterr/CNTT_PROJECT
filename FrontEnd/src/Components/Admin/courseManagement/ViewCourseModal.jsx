import React, { useState } from "react";
import {
  Pencil,
  Trash2,
  X,
  ChevronDown,
  ChevronUp,
  BookOpen,
  User,
  Calendar,
  Users,
  Target,
  Clock,
  DollarSign,
  Award,
  Info,
  Mail,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";

import EditEnrolledStudentModal from "./EnrolledStudent/EditEnrolledStudentModal";
import DeleteEnrolledStudentModal from "./EnrolledStudent/DeleteEnrolledStudentModal";

const ViewCourseModal = ({
  isOpen,
  onClose,
  course,
  instructorList,
  courses,
  backendUrl,
  fetchingCourseData,
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [showTargets, setShowTargets] = useState(false);
  const [showEnrolledUsers, setShowEnrolledUsers] = useState(false);

  if (!isOpen || !course) return null;

  // Existing functions remain the same...
  const instructor = instructorList?.find(
    (i) => i._id === course.instructor?.id
  );

  const formatDuration = (duration) => {
    if (!duration) return "Not set";
    const { totalHours, startDate, endDate } = duration;
    const start = startDate
      ? new Date(startDate).toLocaleDateString("vi-VN")
      : "Not set";
    const end = endDate
      ? new Date(endDate).toLocaleDateString("vi-VN")
      : "Not set";
    return `${totalHours || "Not set"} hours, from ${start} to ${end}`;
  };

  const formatEnrolledDate = (date) => {
    if (!date) return "Not set";
    const d = new Date(date);
    const datePart = d.toLocaleDateString("vi-VN", { dateStyle: "short" });
    const timePart = d.toLocaleTimeString("vi-VN", { timeStyle: "short" });
    return `${datePart} - ${timePart}`;
  };

  const handleChangeCourse = async (userId, newCourseId) => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;
      const response = await axios.put(
        `${backendUrl}/api/admin/changeCourseEnrollStudent/${course._id}`,
        { userId, newCourseId },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const { data } = response;
      if (data.success) {
        toast.success(data.message || "Student course changed successfully");
        await fetchingCourseData();
        setShowEditModal(false);
        setSelectedUserId(null);
        onClose();
      } else {
        toast.error(data.message || "Failed to change course");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change course");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async () => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;
      const response = await axios.delete(
        `${backendUrl}/api/admin/${course._id}/removeEnrollStudent/${selectedUserId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const { data } = response;
      if (data.success) {
        toast.success(data.message || "Student removed successfully");
        await fetchingCourseData();
        setShowDeleteModal(false);
        setSelectedUserId(null);
        onClose();
      } else {
        toast.error(data.message || "Failed to remove student");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove student");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-700 border-green-200";
      case "inactive":
        return "bg-red-100 text-red-700 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
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

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex justify-center items-center p-2 sm:p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 300,
            duration: 0.3,
          }}
          className="bg-white rounded-3xl p-4 sm:p-6 lg:p-8 w-full max-w-sm sm:max-w-2xl lg:max-w-6xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden z-[10000] border border-white/20"
        >
          {/* Enhanced Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex justify-between items-center mb-6 flex-shrink-0 border-b border-gray-200 pb-6"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Course Details
                </h2>
                <p className="text-gray-500 mt-1">
                  Comprehensive course information
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-3 hover:bg-gray-100 rounded-2xl transition-all duration-200 group"
            >
              <X
                size={24}
                className="text-gray-500 group-hover:text-gray-700 transition-colors"
              />
            </motion.button>
          </motion.div>

          {/* Enhanced Scrollable Content */}
          <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar">
            {/* Basic Information & Instructor */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-lg border border-blue-100"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Info className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Basic Information
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-xl border border-blue-100">
                    <span className="text-gray-600 font-medium text-sm block mb-2">
                      Course Title
                    </span>
                    <p className="text-gray-800 font-semibold text-lg break-words">
                      {course.title || "Not set"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-xl border border-blue-100">
                      <span className="text-gray-600 font-medium text-sm block mb-2">
                        Category
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {course.category || "Not set"}
                      </span>
                    </div>

                    <div className="p-4 bg-white rounded-xl border border-blue-100">
                      <span className="text-gray-600 font-medium text-sm block mb-2">
                        Level
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(
                          course.level
                        )}`}
                      >
                        {course.level || "Not set"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-xl border border-blue-100">
                      <span className="text-gray-600 font-medium text-sm block mb-2">
                        Price
                      </span>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <p className="text-gray-800 font-semibold">
                          {course.price
                            ? `${course.price} ${course.currency || ""}`
                            : "Not set"}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-white rounded-xl border border-blue-100">
                      <span className="text-gray-600 font-medium text-sm block mb-2">
                        Status
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                          course.status
                        )}`}
                      >
                        {course.status || "Not set"}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Instructor & Thumbnail */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-lg border border-green-100"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Instructor & Media
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-xl border border-green-100">
                    <span className="text-gray-600 font-medium text-sm block mb-2">
                      Instructor
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-green-600" />
                      </div>
                      <p className="text-gray-800 font-semibold">
                        {instructor?.name || "Not assigned"}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-green-100">
                    <span className="text-gray-600 font-medium text-sm block mb-3">
                      Course Thumbnail
                    </span>
                    {course.thumbnail ? (
                      <div className="relative group">
                        <img
                          src={course.thumbnail}
                          alt={course.title || "Course Thumbnail"}
                          className="w-full h-48 object-cover rounded-xl shadow-md group-hover:shadow-lg transition-shadow duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-xl transition-all duration-300"></div>
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                        <div className="text-center">
                          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500 text-sm">
                            No thumbnail available
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Course Targets */}
            {course.target?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 shadow-lg border border-purple-100"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Target className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">
                      Course Information
                    </h3>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowTargets(!showTargets)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-xl transition-all duration-200"
                  >
                    <span className="font-medium">View Details</span>
                    <motion.div
                      animate={{ rotate: showTargets ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown size={16} />
                    </motion.div>
                  </motion.button>
                </div>

                <AnimatePresence>
                  {showTargets && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="p-4 bg-white rounded-xl border border-purple-100">
                        <span className="text-gray-600 font-medium text-sm block mb-3">
                          Description
                        </span>
                        <p
                          className="text-gray-800 leading-relaxed"
                          style={{ whiteSpace: "pre-line" }}
                        >
                          {course.description || "No description available"}
                        </p>
                      </div>

                      <div className="p-4 bg-white rounded-xl border border-purple-100">
                        <span className="text-gray-600 font-medium text-sm block mb-3">
                          Learning Targets
                        </span>
                        <div className="space-y-2">
                          {course.target.map((item, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg"
                            >
                              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                                <span className="text-purple-600 text-xs font-bold">
                                  {index + 1}
                                </span>
                              </div>
                              <p className="text-gray-800 flex-1">
                                {item.description || "Not set"}
                              </p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Schedule & Enrollment */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 shadow-lg border border-orange-100"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Schedule & Enrollment
                  </h3>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowSchedule(!showSchedule)}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-xl transition-all duration-200"
                >
                  <span className="font-medium">View Details</span>
                  <motion.div
                    animate={{ rotate: showSchedule ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown size={16} />
                  </motion.div>
                </motion.button>
              </div>

              <AnimatePresence>
                {showSchedule && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div className="p-4 bg-white rounded-xl border border-orange-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-orange-600" />
                        <span className="text-gray-600 font-medium text-sm">
                          Duration
                        </span>
                      </div>
                      <p className="text-gray-800">
                        {formatDuration(course.duration)}
                      </p>
                    </div>

                    <div className="p-4 bg-white rounded-xl border border-orange-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-orange-600" />
                        <span className="text-gray-600 font-medium text-sm">
                          Schedule
                        </span>
                      </div>
                      <p className="text-gray-800">
                        {course.schedule?.daysOfWeek?.length > 0
                          ? `${course.schedule.daysOfWeek.join(", ")} | ${
                              course.schedule.shift || "Not set"
                            }`
                          : "Not set"}
                      </p>
                    </div>

                    <div className="p-4 bg-white rounded-xl border border-orange-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-orange-600" />
                        <span className="text-gray-600 font-medium text-sm">
                          Max Enrollment
                        </span>
                      </div>
                      <p className="text-gray-800">
                        {course.maxEnrollment || "Unlimited"}
                      </p>
                    </div>

                    <div className="p-4 bg-white rounded-xl border border-orange-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="w-4 h-4 text-orange-600" />
                        <span className="text-gray-600 font-medium text-sm">
                          Current Enrollment
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-gray-800">
                          {course.enrolledUsers?.length || 0}
                        </span>
                        <span className="text-gray-600">students</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Enrolled Users */}
            {course.enrolledUsers?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 shadow-lg border border-indigo-100"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                      <Users className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        Enrolled Students
                      </h3>
                      <p className="text-sm text-gray-600">
                        {course.enrolledUsers.length} students enrolled
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowEnrolledUsers(!showEnrolledUsers)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-xl transition-all duration-200"
                  >
                    <span className="font-medium">View Students</span>
                    <motion.div
                      animate={{ rotate: showEnrolledUsers ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown size={16} />
                    </motion.div>
                  </motion.button>
                </div>

                <AnimatePresence>
                  {showEnrolledUsers && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      {/* Mobile Card View */}
                      <div className="block lg:hidden space-y-4">
                        {course.enrolledUsers.map((user, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl p-4 border border-indigo-100 shadow-sm"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                  <User className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-800">
                                    {(user.lastName || "") +
                                      " " +
                                      (user.firstName || "") || "Not set"}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    {user.email || "Not set"}
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="p-2 rounded-lg hover:bg-blue-100 text-blue-600 transition-colors"
                                  onClick={() => {
                                    setSelectedUserId(user.userId);
                                    setShowEditModal(true);
                                  }}
                                  title="Edit"
                                >
                                  <Pencil size={16} />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                                  onClick={() => {
                                    setSelectedUserId(user.userId);
                                    setShowDeleteModal(true);
                                  }}
                                  title="Delete"
                                >
                                  <Trash2 size={16} />
                                </motion.button>
                              </div>
                            </div>
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Enrolled:</span>{" "}
                              {formatEnrolledDate(user.enrolledDate)}
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Desktop Table View */}
                      <div className="hidden lg:block overflow-x-auto max-h-80 bg-white rounded-xl border border-indigo-100">
                        <table className="w-full">
                          <thead className="bg-indigo-50">
                            <tr>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                Student
                              </th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                Email
                              </th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                Enrolled Date
                              </th>
                              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {course.enrolledUsers.map((user, index) => (
                              <motion.tr
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="hover:bg-indigo-25 transition-colors"
                              >
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                                      <User className="w-4 h-4 text-indigo-600" />
                                    </div>
                                    <span className="font-medium text-gray-800">
                                      {(user.lastName || "") +
                                        " " +
                                        (user.firstName || "") || "Not set"}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                  {user.email || "Not set"}
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                  {formatEnrolledDate(user.enrolledDate)}
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex justify-center gap-2">
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      className="p-2 rounded-lg hover:bg-blue-100 text-blue-600 transition-colors"
                                      onClick={() => {
                                        setSelectedUserId(user.userId);
                                        setShowEditModal(true);
                                      }}
                                      title="Edit"
                                    >
                                      <Pencil size={16} />
                                    </motion.button>
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                                      onClick={() => {
                                        setSelectedUserId(user.userId);
                                        setShowDeleteModal(true);
                                      }}
                                      title="Delete"
                                    >
                                      <Trash2 size={16} />
                                    </motion.button>
                                  </div>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </div>

          {/* Enhanced Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-6"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200"
            >
              Close
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Modals */}
        <EditEnrolledStudentModal
          show={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUserId(null);
          }}
          onSubmit={handleChangeCourse}
          loading={loading}
          courses={courses}
          currentCourseId={course._id}
          userId={selectedUserId}
        />
        <DeleteEnrolledStudentModal
          show={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedUserId(null);
          }}
          onConfirm={handleDeleteStudent}
          loading={loading}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default ViewCourseModal;
