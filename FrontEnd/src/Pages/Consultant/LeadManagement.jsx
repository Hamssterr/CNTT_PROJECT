import React, { useState, useEffect } from "react";
import Navbar from "../../Components/Consultant/Navbar";
import Sidebar from "../../Components/Consultant/Sidebar";
import Footer from "../../Components/Footer";
import {
  Search,
  Phone,
  Mail,
  Clock,
  CircleCheck,
  UserX,
  X,
  Plus,
  Filter,
  RefreshCcw,
  Download,
  GraduationCap,
  BookOpen,
  Check,
  Tag,
  Lock,
  Info,
  CheckCircle,
  AlertTriangle,
  Users,
} from "lucide-react";
import "../../public/ModalStyle.css";
import axios from "axios";
import Modal from "react-modal";
import Swal from "sweetalert2";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import Loading from "../../Components/Loading";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

Modal.setAppElement("#root");

const customModalStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    backdropFilter: "blur(5px)",
    zIndex: 1000,
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    padding: 0,
    border: "none",
    borderRadius: "0.75rem",
    backgroundColor: "transparent",
    maxWidth: "600px",
    width: "90%",
    maxHeight: "85vh", // Giới hạn chiều cao tối đa
    transition: "all 200ms ease-in-out",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    overflow: "hidden", // Ẩn overflow của modal
  },
};

