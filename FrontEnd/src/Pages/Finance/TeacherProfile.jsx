import React, { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import SideBar from "../../Components/Academic-Finance/SideBar";
import NavBar from "../../Components/Academic-Finance/NavBar";
import Loading from "../../Components/Loading";
import { Search, Users, Mail, Phone, BookOpen, Clock } from "lucide-react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";

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
    <div>
      <NavBar />
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <SideBar />
        <div className="flex-1 p-8 ml-25">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Teacher Management
            </h1>
            <p className="text-gray-600">
              View and manage all teacher profiles and their assigned classes
            </p>
          </div>

          {/* Search and Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Search Bar */}
            <div className="md:col-span-2 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search teachers by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                />
              </div>
            </div>

            {/* Stats Cards */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <p className="text-sm font-medium text-gray-600 mb-1">
                Total Teachers
              </p>
              <h3 className="text-2xl font-bold text-gray-800">
                {teachers.length}
              </h3>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <p className="text-sm font-medium text-gray-600 mb-1">
                Active Classes
              </p>
              <h3 className="text-2xl font-bold text-gray-800">
                {courses.length}
              </h3>
            </div>
          </div>

          {/* Teachers Table */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loading />
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
          )}
        </div>
      </div>
    </div>
  );
}

export default TeacherProfile;
