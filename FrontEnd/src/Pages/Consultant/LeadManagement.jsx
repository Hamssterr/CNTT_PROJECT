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
  BookOpen
} from "lucide-react";
import "../../public/ModalStyle.css";
import axios from "axios";
import Modal from "react-modal";
import Swal from "sweetalert2";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import Loading from "../../Components/Loading";
import { motion } from "framer-motion";

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
    borderRadius: "0.5rem",
    backgroundColor: "transparent",
    maxWidth: "600px",
    width: "90%",
    transition: "all 200ms ease-in-out",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
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
      course: "",
      registrationDate: new Date().toISOString().split("T")[0],
      status: "Pending",
      paymentStatus: "Unpaid",
    });
    setAddNew(true);
    setShowModal(true);
  };

  const handleEdit = (lead) => {
    setSelectedLead({
      ...lead,
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
        (addNew || lead._id !== selectedLead._id) // Cho phép cập nhật chính mình
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

  const renderModalBody = () => (
    <div className="px-6 py-4">
      {selectedLead && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Name *
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedLead.name}
              onChange={(e) =>
                setSelectedLead({
                  ...selectedLead,
                  name: e.target.value,
                })
              }
              placeholder="Enter name"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Student's Name *
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedLead.studentName}
              onChange={(e) =>
                setSelectedLead({
                  ...selectedLead,
                  studentName: e.target.value,
                })
              }
              placeholder="Enter student's name"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Phone *
            </label>
            <input
              type="tel"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedLead.phone}
              onChange={(e) =>
                setSelectedLead({
                  ...selectedLead,
                  phone: e.target.value,
                })
              }
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Email *
            </label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedLead.email}
              onChange={(e) =>
                setSelectedLead({
                  ...selectedLead,
                  email: e.target.value,
                })
              }
              placeholder="Enter email"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Course *
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedLead.course}
              onChange={(e) =>
                setSelectedLead({
                  ...selectedLead,
                  course: e.target.value,
                })
              }
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.title}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Status
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <option value="Not Responding">Not Responding</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 ml-25">
          {/* Elegant Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
            <div className="px-8 py-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold">Lead Management</h1>
                  <p className="mt-1 text-blue-100">
                    {filteredLeads.length} total leads • {courses.length}{" "}
                    courses available
                  </p>
                </div>
                <div className="flex items-center gap-3">
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
                    className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                    title="Export"
                  >
                    <Download size={20} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all"
                  >
                    <Plus size={20} />
                    Add New Lead
                  </motion.button>
                </div>
              </div>

              {/* Enhanced Search Bar */}
              <div className="flex gap-4 items-center">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search by name, email, phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 text-white placeholder-blue-100 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                  />
                  <Search
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-100"
                    size={20}
                  />
                </div>
                <div className="flex gap-2">
                  {["All", "Contacted", "Pending", "Not Responding"].map(
                    (status) => (
                      <motion.button
                        key={status}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 text-sm font-medium text-blue-100 bg-white/10 rounded-lg hover:bg-white/20 transition-all"
                      >
                        {status}
                      </motion.button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-8">
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
                <div className="overflow-x-auto">
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
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-gray-600">
                                <Phone size={16} className="text-blue-500" />
                                {lead.phone}
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <Mail size={16} className="text-blue-500" />
                                {lead.email}
                              </div>
                            </div>
                          </td>

                          {/* Course Column */}
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm bg-blue-100 text-blue-800 font-medium">
                              {lead.course}
                            </span>
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
          className="bg-white rounded-2xl overflow-hidden shadow-xl"
        >
          {/* Header with Gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-6">
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

          {/* Form Content */}
          <div className="p-8">
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
                            placeholder="Enter phone number"
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
                            placeholder="Enter email"
                          />
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="w-5 h-5 text-gray-400" />
                          </div>
                        </div>
                      </motion.div>
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
                          <select
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none"
                            value={selectedLead.course}
                            onChange={(e) =>
                              setSelectedLead({
                                ...selectedLead,
                                course: e.target.value,
                              })
                            }
                          >
                            <option value="">Select a course</option>
                            {courses.map((course) => (
                              <option key={course.id} value={course.title}>
                                {course.title}
                              </option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <BookOpen className="w-5 h-5 text-gray-400" />
                          </div>
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
                  </div>
                </>
              )}
            </motion.div>
          </div>

          {/* Footer Actions */}
          <div className="px-8 py-4 bg-gray-50 border-t border-gray-200">
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

export default LeadManagement;