const LeadManagement = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [addNew, setAddNew] = useState(false);
  const [leadsData, setLeadsData] = useState([]);
  const { leads, setLeads, backendUrl } = useContext(AppContext);
  const [courses, setCourses] = useState([]); // State to store courses

  // Fetch courses data
  const fetchCourses = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/course/getAllCourse`);
      if (data.success) {
        setCourses(data.courses);
      } else {
        Swal.fire("Error", data.message || "Failed to fetch courses.", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Failed to fetch courses.", "error");
    }
  };

  // Fetch leads data
  const fetchLeads = async () => {
    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate loading delay
      const response = await axios.get(
        `${backendUrl}/api/consultant/getLeadUsers`
      );
      if (response.data.success) {
        setLeadsData(response.data.leadUsers);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch leads data",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchCourses();
  }, []);

  const handleAdd = () => {
    setSelectedLead({
      name: "",
      studentName: "",
      phone: "",
      email: "",
      course: [],
      registrationDate: new Date().toISOString().split("T")[0],
      status: "Pending",
      paymentStatus: "Unpaid",
      isDiscount: false, // Thêm trường isDiscount
    });
    setAddNew(true);
    setShowModal(true);
  };

  const handleEdit = (lead) => {
    setSelectedLead({
      ...lead,
      // Convert course to array if it's not already
      course: Array.isArray(lead.course) ? lead.course : [lead.course],
      registrationDate: new Date(lead.registrationDate)
        .toISOString()
        .split("T")[0],
    });
    setAddNew(false);
    setShowModal(true);
  };

  const handleSave = async () => {
    // Kiểm tra trùng số điện thoại hoặc email
    const isDuplicate = leadsData.some(
      (lead) =>
        (lead.phone === selectedLead.phone ||
          lead.email === selectedLead.email) &&
        lead.course === selectedLead.course &&
        (addNew || lead._id !== selectedLead._id)
    );
    if (isDuplicate) {
      Swal.fire({
        icon: "warning",
        title: "Duplicate Entry",
        text: "Phone number or email already exists!",
      });
      return;
    }

    try {
      if (addNew) {
        const response = await axios.post(
          `${backendUrl}/api/consultant/addNewLeadUser`,
          selectedLead
        );
        if (response.data.success) {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Lead added successfully",
          });
          fetchLeads();
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: response.data.message || "Failed to add lead",
          });
        }
      } else {
        const response = await axios.put(
          `${backendUrl}/api/consultant/updateLeadUser/${selectedLead._id}`,
          selectedLead
        );
        if (response.data.success) {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Lead updated successfully",
          });
          fetchLeads();
        }
      }
      handleClose();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Operation failed",
      });
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedLead(null);
  };

  const handleDelete = async (lead) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(
          `${backendUrl}/api/consultant/deleteLeadUser/${lead._id}`
        );
        if (response.data.success) {
          // Update local state immediately
          const updatedLeads = leadsData.filter((l) => l._id !== lead._id);
          setLeadsData(updatedLeads); // Update leadsData state
          setLeads(updatedLeads); // Update AppContext leads state

          Swal.fire("Deleted!", "Lead has been deleted.", "success");
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to delete lead",
        });
      }
    }
  };

  const filteredLeads = leadsData.filter((lead) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      lead.name.toLowerCase().includes(searchTerm) ||
      lead.studentName.toLowerCase().includes(searchTerm) ||
      lead.email.toLowerCase().includes(searchTerm) ||
      lead.phone.toLowerCase().includes(searchTerm) ||
      lead.course.toLowerCase().includes(searchTerm) ||
      lead.status.toLowerCase().includes(searchTerm)
    );
  });

  // Thêm function kiểm tra email student
  const validateDiscountEmail = async (email) => {
    try {
      if (!email) return false;
      const response = await axios.get(
        `${backendUrl}/api/admin/validateStudentEmail/${email}`
      );
      return response.data.success;
    } catch (error) {
      console.error("Error validating student email:", error);
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
      <div className="flex">
        <div className="fixed top-[70px] left-0 bottom-0 z-40 w-[280px]">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 md:ml-25">
          {/* Elegant Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white mt-[70px] ml-[5px]">
            <div className="px-4 sm:px-8 py-4 sm:py-6 ">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6 ">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold">
                    Lead Management
                  </h1>
                  <p className="mt-1 text-sm sm:text-base text-blue-100">
                    {filteredLeads.length} total leads • {courses.length}{" "}
                    courses available
                  </p>
                </div>
                <div className="flex w-full sm:w-auto items-center gap-2 sm:gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => fetchLeads()}
                    className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                    title="Refresh"
                  >
                    <RefreshCcw size={20} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="hidden sm:block p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                    title="Export"
                  >
                    <Download size={20} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAdd}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all text-sm sm:text-base"
                  >
                    <Plus size={20} />
                    <span className="hidden sm:inline">Add New Lead</span>
                    <span className="sm:hidden">Add</span>
                  </motion.button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
                <div className="w-full relative">
                  <input
                    type="text"
                    placeholder="Search by name, email, phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-2.5 sm:py-3 bg-white/10 text-white placeholder-blue-100 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 transition-all text-sm sm:text-base"
                  />
                  <Search
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-100"
                    size={20}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-4 sm:p-8">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loading />
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden"
              >
                {/* Desktop Table */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50/50">
                        {[
                          "Name",
                          "Student",
                          "Contact",
                          "Course",
                          "Registration",
                          "Status",
                          "Actions",
                        ].map((header) => (
                          <th
                            key={header}
                            className="px-6 py-4 text-left text-sm font-semibold text-gray-600"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLeads.map((lead, index) => (
                        <motion.tr
                          key={lead._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`border-t border-gray-100 hover:bg-blue-50/30 transition-all ${
                            index % 2 === 0 ? "bg-gray-50/30" : ""
                          }`}
                        >
                          {/* Name Column */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold shadow-lg">
                                {lead.name.charAt(0)}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">
                                  {lead.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {lead.email}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Student Column */}
                          <td className="px-6 py-4">
                            <span className="font-medium text-gray-700">
                              {lead.studentName}
                            </span>
                          </td>

                          {/* Contact Column */}
                          <td className="px-6 py-4">
                            <div className="space-y-4">
                              {/* Parent Contact */}
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                                  <Users size={14} className="text-blue-500" />
                                  Parent Contact
                                </div>
                                <div className="pl-6 space-y-1">
                                  <div className="flex items-center gap-2 text-gray-600">
                                    <Phone
                                      size={16}
                                      className="text-blue-500"
                                    />
                                    {lead.phone}
                                  </div>
                                  <div className="flex items-center gap-2 text-gray-600">
                                    <Mail size={16} className="text-blue-500" />
                                    {lead.email}
                                  </div>
                                </div>
                              </div>

                              {/* Student Contact - Only show if either exists */}
                              {(lead.studentPhone || lead.studentEmail) && (
                                <div className="space-y-1.5 pt-2 border-t border-gray-100">
                                  <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                                    <GraduationCap
                                      size={14}
                                      className="text-purple-500"
                                    />
                                    Student Contact
                                  </div>
                                  <div className="pl-6 space-y-1">
                                    {lead.studentPhone && (
                                      <div className="flex items-center gap-2 text-gray-600">
                                        <Phone
                                          size={16}
                                          className="text-purple-500"
                                        />
                                        {lead.studentPhone}
                                      </div>
                                    )}
                                    {lead.studentEmail && (
                                      <div className="flex items-center gap-2 text-gray-600">
                                        <Mail
                                          size={16}
                                          className="text-purple-500"
                                        />
                                        {lead.studentEmail}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Course Column */}
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-2">
                              <div className="flex flex-wrap gap-1">
                                {Array.isArray(lead.course)
                                  ? lead.course.map((c, idx) => (
                                      <span
                                        key={idx}
                                        className="inline-block bg-blue-100 text-blue-800 rounded-full px-2 py-1 text-xs font-medium"
                                      >
                                        {c}
                                      </span>
                                    ))
                                  : lead.course}
                              </div>
                              {lead.isDiscount && (
                                <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                  <svg
                                    className="w-3 h-3"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  Discounted
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Registration Date Column */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Clock size={16} className="text-gray-400" />
                              <span className="text-gray-600">
                                {new Date(
                                  lead.registrationDate
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </td>

                          {/* Status Column */}
                          <td className="px-6 py-4">
                            <StatusBadge status={lead.status} />
                          </td>

                          {/* Actions Column */}
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <ActionButton
                                icon="edit"
                                onClick={() => handleEdit(lead)}
                                className="text-blue-600 hover:bg-blue-50"
                              />
                              <ActionButton
                                icon="delete"
                                onClick={() => handleDelete(lead)}
                                className="text-red-600 hover:bg-red-50"
                              />
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Mobile Card View */}
                <div className="sm:hidden space-y-4 p-2">
                  {filteredLeads.map((lead, index) => (
                    <motion.div
                      key={lead._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white rounded-lg shadow p-4 border border-gray-100"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                          {lead.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {lead.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {lead.studentName}
                          </div>
                        </div>
                        <StatusBadge status={lead.status} className="ml-auto" />
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone size={16} className="text-blue-500" />
                          {lead.phone}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail size={16} className="text-blue-500" />
                          {lead.email}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <BookOpen size={16} className="text-blue-500" />
                          <div className="flex flex-col gap-1">
                            <div className="flex flex-wrap gap-1">
                              {Array.isArray(lead.course)
                                ? lead.course.map((c, idx) => (
                                    <span
                                      key={idx}
                                      className="inline-block bg-blue-100 text-blue-800 rounded-full px-2 py-1 text-xs font-medium"
                                    >
                                      {c}
                                    </span>
                                  ))
                                : lead.course}
                            </div>
                            {lead.isDiscount && (
                              <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full w-fit">
                                <svg
                                  className="w-3 h-3"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Discounted
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock size={16} className="text-gray-400" />
                          {new Date(lead.registrationDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="mt-3 flex justify-end gap-2">
                        <ActionButton
                          icon="edit"
                          onClick={() => handleEdit(lead)}
                          className="text-blue-600 hover:bg-blue-50"
                        />
                        <ActionButton
                          icon="delete"
                          onClick={() => handleDelete(lead)}
                          className="text-red-600 hover:bg-red-50"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Modal Component */}
      <Modal
        isOpen={showModal}
        onRequestClose={handleClose}
        style={customModalStyles}
        contentLabel="Lead Form"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl overflow-hidden shadow-xl flex flex-col h-full max-h-[85vh]" // Thêm flex và max-height
        >
          {/* Header - giữ cố định */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-6 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {addNew ? "Add New Lead" : "Edit Lead"}
                </h2>
                <p className="mt-1 text-blue-100 text-sm">
                  {addNew
                    ? "Create a new lead entry"
                    : "Modify existing lead information"}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
                className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all"
              >
                <X size={20} />
              </motion.button>
            </div>
          </div>

          {/* Form Content - cho phép scroll */}
          <div className="flex-1 overflow-y-auto px-8 py-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {selectedLead && (
                <>
                  {/* Personal Information Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 pb-2 border-b border-gray-200">
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            value={selectedLead.name}
                            onChange={(e) =>
                              setSelectedLead({
                                ...selectedLead,
                                name: e.target.value,
                              })
                            }
                            placeholder="Enter name"
                          />
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg
                              className="w-5 h-5 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Student's Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            value={selectedLead.studentName}
                            onChange={(e) =>
                              setSelectedLead({
                                ...selectedLead,
                                studentName: e.target.value,
                              })
                            }
                            placeholder="Enter student's name"
                          />
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <GraduationCap className="w-5 h-5 text-gray-400" />
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Contact Information Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 pb-2 border-b border-gray-200">
                      Contact Information
                    </h3>

                    {/* Parent Contact */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        Parent Contact
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            Phone <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="tel"
                              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                              value={selectedLead.phone}
                              onChange={(e) =>
                                setSelectedLead({
                                  ...selectedLead,
                                  phone: e.target.value,
                                })
                              }
                              placeholder="Enter parent's phone number"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Phone className="w-5 h-5 text-gray-400" />
                            </div>
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            Email <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="email"
                              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                              value={selectedLead.email}
                              onChange={(e) =>
                                setSelectedLead({
                                  ...selectedLead,
                                  email: e.target.value,
                                })
                              }
                              placeholder="Enter parent's email"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Mail className="w-5 h-5 text-gray-400" />
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </div>

                    {/* Student Contact */}
                    <div className="space-y-4 pt-4">
                      <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-gray-500" />
                        Student Contact (Optional)
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            Student Phone
                          </label>
                          <div className="relative">
                            <input
                              type="tel"
                              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                              value={selectedLead.studentPhone || ""}
                              onChange={(e) =>
                                setSelectedLead({
                                  ...selectedLead,
                                  studentPhone: e.target.value,
                                })
                              }
                              placeholder="Enter student's phone number (optional)"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Phone className="w-5 h-5 text-gray-400" />
                            </div>
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 }}
                        >
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            Student Email
                          </label>
                          <div className="relative">
                            <input
                              type="email"
                              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                              value={selectedLead.studentEmail || ""}
                              onChange={(e) =>
                                setSelectedLead({
                                  ...selectedLead,
                                  studentEmail: e.target.value,
                                })
                              }
                              placeholder="Enter student's email (optional)"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Mail className="w-5 h-5 text-gray-400" />
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  {/* Course and Status Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 pb-2 border-b border-gray-200">
                      Course & Status
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Course <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <CourseSelection
                            selectedCourses={selectedLead.course}
                            courses={courses}
                            onChange={(newCourses) =>
                              setSelectedLead({
                                ...selectedLead,
                                course: newCourses,
                              })
                            }
                            disabled={!addNew}
                          />
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Status
                        </label>
                        <div className="relative">
                          <select
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none"
                            value={selectedLead.status}
                            onChange={(e) =>
                              setSelectedLead({
                                ...selectedLead,
                                status: e.target.value,
                              })
                            }
                          >
                            <option value="Pending">Pending</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Not Responding">
                              Not Responding
                            </option>
                          </select>
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Clock className="w-5 h-5 text-gray-400" />
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Discount Email field */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800 pb-2 border-b border-gray-200">
                        Discount Information
                      </h3>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 }}
                      >
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Previous Student Email
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            value={selectedLead.discountEmail || ""}
                            onChange={async (e) => {
                              const email = e.target.value;
                              const isValidStudent =
                                await validateDiscountEmail(email);

                              setSelectedLead({
                                ...selectedLead,
                                discountEmail: email,
                                isDiscount: isValidStudent,
                              });
                            }}
                            placeholder="Enter previous student's email for discount"
                          />
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Tag className="w-5 h-5 text-gray-400" />
                          </div>
                        </div>
                        <p className="mt-1.5 text-xs text-gray-500 flex items-center gap-1.5">
                          <Info className="w-4 h-4" />
                          Enter the email of a registered student to apply
                          family discount
                        </p>
                        {selectedLead.discountEmail &&
                          selectedLead.isDiscount && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-3 flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg"
                            >
                              <CheckCircle className="w-5 h-5" />
                              <span>
                                Student verified - Discount will be applied
                              </span>
                            </motion.div>
                          )}
                        {selectedLead.discountEmail &&
                          !selectedLead.isDiscount && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-3 flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg"
                            >
                              <AlertTriangle className="w-5 h-5" />
                              <span>
                                Invalid student email - Discount cannot be
                                applied
                              </span>
                            </motion.div>
                          )}
                      </motion.div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>

          {/* Footer Actions */}
          <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 flex-shrink-0">
            <div className="flex justify-end gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
              >
                {addNew ? "Add Lead" : "Save Changes"}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </Modal>
    </div>
  );
};

// Helper Components
const StatusBadge = ({ status }) => {
  const statusConfig = {
    Contacted: {
      bg: "bg-green-100",
      text: "text-green-700",
      icon: CircleCheck,
    },
    "Not Responding": {
      bg: "bg-red-100",
      text: "text-red-700",
      icon: UserX,
    },
    Pending: {
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      icon: Clock,
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${config.bg} ${config.text}`}
    >
      <Icon size={16} />
      {status}
    </span>
  );
};

