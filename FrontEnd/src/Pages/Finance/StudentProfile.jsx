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

function StudentProfile() {
  const { backendUrl } = useContext(AppContext);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch students from backend
  const fetchStudents = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate loading
      const { data } = await axios.get(
        `${backendUrl}/api/consultant/getLeadUsers`
      );
      if (data.success) {
        const transformedData = data.leadUsers.map((lead) => ({
          id: lead._id,
          studentName: lead.studentName,
          parentName: lead.name,
          email: lead.email,
          phone: lead.phone,
          className: lead.course,
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
    <div>
      <Navbar />
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Sidebar />
        <div className="flex-1 p-8 ml-25">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Student Management
            </h1>
            <p className="text-gray-600">
              View and manage all student profiles and their class enrollments
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Students
                  </p>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {students.length}
                  </h3>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 bg-green-50 rounded-lg">
                  <Check className="h-6 w-6 text-green-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Paid Students
                  </p>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {students.filter((s) => s.paymentStatus === "Paid").length}
                  </h3>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 bg-red-50 rounded-lg">
                  <X className="h-6 w-6 text-red-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Unpaid Students
                  </p>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {students.filter((s) => s.paymentStatus !== "Paid").length}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-96">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search by student or parent name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                />
              </div>

              {searchQuery && (
                <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span className="text-blue-700 font-medium">
                    {filteredStudents.length} student
                    {filteredStudents.length !== 1 ? "s" : ""} found
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Students Table */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loading />
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
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
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="h-4 w-4 mr-2" />
                            {student.email}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="h-4 w-4 mr-2" />
                            {student.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <BookOpen className="h-4 w-4 mr-2 text-blue-500" />
                            <span className="font-medium">
                              {student.className}
                            </span>
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

              {/* Empty State */}
              {filteredStudents.length === 0 && (
                <div className="p-8 text-center">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No Students Found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Try adjusting your search or filter to find what you're
                    looking for.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;
