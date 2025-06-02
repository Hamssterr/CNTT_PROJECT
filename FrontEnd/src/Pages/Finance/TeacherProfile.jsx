import React, { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import SideBar from "../../Components/Academic-Finance/SideBar";
import NavBar from "../../Components/Academic-Finance/NavBar";
import Loading from "../../Components/Loading";
import { Search, Users, Mail, Phone, BookOpen, Clock } from "lucide-react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { motion } from "framer-motion";

function TeacherProfile() {
  const { backendUrl } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(true);
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch teachers
  const fetchTeachers = async () => {
    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate loading

      const { data } = await axios.get(
        `${backendUrl}/api/admin/getInstructors`
      );
      if (data.success) {
        setTeachers(data.instructors);
      } else {
        Swal.fire(
          "Error",
          data.message || "Failed to fetch teachers.",
          "error"
        );
      }
    } catch (error) {
      Swal.fire("Error", "Failed to fetch teachers.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch courses
  const fetchCourses = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/getCourse`);
      if (data.success) {
        setCourses(data.courses);
      } else {
        Swal.fire("Error", data.message || "Failed to fetch courses.", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Failed to fetch courses.", "error");
    }
  };

  useEffect(() => {
    fetchTeachers();
    fetchCourses();
  }, []);

  // Map teachers with their classes and times
  const teachersWithClasses = teachers.map((teacher) => {
    const teacherCourses = courses.filter(
      (course) => course.instructor?.id === teacher._id
    );

    return {
      ...teacher,
      classes: teacherCourses.map((course) => course.title),
      time: teacherCourses
        .map((course) => course.schedule?.shift || "N/A")
        .join(", "),
    };
  });

  // Filter teachers based on search query
  const filteredTeachers = teachersWithClasses.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <NavBar />
      <div className="flex flex-col md:flex-row min-h-screen">
        <SideBar />
        <div className="flex-1 p-4 md:p-8 md:ml-25">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 md:mb-8"
          >
            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
              Teacher Management
            </h1>
            <p className="text-gray-600">
              View and manage all teacher profiles and their assigned classes
            </p>
          </motion.div>

          {/* Search and Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search teachers by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl shadow-lg text-white"
            >
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-100" />
                <div>
                  <p className="text-sm font-medium text-blue-100">
                    Total Teachers
                  </p>
                  <h3 className="text-2xl font-bold">{teachers.length}</h3>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-4 rounded-xl shadow-lg text-white"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="h-8 w-8 text-indigo-100" />
                <div>
                  <p className="text-sm font-medium text-indigo-100">
                    Active Classes
                  </p>
                  <h3 className="text-2xl font-bold">{courses.length}</h3>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Teachers List */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loading />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              {/* Desktop View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider text-left">
                        Teacher Information
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider text-left">
                        Contact Details
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider text-left">
                        Class & Schedule
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredTeachers.length > 0 ? (
                      filteredTeachers.map((teacher, index) => (
                        <tr
                          key={teacher._id}
                          className="hover:bg-gray-50 transition-colors duration-200"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center">
                                <Users className="h-5 w-5 text-blue-600" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {teacher.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  Teacher ID: {index + 1}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-2">
                              <div className="flex items-center text-sm text-gray-600">
                                <Mail className="h-4 w-4 mr-2" />
                                {teacher.email}
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <Phone className="h-4 w-4 mr-2" />
                                {teacher.phoneNumber}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {teacher.classes && teacher.classes.length > 0 ? (
                              <div className="space-y-3">
                                {teacher.classes.map((cls, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-start space-x-4"
                                  >
                                    <div className="flex items-center text-sm text-gray-600">
                                      <BookOpen className="h-4 w-4 mr-2 text-green-500" />
                                      <span className="font-medium">{cls}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500">
                                      <Clock className="h-4 w-4 mr-2 text-orange-500" />
                                      <span>
                                        {teacher.time.split(", ")[idx] || "N/A"}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-sm text-gray-500">
                                No classes assigned
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="px-6 py-8 text-center">
                          <div className="flex flex-col items-center">
                            <Users className="h-12 w-12 text-gray-400 mb-4" />
                            <p className="text-gray-500 text-lg mb-1">
                              No teachers found
                            </p>
                            <p className="text-gray-400 text-sm">
                              Try adjusting your search
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile View */}
              <div className="md:hidden space-y-4 p-4">
                {filteredTeachers.map((teacher, index) => (
                  <motion.div
                    key={teacher._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 border border-gray-100"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {teacher.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          Teacher ID: {index + 1}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm border-t border-gray-100 pt-3">
                      <div className="flex items-center text-gray-600">
                        <Mail className="h-4 w-4 mr-2 text-blue-500" />
                        {teacher.email}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-2 text-blue-500" />
                        {teacher.phoneNumber}
                      </div>
                    </div>

                    <div className="mt-3 space-y-2 border-t border-gray-100 pt-3">
                      {teacher.classes && teacher.classes.length > 0 ? (
                        teacher.classes.map((cls, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center text-gray-600">
                              <BookOpen className="h-4 w-4 mr-2 text-green-500" />
                              <span className="font-medium">{cls}</span>
                            </div>
                            <div className="flex items-center text-gray-500">
                              <Clock className="h-4 w-4 mr-2 text-orange-500" />
                              <span>{teacher.time.split(", ")[idx] || "N/A"}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500">
                          No classes assigned
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}

                {filteredTeachers.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 text-lg mb-1">No teachers found</p>
                    <p className="text-gray-400 text-sm">Try adjusting your search</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TeacherProfile;
