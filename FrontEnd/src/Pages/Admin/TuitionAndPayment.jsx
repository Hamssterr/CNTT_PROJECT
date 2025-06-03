import React, { useContext, useEffect, useState } from "react";
import NavbarAdmin from "../../Components/Admin/Navbar";
import SidebarAdmin from "../../Components/Admin/Sidebar";
import {
  Search,
  DollarSign,
  Users,
  AlertCircle,
  Download,
  Bell,
} from "lucide-react";
import Swal from "sweetalert2";
import { jsPDF } from "jspdf";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import Loading from "../../Components/Loading";

const TuitionAndPayment = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(4);
  const { backendUrl } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifiedStudents, setNotifiedStudents] = useState({});

  // Fetch students with status "Contacted" from backend
  const fetchStudents = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate loading
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

  // Fetch courses from backend
  const fetchCourses = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/course/getAllCourse`);
      if (data.success) {
        setCourses(data.courses);
      } else {
        Swal.fire("Error", data.message || "Failed to fetch courses.", "error");
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, [backendUrl]);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when search query changes
  }, [searchQuery]);

  // Filter students based on search query
  const filteredStudents = students
    .map((student) => {
      const course = courses.find(
        (course) => course.title === student.className
      );
      return {
        ...student,
        amountDue: course ? course.price : "N/A",
        dueDate: "2025-12-31",
      };
    })
    .filter(
      (student) =>
        student.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.className.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Calculate the index of the first and last student on the current page
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  // Only count unpaid students for summary
  const unpaidStudents = filteredStudents.filter(
    (student) => student.paymentStatus === "Unpaid"
  );

  // Calculate summary metrics based on unpaid students
  const totalOutstanding = unpaidStudents.reduce(
    (sum, student) =>
      sum + (student.amountDue !== "N/A" ? student.amountDue : 0),
    0
  );
  const totalStudents = unpaidStudents.length;

  // Handler for payment update - update paymentStatus to "Paid"
  const handlePayment = async (id) => {
    try {
      const currentStudent = students.find((student) => student.id === id);
      if (!currentStudent) {
        Swal.fire("Error", "Student not found", "error");
        return;
      }

      const { data } = await axios.put(
        `${backendUrl}/api/admin/updateLeadUser/${id}`,
        {
          name: currentStudent.parentName,
          studentName: currentStudent.studentName,
          email: currentStudent.email,
          phone: currentStudent.phone,
          course: currentStudent.className,
          registrationDate: new Date(),
          status: currentStudent.status || "Pending",
          paymentStatus: "Paid",
        }
      );

      if (data.success) {
        setStudents((prev) =>
          prev.map((student) =>
            student.id === id ? { ...student, paymentStatus: "Paid" } : student
          )
        );

        Swal.fire({
          title: "Success!",
          text: "Payment status updated successfully",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire(
          "Error",
          data.message || "Failed to update payment status",
          "error"
        );
      }
    } catch (error) {
      console.error("Payment update error:", error);
      Swal.fire("Error", "Failed to update payment status", "error");
    }
  };

  // Handle printing the invoice
  const handlePrintInvoice = (student) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Invoice for Tuition Payment", 14, 22);
    doc.setFontSize(12);
    doc.text(`Student: ${student.studentName}`, 14, 30);
    doc.text(`Class: ${student.className}`, 14, 38);
    doc.text(`Amount Due: $${student.amountDue}`, 14, 46);
    doc.text(`Due Date: ${student.dueDate}`, 14, 54);
    doc.text(`Status: ${student.paymentStatus}`, 14, 62);
    doc.save(`invoice_${student.studentName}_${student.id}.pdf`);
  };

  // Handle notifying the parent
  const handleNotifyParent = (student) => {
    const today = new Date().toISOString().split("T")[0];

    if (notifiedStudents[student.id] === today) {
      Swal.fire(
        "Notification Already Sent",
        `A notification has already been sent to the parent of ${student.studentName} today.`,
        "warning"
      );
      return;
    }

    setNotifiedStudents((prev) => ({
      ...prev,
      [student.id]: today,
    }));

    Swal.fire(
      "Notification Sent",
      `A notification has been sent to the parent of ${student.studentName}.`,
      "info"
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavbarAdmin />
      <div className="flex flex-1">
        <SidebarAdmin />
        <main className="flex-1 p-3 sm:p-5 md:ml-30">
          {/* Header Section */}
          <div className="mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              Tuition Management
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Monitor and manage student tuition payments
            </p>
          </div>

          <div className="mt-4 sm:mt-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="p-2 sm:p-3 bg-blue-50 rounded-lg">
                    <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
                  </div>
                  <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                      Students with Debt
                    </p>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                      {totalStudents}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="p-2 sm:p-3 bg-green-50 rounded-lg">
                    <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
                  </div>
                  <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                      Outstanding Amount
                    </p>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                      ${totalOutstanding}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center">
                  <div className="p-2 sm:p-3 bg-yellow-50 rounded-lg">
                    <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />
                  </div>
                  <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                      Payment Due
                    </p>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                      Today
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filter Section */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6 sm:mb-8">
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search by student or class..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-sm sm:text-base"
                  />
                </div>
                {searchQuery && (
                  <div className="flex items-center justify-center sm:justify-start space-x-2 bg-blue-50 px-3 sm:px-4 py-2 rounded-lg">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                    <span className="text-blue-700 font-medium text-sm sm:text-base">
                      {filteredStudents.length} result
                      {filteredStudents.length !== 1 ? "s" : ""} found
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Tuition Content */}
            {loading ? (
              <div className="flex justify-center items-center h-40 sm:h-64">
                <Loading />
              </div>
            ) : (
              <>
                {/* Mobile Card View */}
                <div className="block lg:hidden">
                  <div className="space-y-4">
                    {currentStudents.length > 0 ? (
                      currentStudents.map((student) => (
                        <div
                          key={student.id}
                          className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"
                        >
                          {/* Student Header */}
                          <div className="flex items-start gap-3 mb-4">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <Users className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {student.studentName}
                              </div>
                              <div className="text-sm text-gray-500 truncate">
                                {student.parentName}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                {student.className}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium text-gray-900">
                                ${student.amountDue}
                              </div>
                              <div className="text-xs text-gray-500">
                                Due: {student.dueDate}
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col gap-2">
                            {student.paymentStatus === "Unpaid" ? (
                              <button
                                onClick={() => handlePayment(student.id)}
                                className="w-full px-3 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors duration-200"
                              >
                                Mark as Paid
                              </button>
                            ) : (
                              <div className="w-full px-3 py-2 bg-green-100 text-green-800 text-sm font-medium rounded-lg text-center">
                                Paid ✓
                              </div>
                            )}
                            <div className="flex gap-2">
                              <button
                                onClick={() => handlePrintInvoice(student)}
                                className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200"
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Invoice
                              </button>
                              <button
                                onClick={() => handleNotifyParent(student)}
                                disabled={student.paymentStatus === "Paid"}
                                className={`flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                  student.paymentStatus === "Paid"
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-red-100 text-red-700 hover:bg-red-200"
                                }`}
                              >
                                <Bell className="h-4 w-4 mr-1" />
                                Notify
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg mb-1">
                          No students found
                        </p>
                        <p className="text-gray-400 text-sm">
                          Try adjusting your search
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 xl:px-6 py-3 xl:py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider text-left">
                          Student
                        </th>
                        <th className="px-4 xl:px-6 py-3 xl:py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider text-left">
                          Class
                        </th>
                        <th className="px-4 xl:px-6 py-3 xl:py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider text-left">
                          Amount Due
                        </th>
                        <th className="px-4 xl:px-6 py-3 xl:py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider text-left">
                          Due Date
                        </th>
                        <th className="px-4 xl:px-6 py-3 xl:py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider text-left">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {currentStudents.length > 0 ? (
                        currentStudents.map((student) => (
                          <tr
                            key={student.id}
                            className="hover:bg-gray-50 transition-colors duration-200"
                          >
                            <td className="px-4 xl:px-6 py-3 xl:py-4">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-8 w-8 xl:h-10 xl:w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                  <Users className="h-4 w-4 xl:h-5 xl:w-5 text-blue-600" />
                                </div>
                                <div className="ml-3 xl:ml-4 min-w-0">
                                  <div className="text-sm font-medium text-gray-900 truncate">
                                    {student.studentName}
                                  </div>
                                  <div className="text-sm text-gray-500 truncate">
                                    {student.parentName}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 xl:px-6 py-3 xl:py-4 text-sm text-gray-600">
                              {student.className}
                            </td>
                            <td className="px-4 xl:px-6 py-3 xl:py-4">
                              <span className="text-sm font-medium text-gray-900">
                                ${student.amountDue}
                              </span>
                            </td>
                            <td className="px-4 xl:px-6 py-3 xl:py-4 text-sm text-gray-600">
                              {student.dueDate}
                            </td>
                            <td className="px-4 xl:px-6 py-3 xl:py-4">
                              <div className="flex items-center space-x-2">
                                {student.paymentStatus === "Unpaid" ? (
                                  <button
                                    onClick={() => handlePayment(student.id)}
                                    className="inline-flex items-center px-2 xl:px-3 py-1 xl:py-1.5 bg-blue-500 text-white text-xs xl:text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors duration-200"
                                  >
                                    Mark as Paid
                                  </button>
                                ) : (
                                  <span className="inline-flex items-center px-2 xl:px-3 py-1 xl:py-1.5 bg-green-100 text-green-800 text-xs xl:text-sm font-medium rounded-lg">
                                    Paid ✓
                                  </span>
                                )}
                                <button
                                  onClick={() => handlePrintInvoice(student)}
                                  className="inline-flex items-center px-2 xl:px-3 py-1 xl:py-1.5 bg-gray-100 text-gray-700 text-xs xl:text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200"
                                >
                                  <Download className="h-3 w-3 xl:h-4 xl:w-4 mr-1" />
                                  Invoice
                                </button>
                                <button
                                  onClick={() => handleNotifyParent(student)}
                                  disabled={student.paymentStatus === "Paid"}
                                  className={`inline-flex items-center px-2 xl:px-3 py-1 xl:py-1.5 text-xs xl:text-sm font-medium rounded-lg transition-colors duration-200 ${
                                    student.paymentStatus === "Paid"
                                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                      : "bg-red-100 text-red-700 hover:bg-red-200"
                                  }`}
                                >
                                  <Bell className="h-3 w-3 xl:h-4 xl:w-4 mr-1" />
                                  Notify
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-6 py-8 text-center">
                            <div className="flex flex-col items-center">
                              <Users className="h-12 w-12 text-gray-400 mb-4" />
                              <p className="text-gray-500 text-lg mb-1">
                                No students found
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
              </>
            )}

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 lg:p-6 bg-gray-50/50 backdrop-blur-sm border-t border-gray-200/50 gap-4">
              <div className="text-sm text-gray-600 font-medium order-2 sm:order-1">
                Showing {indexOfFirstStudent + 1} to{" "}
                {Math.min(indexOfLastStudent, filteredStudents.length)} of{" "}
                {filteredStudents.length} students
              </div>

              <div className="flex items-center gap-2 lg:gap-3 order-1 sm:order-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  Previous
                </button>
                <div className="flex items-center gap-1 max-w-xs overflow-x-auto">
                  {Array.from(
                    { length: Math.min(totalPages, 5) },
                    (_, index) => {
                      const page =
                        Math.max(1, Math.min(totalPages - 4, currentPage - 2)) +
                        index;
                      return page <= totalPages ? page : null;
                    }
                  )
                    .filter(Boolean)
                    .map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-2 sm:px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                          currentPage === page
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                </div>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TuitionAndPayment;
