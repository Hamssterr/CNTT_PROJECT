import React, { useState, useEffect, useContext } from "react";
import NavbarAdmin from "../../Components/Admin/Navbar";
import SidebarAdmin from "../../Components/Admin/Sidebar";
import {
  Search,
  DollarSign,
  Users,
  AlertCircle,
  Download,
  Bell,
  Check,
} from "lucide-react";
import Swal from "sweetalert2";
import { jsPDF } from "jspdf";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import Loading from "../../Components/Loading";
import { motion } from "framer-motion";

function TuitionAndPayment() {
  const { backendUrl } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch students with status "Contacted" from backend
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
            courses: Array.isArray(lead.course) ? lead.course : [lead.course], // Đảm bảo courses là array
            paymentStatus: lead.paymentStatus,
            isDiscount: lead.isDiscount,
            discountEmail: lead.discountEmail,
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
      const coursesDetails = student.courses.map((courseName) => {
        const course = courses.find((c) => c.title === courseName);
        const originalPrice = course ? course.price : 0;
        // Apply 10% discount if isDiscount is true
        const discountedPrice = student.isDiscount
          ? originalPrice * 0.9
          : originalPrice;

        return {
          name: courseName,
          originalPrice,
          price: discountedPrice,
          hasDiscount: student.isDiscount,
        };
      });

      // Calculate total amounts
      const totalOriginalAmount = coursesDetails.reduce(
        (sum, course) => sum + course.originalPrice,
        0
      );

      const totalDiscountedAmount = coursesDetails.reduce(
        (sum, course) => sum + course.price,
        0
      );

      return {
        ...student,
        coursesDetails,
        originalAmount: totalOriginalAmount,
        amountDue: totalDiscountedAmount,
        dueDate: "2025-12-31",
      };
    })
    .filter(
      (student) =>
        student.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.courses.some((course) =>
          course.toLowerCase().includes(searchQuery.toLowerCase())
        )
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
          course: currentStudent.courses, // Gửi mảng courses
          registrationDate: new Date(),
          status: "Contacted",
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
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Định nghĩa màu sắc và font chữ
    const colors = {
      primary: "#2563EB", // Blue-600
      secondary: "#1E40AF", // Blue-800
      accent: "#60A5FA", // Blue-400
      text: "#1F2937", // Gray-800
      lightGray: "#F3F4F6", // Gray-100
    };

    // Thêm logo và header
    doc.setFillColor(colors.primary);
    doc.rect(0, 0, 210, 45, "F");

    // Header text
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("TP Education", 105, 30, { align: "center" });
    doc.setFontSize(10);
    doc.text("For all students in the world", 105, 38, { align: "center" });

    // Invoice details box
    doc.setFillColor(colors.lightGray);
    doc.roundedRect(15, 55, 180, 40, 3, 3, "F");

    doc.setTextColor(colors.text);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");

    // Left column
    doc.text("INVOICE TO:", 25, 65);
    doc.setFont("helvetica", "normal");
    doc.text(`Student name: ${student.studentName}`, 25, 73);
    doc.text(`Parent name: ${student.parentName}`, 25, 81);
    doc.text(`ID: ${student.id}`, 25, 89);

    // Right column
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE DETAILS:", 120, 65);
    doc.setFont("helvetica", "normal");
    doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, 120, 73);
    doc.text(`Due Date: ${student.dueDate}`, 120, 81);
    doc.text(`Invoice: INV-${Date.now().toString().slice(-6)}`, 120, 89);

    // Course details
    doc.setFillColor(colors.primary);
    doc.setTextColor(255, 255, 255);
    doc.rect(15, 105, 180, 10, "F");
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("COURSE DETAILS", 20, 112);

    // Table headers
    const tableHeaders = ["Description", "Duration", "Amount"];
    const headerPositions = [20, 120, 160];

    doc.setFillColor(colors.lightGray);
    doc.rect(15, 115, 180, 10, "F");
    doc.setTextColor(colors.text);
    doc.setFontSize(10);
    tableHeaders.forEach((header, i) => {
      doc.text(header, headerPositions[i], 122);
    });

    // Table content
    let yPosition = 130; // Starting y position for course details
    doc.setFont("helvetica", "normal");

    // Draw each course detail
    student.coursesDetails.forEach((course, index) => {
      doc.text(course.name, 20, yPosition);
      doc.text("3 months", 120, yPosition);
      doc.text(`$${course.price}`, 160, yPosition);
      yPosition += 10; // Increase y position for next course
    });

    // Total amount - Update position based on courses
    doc.setFillColor(colors.lightGray);
    doc.rect(15, yPosition + 10, 180, 25, "F");
    doc.setFont("helvetica", "bold");
    doc.text("Total Amount:", 120, yPosition + 25);
    doc.setTextColor(colors.secondary);
    doc.setFontSize(14);
    doc.text(`$${student.amountDue}`, 160, yPosition + 25);

    // Payment information - Update position
    let bankDetailsY = yPosition + 55;

    doc.setTextColor(colors.text);
    doc.setFontSize(11);
    doc.text("PAYMENT INFORMATION", 20, bankDetailsY);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const bankDetails = [
      "Bank Name: Education Bank",
      "Account Name: TP Education Center",
      "Account Number: 1234-5678-9012-3456",
      "Swift Code: EDBNK123",
      `Payment Reference: INV_${student.id}`,
    ];

    bankDetails.forEach((detail, index) => {
      doc.text(detail, 20, bankDetailsY + 10 + index * 7);
    });

    // Footer
    doc.setFillColor(colors.primary);
    doc.rect(0, 267, 210, 30, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Thank you for choosing TP Education Center", 105, 278, {
      align: "center",
    });

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(
      "123 Learning Street, Education City | Phone: +1-123-456-7890",
      105,
      285,
      { align: "center" }
    );
    doc.text("Email: contact@educenter.com | www.educenter.com", 105, 291, {
      align: "center",
    });

    // Watermark if paid
    if (student.paymentStatus === "Paid") {
      doc.setGState(new doc.GState({ opacity: 0.3 }));
      doc.setTextColor(0, 150, 0);
      doc.setFontSize(72);
      doc.setFont("helvetica", "bold");
      doc.text("PAID", 105, yPosition + 40, {
        align: "center",
        angle: 45,
      });
    }

    // Save PDF
    doc.save(`Invoice_${student.studentName}_${student.id}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 mt-[70px]">
      <div className="fixed top-0 left-0 right-0 z-50">
        <NavbarAdmin />
      </div>
      <div className="flex flex-col md:flex-row min-h-screen">
        <div className="fixed top-[70px] left-0 bottom-0 z-40 w-[280px]">
          <SidebarAdmin />
        </div>
        <div className="flex-1 p-4 md:p-8 md:ml-25">
          {/* Enhanced Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 md:mb-8"
          >
            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
              Tuition Management
            </h1>
            <p className="text-gray-600">
              Monitor and manage student tuition payments
            </p>
          </motion.div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            {/* Students Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 md:p-6 border border-gray-100"
            >
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
            </motion.div>

            {/* Outstanding Amount Card */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 md:p-6 border border-gray-100"
            >
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
            </motion.div>

            {/* Due Date Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 md:p-6 border border-gray-100"
            >
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
            </motion.div>
          </div>

          {/* Enhanced Search Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-6 md:mb-8 border border-gray-100"
          >
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
                    {filteredStudents.length} result
                    {filteredStudents.length !== 1 ? "s" : ""} found
                  </span>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Content Section */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loading />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
            >
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider text-left">
                        Student
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider text-left">
                        Course
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
                            <div className="flex flex-col gap-1">
                              {student.coursesDetails.map((course, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between"
                                >
                                  <span className="inline-flex items-center px-2.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                    {course.name}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    {course.hasDiscount && (
                                      <span className="text-gray-400 text-xs line-through">
                                        ${course.originalPrice}
                                      </span>
                                    )}
                                    <span
                                      className={`text-xs ${
                                        course.hasDiscount
                                          ? "text-green-600 font-medium"
                                          : "text-gray-500"
                                      }`}
                                    >
                                      ${course.price}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col px-7">
                              <span
                                className={`text-sm font-medium ${
                                  student.isDiscount
                                    ? "text-green-600"
                                    : "text-gray-900"
                                }`}
                              >
                                ${student.amountDue}
                              </span>
                            </div>
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

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4 p-4">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student, index) => (
                    <motion.div
                      key={student.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-4 border border-gray-100"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {student.studentName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {student.parentName}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 border-t border-gray-100 pt-3">
                        <div className="flex flex-col gap-2">
                          <span className="text-sm text-gray-600">
                            Courses:
                          </span>
                          {student.coursesDetails.map((course, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between items-center bg-gray-50 p-2 rounded-lg"
                            >
                              <span className="inline-flex items-center px-2.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                {course.name}
                              </span>
                              <span className="font-medium text-gray-900">
                                ${course.price}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                          <span className="text-sm font-semibold text-gray-600">
                            Total Amount:
                          </span>
                          <span className="font-bold text-gray-900">
                            ${student.amountDue}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                        {student.paymentStatus === "Unpaid" ? (
                          <button
                            onClick={() => handlePayment(student.id)}
                            className="flex-1 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center"
                          >
                            Mark as Paid
                          </button>
                        ) : (
                          <span className="flex-1 flex items-center justify-center px-4 py-2 bg-green-100 text-green-800 text-sm font-medium rounded-lg">
                            Paid ✓
                          </span>
                        )}
                        <button
                          onClick={() => handlePrintInvoice(student)}
                          className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                          <Download className="h-4 w-4" />
                          Invoice
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 text-lg mb-1">
                      No students found
                    </p>
                    <p className="text-gray-400 text-sm">
                      Try adjusting your search
                    </p>
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

export default TuitionAndPayment;
