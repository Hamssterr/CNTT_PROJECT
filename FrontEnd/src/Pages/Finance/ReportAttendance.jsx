import React, { useState, useEffect } from "react";
import Navbar from "../../Components/Academic-Finance/NavBar";
import Sidebar from "../../Components/Academic-Finance/SideBar";
import axios from "axios";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { Calendar, Users, UserX, Search } from "lucide-react"; // Thêm import icons
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import {
  FiX,
  FiUser,
  FiMail,
  FiCheck,
  FiX as FiXCircle,
  FiCalendar,
} from "react-icons/fi";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "framer-motion";

function ReportAttendance() {
  const { backendUrl } = useContext(AppContext);
  const [attendanceReports, setAttendanceReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);

  // Fetch dữ liệu từ API
  useEffect(() => {
    const fetchAttendanceReports = async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/academic-finance/report`,
          {
            withCredentials: true,
          }
        );
        setAttendanceReports(data.reports);
      } catch (error) {
        console.error("Error fetching attendance reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceReports();
  }, []);

  // Lọc báo cáo theo tìm kiếm
  const filteredReports = attendanceReports.filter((report) =>
    report.className.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Navbar />
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Sidebar />
        <div className="flex-1 p-8 ml-25">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Attendance Reports
            </h1>
            <p className="text-gray-600">
              Monitor class attendance and student participation
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-6 relative">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by class name..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <UserX size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">
                No attendance reports found
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReports.map((report) => (
                <div
                  key={report._id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">
                          {report.className}
                        </h3>
                        {/* Thêm phần hiển thị instructor */}
                        <div className="flex items-center mt-1 text-sm text-gray-600">
                          <FiUser className="mr-1" size={14} />
                          <span>
                            Instructor: {report.instructor?.name}
                          </span>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {new Date(report.date).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="text-xl font-bold text-gray-700">
                          {report.totalStudents}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-600">Present</p>
                        <p className="text-xl font-bold text-green-700">
                          {report.present}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <p className="text-sm text-red-600">Absent</p>
                        <p className="text-xl font-bold text-red-700">
                          {report.absent}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-3 bg-gray-50 flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar size={16} className="mr-2" />
                      {new Date(report.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Modal for Absent Students Details */}
          {selectedReport && (
            <Transition appear show={Boolean(selectedReport)} as={Fragment}>
              <Dialog
                as="div"
                className="relative z-50"
                onClose={() => setSelectedReport(null)}
              >
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                  <div className="flex min-h-full items-center justify-center p-4">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0 scale-95"
                      enterTo="opacity-100 scale-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100 scale-100"
                      leaveTo="opacity-0 scale-95"
                    >
                      <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
                        {/* Header */}
                        <div className="relative bg-blue-600 px-6 py-4">
                          <button
                            onClick={() => setSelectedReport(null)}
                            className="absolute right-4 top-4 rounded-full bg-blue-500 p-1 hover:bg-blue-700 transition-colors"
                          >
                            <FiX className="h-6 w-6 text-white" />
                          </button>
                          <Dialog.Title
                            as="h3"
                            className="text-xl font-bold text-white"
                          >
                            {selectedReport.className}
                          </Dialog.Title>
                          <div className="flex items-center mt-2 text-blue-100">
                            <FiCalendar className="mr-2" />
                            {new Date(selectedReport.date).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Present Students Section */}
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 }}
                              className="bg-green-50 rounded-xl p-4 border border-green-100"
                            >
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-semibold text-green-700 flex items-center">
                                  <FiCheck className="mr-2" />
                                  Present Students
                                </h4>
                                <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-medium">
                                  {selectedReport.present} students
                                </span>
                              </div>
                              <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                                {selectedReport.presentStudents &&
                                selectedReport.presentStudents.length > 0 ? (
                                  selectedReport.presentStudents.map(
                                    (student, idx) => (
                                      <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        key={idx}
                                        className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow"
                                      >
                                        <div className="flex items-center">
                                          <div className="bg-green-100 rounded-full p-2">
                                            <FiUser className="text-green-600" />
                                          </div>
                                          <div className="ml-3">
                                            <div className="font-medium text-gray-800">
                                              {student.name}
                                            </div>
                                            <div className="text-sm text-gray-500 flex items-center mt-1">
                                              <FiMail
                                                className="mr-1"
                                                size={12}
                                              />
                                              {student.email}
                                            </div>
                                          </div>
                                        </div>
                                      </motion.div>
                                    )
                                  )
                                ) : (
                                  <div className="text-gray-500 text-center py-4">
                                    No present students.
                                  </div>
                                )}
                              </div>
                            </motion.div>

                            {/* Absent Students Section */}
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                              className="bg-red-50 rounded-xl p-4 border border-red-100"
                            >
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-semibold text-red-700 flex items-center">
                                  <FiXCircle className="mr-2" />
                                  Absent Students
                                </h4>
                                <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium">
                                  {selectedReport.absent} students
                                </span>
                              </div>
                              <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                                {selectedReport.absentStudents &&
                                selectedReport.absentStudents.length > 0 ? (
                                  selectedReport.absentStudents.map(
                                    (student, idx) => (
                                      <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        key={idx}
                                        className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow"
                                      >
                                        <div className="flex items-center">
                                          <div className="bg-red-100 rounded-full p-2">
                                            <FiUser className="text-red-600" />
                                          </div>
                                          <div className="ml-3">
                                            <div className="font-medium text-gray-800">
                                              {student.name}
                                            </div>
                                            <div className="text-sm text-gray-500 flex items-center mt-1">
                                              <FiMail
                                                className="mr-1"
                                                size={12}
                                              />
                                              {student.email}
                                            </div>
                                          </div>
                                        </div>
                                      </motion.div>
                                    )
                                  )
                                ) : (
                                  <div className="text-gray-500 text-center py-4">
                                    No absent students.
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          </div>
                        </div>
                      </Dialog.Panel>
                    </Transition.Child>
                  </div>
                </div>
              </Dialog>
            </Transition>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReportAttendance;
