import React, { useState, useEffect } from "react";
import Navbar from "../../Components/Consultant/Navbar";
import Sidebar from "../../Components/Consultant/Sidebar";
import Footer from "../../Components/Footer";
import "../../public/ModalStyle.css";
import axios from "axios";
import {
  Search,
  Phone,
  Mail,
  Clock,
  CircleCheck,
  UserX,
  X,
} from "lucide-react";
import Modal from "react-modal";
import Swal from "sweetalert2";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";

Modal.setAppElement("#root");

const customModalStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
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
  },
};

function LeadManagement() {
  const [showModal, setShowModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [addNew, setAddNew] = useState(false);
  const [leadsData, setLeadsData] = useState([]);
  const { leads, setLeads, backendUrl } = useContext(AppContext);

  const availableCourses = [
    { id: 1, name: "Web Development" },
    { id: 2, name: "Mobile App Development" },
    { id: 3, name: "Data Science" },
    { id: 4, name: "Machine Learning" },
    { id: 5, name: "Cloud Computing" },
    { id: 6, name: "DevOps" },
    { id: 7, name: "Cyber Security" },
    { id: 8, name: "UI/UX Design" },
  ];

  // Fetch courses data
  const fetchCourses = async () => {
    try {
      const response = await axios.get("/api/courses");
      if (response.data.success) {
        setAvailableCourses(response.data.courses);
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  };

  // Fetch leads data
  const fetchLeads = async () => {
    try {
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
        (lead.phone === selectedLead.phone || lead.email === selectedLead.email) &&
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
              {availableCourses.map((course) => (
                <option key={course.id} value={course.name}>
                  {course.name}
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
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-8 ml-20">
          {/* Header Section */}
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Lead Management
            </h1>
            <div className="flex items-center gap-4">
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
              >
                Add New Lead
              </button>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search leads..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="py-2 pl-10 pr-4 rounded-lg shadow-sm border border-gray-300"
                />
                <Search
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={20}
                />
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-xl shadow overflow-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-200 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Student's name</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Course</th>
                  <th className="py-3 px-4">Registration date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                {filteredLeads.map((lead) => (
                  <tr key={lead._id} className="border-b hover:bg-gray-100">
                    <td className="py-3 px-4 text-center">{lead.name}</td>
                    <td className="py-3 px-4 text-center">
                      {lead.studentName}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="flex items-center gap-1">
                          <Phone size={16} /> {lead.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail size={16} /> {lead.email}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">{lead.course}</td>
                    <td className="py-3 px-4 text-center">
                      {new Date(lead.registrationDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {lead.status === "Contacted" && (
                        <span className="text-green-600 font-semibold flex items-center gap-1 justify-center">
                          <CircleCheck size={18} /> {lead.status}
                        </span>
                      )}
                      {lead.status === "Not Responding" && (
                        <span className="text-red-500 font-semibold flex items-center gap-1 justify-center">
                          <UserX size={18} /> {lead.status}
                        </span>
                      )}
                      {lead.status === "Pending" && (
                        <span className="text-yellow-500 font-semibold flex items-center gap-1 justify-center">
                          <Clock size={18} /> {lead.status}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(lead)}
                          className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDelete(lead)}
                          className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal */}
          <Modal
            isOpen={showModal}
            onRequestClose={handleClose}
            closeTimeoutMS={300}
            className="myModal"
            overlayClassName="myOverlay"
            ariaHideApp={false}
          >
            <div className="bg-white rounded-lg">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {addNew ? "Add New Lead" : "Update Lead Information"}
                  </h2>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              {renderModalBody()}

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  onClick={handleSave}
                >
                  {addNew ? "Add Lead" : "Update Lead"}
                </button>
              </div>
            </div>
          </Modal>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default LeadManagement;
