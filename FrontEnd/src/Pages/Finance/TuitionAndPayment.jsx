import React, { useState, useEffect, useContext } from "react";
import Navbar from "../../Components/Academic-Finance/NavBar";
import Sidebar from "../../Components/Academic-Finance/SideBar";
import { Search } from "lucide-react";
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
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-8 ml-25">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
            Tuition Management
          </h1>

          {/* Summary Cards */}
          <div className="flex flex-col md:flex-row justify-around items-center gap-4 mb-6">
            <div className="bg-white shadow rounded-lg p-4 w-full md:w-1/3 text-center">
              <p className="text-gray-600">Total Students with Debt</p>
              <p className="text-2xl font-bold text-gray-800">
                {totalStudents}
              </p>
            </div>
            <div className="bg-white shadow rounded-lg p-4 w-full md:w-1/3 text-center">
              <p className="text-gray-600">Total Outstanding Amount</p>
              <p className="text-2xl font-bold text-gray-800">
                ${totalOutstanding}
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex justify-center mb-6">
            <div className="relative w-full md:w-64">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={20} className="text-gray-400" />
              </span>
              <input
                type="text"
                placeholder="Search by student or class..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Tuition Table */}
          {loading ? (
            <div className="flex justify-center items-center h-64 bg-gray-100/50">
              <Loading />
            </div>
          ) : (
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 text-center">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student Name
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Class
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount Due
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.studentName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {student.className}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          ${student.amountDue}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {student.dueDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {student.paymentStatus === "Unpaid" ? (
                            <button
                              onClick={() => handlePayment(student.id)}
                              className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm transition duration-150 ease-in-out"
                            >
                              Paid
                            </button>
                          ) : (
                            <span className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm inline-block">
                              Paid ✓
                            </span>
                          )}
                          <button
                            onClick={() => handlePrintInvoice(student)}
                            className="ml-2 px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm"
                          >
                            Invoice
                          </button>
                          <button
                            onClick={() => handleNotifyParent(student)}
                            disabled={student.paymentStatus === "Paid"}
                            className={`ml-2 px-3 py-1 rounded-lg text-sm ${
                              student.paymentStatus === "Paid"
                                ? "bg-gray-400 cursor-not-allowed opacity-50"
                                : "bg-red-500 hover:bg-red-600 text-white"
                            }`}
                          >
                            Notify Parent
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No students with outstanding tuition.
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
