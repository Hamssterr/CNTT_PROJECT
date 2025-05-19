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
} from "lucide-react";
import "../../public/ModalStyle.css";
import axios from "axios";
import Modal from "react-modal";
import Swal from "sweetalert2";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import Loading from "../../Components/Loading";
import { set } from "date-fns";

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

function LeadManagement() {
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
    <div>
      <Navbar />
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Sidebar />
        <div className="flex-1 p-8 ml-20">
          {/* Enhanced Header Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Lead Management
                </h1>
                <p className="text-gray-600">
                  Manage and track potential students
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => fetchLeads()}
                  className="p-2 text-gray-600 hover:text-gray-900 bg-white rounded-lg shadow-sm hover:shadow transition-all"
                  title="Refresh"
                >
                  <RefreshCcw size={20} />
                </button>
                <button
                  className="p-2 text-gray-600 hover:text-gray-900 bg-white rounded-lg shadow-sm hover:shadow transition-all"
                  title="Export"
                >
                  <Download size={20} />
                </button>
              </div>
            </div>

            {/* Search and Filters Bar */}
            <div className="flex flex-wrap gap-4 items-center justify-between bg-white p-4 rounded-xl shadow-sm">
              <div className="flex-1 min-w-[300px] relative">
                <input
                  type="text"
                  placeholder="Search by name, email, phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2.5 pl-10 pr-4 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
                <Search
                  className="absolute left-3 top-3 text-gray-400"
                  size={20}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleAdd}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm hover:shadow transition-all"
                >
                  <Plus size={20} />
                  Add New Lead
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Table Section */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64 bg-gray-100/50">
              <Loading />
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600 text-sm">
                      <th className="py-4 px-6 text-left font-semibold">
                        Name
                      </th>
                      <th className="py-4 px-6 text-left font-semibold">
                        Student
                      </th>
                      <th className="py-4 px-6 text-left font-semibold">
                        Contact
                      </th>
                      <th className="py-4 px-6 text-left font-semibold">
                        Course
                      </th>
                      <th className="py-4 px-6 text-left font-semibold">
                        Registration
                      </th>
                      <th className="py-4 px-6 text-left font-semibold">
                        Status
                      </th>
                      <th className="py-4 px-6 text-center font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map((lead, index) => (
                      <tr
                        key={lead._id}
                        className={`border-t border-gray-100 hover:bg-blue-50/30 transition-colors ${
                          index % 2 === 0 ? "bg-gray-50/30" : ""
                        }`}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                              {lead.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {lead.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-gray-600">
                          {lead.studentName}
                        </td>
                        <td className="py-4 px-6">
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
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                            {lead.course}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-600">
                          {new Date(lead.registrationDate).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                              lead.status === "Contacted"
                                ? "bg-green-100 text-green-700"
                                : lead.status === "Not Responding"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {lead.status === "Contacted" && (
                              <CircleCheck size={16} />
                            )}
                            {lead.status === "Not Responding" && (
                              <UserX size={16} />
                            )}
                            {lead.status === "Pending" && <Clock size={16} />}
                            {lead.status}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEdit(lead)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
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
                            </button>
                            <button
                              onClick={() => handleDelete(lead)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
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
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Modal styling in your CSS file */}
      <style jsx>{`
        .myModal {
          background: white;
          border-radius: 1rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          max-width: 42rem;
          width: 90%;
          margin: 2rem auto;
          animation: modalEntry 0.3s ease-out;
        }

        @keyframes modalEntry {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .myOverlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
      `}</style>

      <Modal
        isOpen={showModal}
        onRequestClose={handleClose}
        style={customModalStyles}
        contentLabel="Lead Form"
      >
        <div className="bg-white rounded-xl overflow-hidden">
          {/* Modal Header */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                {addNew ? "Add New Lead" : "Edit Lead"}
              </h2>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          {renderModalBody()}

          {/* Modal Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-end gap-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {addNew ? "Add Lead" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default LeadManagement;
