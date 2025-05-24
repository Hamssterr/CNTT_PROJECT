import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronDown,
  ChevronUp,
  Users,
  Calendar,
  BookOpen,
  MapPin,
  GraduationCap,
  Mail,
  Clock,
} from "lucide-react";
const formatSchedule = (schedule) => {
  if (!schedule) return { daysOfWeekStr: "Not set", shiftStr: "Not set" };

  const daysMap = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
  };

  let daysOfWeekStr = "Not set";
  if (Array.isArray(schedule.daysOfWeek) && schedule.daysOfWeek.length > 0) {
    daysOfWeekStr = schedule.daysOfWeek
      .map((day) => daysMap[Number(day)] ?? day)
      .join(", ");
  }

  // Nếu shift là chuỗi giờ, hiển thị trực tiếp
  let shiftStr = "Not set";
  if (typeof schedule.shift === "string" && schedule.shift.trim() !== "") {
    shiftStr = schedule.shift;
  }

  return { daysOfWeekStr, shiftStr };
};

// Add formatEnrolledDate utility function
const formatEnrolledDate = (date) => {
  if (!date) return "Not available";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
const ViewClassModal = ({ show, onClose, classData }) => {
  const [activeTab, setActiveTab] = React.useState("info");

  if (!show || !classData) return null;

  // Lấy thông tin schedule đã format
  const { daysOfWeekStr, shiftStr } = formatSchedule(classData?.schedule);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex justify-center items-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden"
          >
            {/* Header with Gradient */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-6 relative">
              <button
                onClick={onClose}
                className="absolute right-6 top-6 text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all"
              >
                <X size={20} />
              </button>
              <h2 className="text-2xl font-bold text-white mb-2">
                {classData.className}
              </h2>
              <div className="flex items-center gap-4 text-blue-100">
                <div className="flex items-center gap-2">
                  <BookOpen size={16} />
                  <span>{classData.courseId?.title || "No Course"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>{classData.room || "No Room"}</span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex px-8">
                {[
                  { id: "info", label: "Information", icon: BookOpen },
                  { id: "schedule", label: "Schedule", icon: Calendar },
                  { id: "students", label: "Students", icon: Users },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-all ${
                      activeTab === tab.id
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <tab.icon size={18} />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div className="p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {activeTab === "info" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Basic Information Card */}
                      <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                          Basic Information
                        </h3>
                        <InfoItem
                          icon={BookOpen}
                          label="Course"
                          value={classData.courseId?.title || "Not set"}
                        />
                        <InfoItem
                          icon={MapPin}
                          label="Room"
                          value={classData.room || "Not set"}
                        />
                        <InfoItem
                          icon={GraduationCap}
                          label="Instructor"
                          value={classData.instructor?.name || "Not set"}
                        />
                      </div>

                      {/* Statistics Card */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                          Class Statistics
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <StatCard
                            label="Total Students"
                            value={classData.students?.length || 0}
                            icon={Users}
                          />
                          <StatCard
                            label="Schedule Days"
                            value={classData.schedule?.daysOfWeek?.length || 0}
                            icon={Calendar}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "schedule" && (
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-6">
                        Class Schedule
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ScheduleItem
                          icon={Calendar}
                          label="Days of Week"
                          value={daysOfWeekStr} // Sử dụng giá trị đã format
                        />
                        <ScheduleItem
                          icon={Clock}
                          label="Shift"
                          value={shiftStr} // Sử dụng giá trị đã format
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === "students" && (
                    <div className="bg-white rounded-xl border border-gray-200">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                Student
                              </th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                Email
                              </th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                Enrolled Date
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {classData.students?.map((student, index) => (
                              <motion.tr
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                key={index}
                                className="hover:bg-gray-50 transition-colors"
                              >
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                      <Users
                                        size={16}
                                        className="text-blue-600"
                                      />
                                    </div>
                                    <span className="text-gray-800 font-medium">
                                      {`${student.lastName || ""} ${
                                        student.firstName || ""
                                      }`}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                  {student.email}
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                  {formatEnrolledDate(student.enrolledDate)}
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Helper Components
const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
      <Icon size={18} className="text-blue-600" />
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-gray-800 font-medium mt-0.5">{value}</p>
    </div>
  </div>
);

const StatCard = ({ label, value, icon: Icon }) => (
  <div className="bg-white rounded-xl p-4 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
      </div>
      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
        <Icon size={20} className="text-blue-600" />
      </div>
    </div>
  </div>
);

const ScheduleItem = ({ icon: Icon, label, value }) => (
  <div className="bg-white rounded-xl p-4 shadow-sm">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
        <Icon size={20} className="text-blue-600" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-gray-800 font-medium mt-0.5">{value}</p>
      </div>
    </div>
  </div>
);

export default ViewClassModal;
