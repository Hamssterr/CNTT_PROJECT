import React, { useState, useEffect, useContext } from "react";
import Navbar from "../../Components/Academic-Finance/NavBar";
import Sidebar from "../../Components/Academic-Finance/SideBar";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import Loading from "../../Components/Loading";
import {
  Search,
  Users,
  Mail,
  Phone,
  BookOpen,
  Check,
  X,
  GraduationCap,
} from "lucide-react";
import { motion } from "framer-motion";

function StudentProfile() {
  const { backendUrl } = useContext(AppContext);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch students from backend
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
            courses: Array.isArray(lead.course) ? lead.course : [lead.course], // Đổi tên và đảm bảo là mảng
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

  useEffect(() => {
    fetchStudents();
  }, []);

  // Filter students based on search query
  const filteredStudents = students.filter((student) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      student.studentName.toLowerCase().includes(searchTerm) ||
      student.parentName.toLowerCase().includes(searchTerm)
    );
  });

  // Count total students in filtered class
  const totalStudentsInClass = filteredStudents.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar />
      <div className="flex flex-col md:flex-row min-h-screen">
        <Sidebar />
        <div className="flex-1 p-4 md:p-8 md:ml-25">
          {/* Header Section - Updated */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 md:mb-8"
          >
            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Student Management
            </h1>
            <p className="text-gray-600 mt-2">
              View and manage all student profiles and their class enrollments
            </p>
          </motion.div>

          {/* Stats Cards - Updated */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            {[
              {
                title: "Total Students",
                value: students.length,
                icon: <Users />,
                color: "blue",
              },
              {
                title: "Paid Students",
                value: students.filter((s) => s.paymentStatus === "Paid")
                  .length,
                icon: <Check />,
                color: "green",
              },
              {
                title: "Unpaid Students",
                value: students.filter((s) => s.paymentStatus !== "Paid")
                  .length,
                icon: <X />,
                color: "red",
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white p-4 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-${stat.color}-100`}
              >
                <div className="flex items-center">
                  <div className={`p-3 bg-${stat.color}-50 rounded-lg`}>
                    <div className={`h-6 w-6 text-${stat.color}-500`}>
                      {stat.icon}
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                      {stat.value}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Search Section - Updated */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-4 md:p-6 rounded-xl shadow-lg mb-6 md:mb-8"
          >
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="relative w-full md:w-96">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
              {searchQuery && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg"
                >
                  <Users className="h-5 w-5 text-blue-500" />
                  <span className="text-blue-700 font-medium">
                    {filteredStudents.length} student
                    {filteredStudents.length !== 1 ? "s" : ""} found
                  </span>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Students List - Updated with responsive design */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loading />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              {/* Desktop View */}
              <div className="hidden md:block">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider text-left">
                        Student
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider text-left">
                        Contact Information
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider text-left">
                        Class & Payment
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredStudents.map((student, index) => (
                      <tr
                        key={student.id}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center">
                              <Users className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {student.studentName}
                              </div>
                              <div className="text-sm text-gray-500">
                                Parent: {student.parentName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-4">
                            {/* Student Contact Info */}
                            <div className="p-3 bg-blue-50 rounded-lg">
                              <div className="flex items-center mb-2">
                                <GraduationCap className="h-4 w-4 text-blue-600" />
                                <span className="ml-2 text-sm font-medium text-blue-700">
                                  Student Contact
                                </span>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center text-sm text-gray-600 pl-6">
                                  <Mail className="h-4 w-4 mr-2 text-blue-500" />
                                  {student.email}
                                </div>
                                <div className="flex items-center text-sm text-gray-600 pl-6">
                                  <Phone className="h-4 w-4 mr-2 text-blue-500" />
                                  {student.phone}
                                </div>
                              </div>
                            </div>

                            {/* Parent Contact Info */}
                            <div className="p-3 bg-purple-50 rounded-lg">
                              <div className="flex items-center mb-2">
                                <Users className="h-4 w-4 text-purple-600" />
                                <span className="ml-2 text-sm font-medium text-purple-700">
                                  Parent Contact
                                </span>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center text-sm text-gray-600 pl-6">
                                  <Mail className="h-4 w-4 mr-2 text-purple-500" />
                                  {student.parentEmail || student.email}
                                </div>
                                <div className="flex items-center text-sm text-gray-600 pl-6">
                                  <Phone className="h-4 w-4 mr-2 text-purple-500" />
                                  {student.parentPhone || student.phone}
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-4 w-4 text-blue-500 flex-shrink-0" />
                              <div className="flex flex-wrap gap-1.5">
                                {student.courses.map((course, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100"
                                  >
                                    {course}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                student.paymentStatus === "Paid"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {student.paymentStatus === "Paid" ? (
                                <Check className="h-3 w-3 mr-1" />
                              ) : (
                                <X className="h-3 w-3 mr-1" />
                              )}
                              {student.paymentStatus}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile View */}
              <div className="md:hidden space-y-4 p-4">
                {filteredStudents.map((student, index) => (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-lg shadow p-4 border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {student.studentName}
                        </div>
                        <div className="text-sm text-gray-500">
                          Parent: {student.parentName}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <BookOpen className="h-4 w-4 text-blue-500 flex-shrink-0 mt-1" />
                        <div className="flex flex-wrap gap-1.5">
                          {student.courses.map((course, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100"
                            >
                              {course}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          student.paymentStatus === "Paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {student.paymentStatus === "Paid" ? (
                          <Check className="h-3 w-3 mr-1" />
                        ) : (
                          <X className="h-3 w-3 mr-1" />
                        )}
                        {student.paymentStatus}
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      {/* Student Contact - Mobile */}
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="flex items-center mb-2">
                          <GraduationCap className="h-4 w-4 text-blue-600" />
                          <span className="ml-2 text-sm font-medium text-blue-700">
                            Student Contact
                          </span>
                        </div>
                        <div className="space-y-2 pl-6">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="h-4 w-4 text-blue-500" />
                            <span className="break-all">{student.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="h-4 w-4 text-blue-500" />
                            <span>{student.phone}</span>
                          </div>
                        </div>
                      </div>

                      {/* Parent Contact - Mobile */}
                      <div className="bg-purple-50 rounded-lg p-3">
                        <div className="flex items-center mb-2">
                          <Users className="h-4 w-4 text-purple-600" />
                          <span className="ml-2 text-sm font-medium text-purple-700">
                            Parent Contact
                          </span>
                        </div>
                        <div className="space-y-2 pl-6">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="h-4 w-4 text-purple-500" />
                            <span className="break-all">
                              {student.parentEmail || student.email}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="h-4 w-4 text-purple-500" />
                            <span>{student.parentPhone || student.phone}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Empty State - Updated */}
              {filteredStudents.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 text-center"
                >
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No Students Found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Try adjusting your search to find what you're looking for.
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;
