import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  BookOpen,
  Calendar,
  Clock,
  MapPin,
  GraduationCap,
  Award,
  Sparkles,
  Baby,
  Users,
  CheckCircle,
  Star,
  Heart,
} from "lucide-react";

const ChildDetailModal = ({ isOpen, onClose, child, classes }) => {
  if (!isOpen) return null;

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

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex justify-center items-center p-2 sm:p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
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
          className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full mx-4 overflow-hidden relative z-[10000] max-h-[95vh] flex flex-col border border-white/20"
        >
          {/* Enhanced Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-6 relative"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <Baby className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-pink-400 rounded-full flex items-center justify-center">
                    <Heart className="w-2.5 h-2.5 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {child
                      ? `${child.firstName} ${child.lastName}'s Profile`
                      : "Child Profile"}
                  </h2>
                  <p className="text-blue-100 text-sm">
                    Academic journey overview
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-2xl flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
                style={{ zIndex: 10001 }}
              >
                <X className="w-5 h-5 text-white" />
              </motion.button>
            </div>
          </motion.div>

          {/* Enhanced Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-6 space-y-6">
              {/* Child Information Card */}
              {child && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-lg border border-blue-100"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-blue-800">
                      Student Information
                    </h3>
                  </div>

                  <div className="flex items-center gap-6">
                    {/* Profile Image */}
                    <div className="relative">
                      <motion.img
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        src={
                          child.profileImage ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            `${child.firstName} ${child.lastName}`
                          )}&background=random&color=fff&size=120&font-size=0.5&bold=true`
                        }
                        alt={`${child.firstName}'s profile`}
                        className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg"
                      />
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    {/* Student Details */}
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-white rounded-xl border border-blue-100 shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <User className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-medium">
                                Full Name
                              </p>
                              <p className="text-sm font-bold text-gray-800">
                                {`${child.firstName} ${child.lastName}`}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-white rounded-xl border border-blue-100 shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                              <Award className="w-4 h-4 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-medium">
                                Student ID
                              </p>
                              <p className="text-sm font-bold text-gray-800">
                                {child.id}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="flex items-center gap-2">
                        <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          Active Student
                        </span>
                        <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center gap-2">
                          <Star className="w-3 h-3" />
                          {classes.length} Classes
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Enrolled Classes Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 shadow-lg border border-gray-100"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        Enrolled Classes
                      </h3>
                      <p className="text-sm text-gray-600">
                        Current academic schedule
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-200">
                    <Users className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {classes.length} Classes
                    </span>
                  </div>
                </div>

                {classes.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-gray-200"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="w-8 h-8 text-gray-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                      No Classes Enrolled
                    </h4>
                    <p className="text-gray-500 max-w-md mx-auto">
                      This student is not currently enrolled in any classes.
                      Contact the administration to enroll in courses.
                    </p>
                  </motion.div>
                ) : (
                  <div className="grid gap-4">
                    {classes.map((classItem, index) => (
                      <motion.div
                        key={classItem._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="group bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 overflow-hidden relative"
                      >
                        {/* Class Header */}
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-12 h-12 bg-gradient-to-br ${getGradeColor(
                                index
                              )} rounded-xl flex items-center justify-center shadow-lg`}
                            >
                              <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                {classItem.className}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {classItem.courseId?.title ||
                                  "Course Information"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                              Active
                            </span>
                          </div>
                        </div>

                        {/* Class Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Calendar className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 font-medium">
                                  Schedule
                                </p>
                                <p className="text-sm font-semibold text-gray-800">
                                  {classItem.schedule?.daysOfWeek?.join(", ") ||
                                    "N/A"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                <Clock className="w-4 h-4 text-orange-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 font-medium">
                                  Time Shift
                                </p>
                                <p className="text-sm font-semibold text-gray-800">
                                  {classItem.schedule?.shift || "N/A"}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                <User className="w-4 h-4 text-purple-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 font-medium">
                                  Instructor
                                </p>
                                <p className="text-sm font-semibold text-gray-800">
                                  {classItem.instructor?.name || "N/A"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                <MapPin className="w-4 h-4 text-green-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 font-medium">
                                  Classroom
                                </p>
                                <p className="text-sm font-semibold text-gray-800">
                                  {classItem.room || "N/A"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Hover effect overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/5 to-purple-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"></div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          </div>

          {/* Enhanced Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="border-t border-gray-200 bg-gray-50 p-6"
          >
            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Close
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChildDetailModal;
