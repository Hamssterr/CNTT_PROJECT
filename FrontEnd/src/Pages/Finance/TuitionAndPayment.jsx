import React, { useState, useEffect, useContext } from "react";
import Navbar from "../../Components/Academic-Finance/NavBar";
import Sidebar from "../../Components/Academic-Finance/SideBar";
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
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import Loading from "../../Components/Loading";

function TuitionAndPayment() {
  const { backendUrl } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
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
        // Lọc chỉ những mục có status là "Contacted"
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
  }, []);

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
        `${backendUrl}/api/consultant/updateLeadUser/${id}`,
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
    <div>
      <Navbar />
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Sidebar />
        <div className="flex-1 p-8 ml-25">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Tuition Management
            </h1>
            <p className="text-gray-600">
              Monitor and manage student tuition payments
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Students Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Students with Debt
                  </p>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {totalStudents}
                  </h3>
                </div>
              </div>
            </div>

            {/* Outstanding Amount Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-50 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Outstanding Amount
                  </p>
                  <h3 className="text-2xl font-bold text-gray-800">
                    ${totalOutstanding}
                  </h3>
                </div>
              </div>
            </div>

            {/* Alert Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-yellow-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Payment Due
                  </p>
                  <h3 className="text-2xl font-bold text-gray-800">Today</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-96">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search by student or class..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                />
              </div>

              {searchQuery && (
                <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span className="text-blue-700 font-medium">
                    {filteredStudents.length} result
                    {filteredStudents.length !== 1 ? "s" : ""} found
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Tuition Table */}
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
                      Class
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider text-left">
                      Amount Due
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider text-left">
                      Due Date
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider text-left">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <tr
                        key={student.id}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <Users className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {student.studentName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {student.parentName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {student.className}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-gray-900">
                            ${student.amountDue}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {student.dueDate}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            {student.paymentStatus === "Unpaid" ? (
                              <button
                                onClick={() => handlePayment(student.id)}
                                className="inline-flex items-center px-3 py-1.5 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors duration-200"
                              >
                                Mark as Paid
                              </button>
                            ) : (
                              <span className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-800 text-sm font-medium rounded-lg">
                                Paid ✓
                              </span>
                            )}
                            <button
                              onClick={() => handlePrintInvoice(student)}
                              className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200"
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Invoice
                            </button>
                            <button
                              onClick={() => handleNotifyParent(student)}
                              disabled={student.paymentStatus === "Paid"}
                              className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                student.paymentStatus === "Paid"
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                  : "bg-red-100 text-red-700 hover:bg-red-200"
                              }`}
                            >
                              <Bell className="h-4 w-4 mr-1" />
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
          )}
        </div>
      </div>
    </div>
  );
}

export default TuitionAndPayment;