const ActionButton = ({ icon, onClick, className }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`p-2 rounded-lg transition-all ${className}`}
    >
      {icon === "edit" ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
      )}
    </motion.button>
  );
};

// Thêm component CourseSelection
const CourseSelection = ({
  selectedCourses = [],
  courses,
  onChange,
  disabled,
}) => {
  // Ensure selectedCourses is always an array
  const coursesArray = Array.isArray(selectedCourses) ? selectedCourses : [];

  return (
    <div className="space-y-3">
      {/* Selected Courses Tags */}
      <div className="flex flex-wrap gap-2 min-h-[40px]">
        {coursesArray.map((course, index) => (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            key={index}
            className="group flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full border border-blue-100"
          >
            <Tag className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-sm font-medium text-blue-700">{course}</span>
            {!disabled && (
              <button
                type="button"
                onClick={() => {
                  const newCourses = coursesArray.filter((_, i) => i !== index);
                  onChange(newCourses);
                }}
                className="ml-1 p-1 rounded-full hover:bg-blue-100 transition-colors"
              >
                <X className="w-3 h-3 text-blue-500" />
              </button>
            )}
          </motion.div>
        ))}
      </div>

      {/* Course Selection Box */}
      {!disabled && (
        <div className="relative">
          <div className="relative">
            <select
              multiple
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:border-blue-300"
              value={selectedCourses || []}
              onChange={(e) => {
                const selectedOptions = Array.from(
                  e.target.selectedOptions,
                  (option) => option.value
                );
                onChange(selectedOptions);
              }}
              size={Math.min(4, courses.length)}
            >
              {courses.map((course) => (
                <option
                  key={course._id}
                  value={course.title}
                  className={`py-2.5 px-4 cursor-pointer hover:bg-blue-50 flex items-center gap-2 ${
                    selectedCourses?.includes(course.title)
                      ? "bg-blue-50 text-blue-700"
                      : ""
                  }`}
                >
                  {course.title}
                  {selectedCourses?.includes(course.title) && " (Selected)"}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <BookOpen className="w-5 h-5 text-blue-500" />
            </div>
          </div>

          {/* Helper text */}
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              Hold{" "}
              <kbd className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                Ctrl
              </kbd>{" "}
              (Windows) or
              <kbd className="px-2 py-0.5 bg-gray-100 rounded text-xs ml-1">
                ⌘
              </kbd>{" "}
              (Mac) to select multiple courses
            </span>
          </div>
        </div>
      )}

      {/* Read-only message */}
      {disabled && (
        <p className="text-sm text-gray-500 flex items-center gap-2">
          <Lock className="w-4 h-4" />
          Course selection is disabled for existing leads
        </p>
      )}
    </div>
  );
};

export default LeadManagement;
