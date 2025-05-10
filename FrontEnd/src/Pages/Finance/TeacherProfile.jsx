import React, { useState, useEffect, useContext } from "react";
import Navbar from "../../Components/Academic-Finance/NavBar";
import Sidebar from "../../Components/Academic-Finance/SideBar";
import Modal from "react-modal";
import Swal from "sweetalert2";
import { Search, Edit3, Plus } from "lucide-react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";

Modal.setAppElement("#root");

function TeacherProfile() {
  const { backendUrl } = useContext(AppContext);

  const [teachers, setTeachers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const specializations = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
    "History",
    "Computer Science",
    "Economics",
    "Geography",
    "Philosophy",
  ];

  // Fetch teachers from backend
  const fetchTeachers = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/academic-finance/getTeachers`
      );
      if (data.success) {
        setTeachers(data.teachers);
      } else {
        Swal.fire(
          "Error",
          data.message || "Failed to fetch teachers.",
          "error"
        );
      }
    } catch (error) {
      Swal.fire("Error", "Failed to fetch teachers.", "error");
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  // Open modal for adding a new teacher
  const handleAddTeacher = () => {
    setSelectedTeacher({
      name: "",
      email: "",
      phone: "",
      specialization: "",
      experience: 0,
    });
    setModalIsOpen(true);
  };

  // Open modal for editing a teacher
  const handleEditTeacher = (teacher) => {
    setSelectedTeacher({
      id: teacher._id,
      name: teacher.name,
      email: teacher.email,
      phone: teacher.phone,
      specialization: teacher.specialization,
      experience: teacher.experience,
    });
    setModalIsOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedTeacher(null);
  };

  // Save teacher (add or update)
  const handleSaveTeacher = async () => {
    if (
      !selectedTeacher.name.trim() ||
      !selectedTeacher.email.trim() ||
      !selectedTeacher.phone.trim() ||
      !selectedTeacher.specialization.trim() ||
      isNaN(selectedTeacher.experience)
    ) {
      Swal.fire("Error", "Please fill in all required fields.", "error");
      return;
    }

    try {
      const teacherData = {
        name: selectedTeacher.name,
        email: selectedTeacher.email,
        phone: selectedTeacher.phone,
        specialization: selectedTeacher.specialization,
        experience: selectedTeacher.experience,
      };

      if (selectedTeacher.id) {
        // Update teacher
        const { data } = await axios.put(
          `${backendUrl}/api/academic-finance/updateTeacher/${selectedTeacher.id}`,
          teacherData
        );
        if (data.success) {
          Swal.fire("Success", "Teacher updated successfully!", "success");
          fetchTeachers();
        } else {
          Swal.fire(
            "Error",
            data.message || "Failed to update teacher.",
            "error"
          );
        }
      } else {
        // Add new teacher
        const { data } = await axios.post(
          `${backendUrl}/api/academic-finance/addNewTeacher`,
          teacherData
        );
        if (data.success) {
          Swal.fire("Success", "Teacher added successfully!", "success");
          fetchTeachers();
        } else {
          Swal.fire("Error", data.message || "Failed to add teacher.", "error");
        }
      }
      closeModal();
    } catch (error) {
      Swal.fire("Error", "Failed to save teacher.", "error");
    }
  };

  // Filter teachers based on search query
  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <Navbar />
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-8 ml-20">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Teacher Profile
            </h1>
            <div className="flex items-center gap-4">
              <div className="relative w-full md:w-64">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="text-gray-400" size={20} />
                </span>
                <input
                  type="text"
                  placeholder="Search teachers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                onClick={handleAddTeacher}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                <Plus size={16} />
                Add Teacher
              </button>
            </div>
          </div>

          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 text-center">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Specialization
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Experience
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTeachers.length > 0 ? (
                  filteredTeachers.map((teacher, index) => (
                    <tr key={teacher._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {teacher.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {teacher.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {teacher.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {teacher.specialization}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {teacher.experience} years
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => handleEditTeacher(teacher)}
                            className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm flex items-center gap-1"
                          >
                            <Edit3 size={16} /> Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No teacher records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            contentLabel="Add/Edit Teacher Modal"
            className="myModal"
            overlayClassName="myOverlay"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {selectedTeacher?.id ? "Edit Teacher" : "Add New Teacher"}
              </h2>
              {selectedTeacher && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={selectedTeacher.name}
                      onChange={(e) =>
                        setSelectedTeacher({
                          ...selectedTeacher,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={selectedTeacher.email}
                      onChange={(e) =>
                        setSelectedTeacher({
                          ...selectedTeacher,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={selectedTeacher.phone}
                      onChange={(e) =>
                        setSelectedTeacher({
                          ...selectedTeacher,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Specialization
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={selectedTeacher.specialization}
                      onChange={(e) =>
                        setSelectedTeacher({
                          ...selectedTeacher,
                          specialization: e.target.value,
                        })
                      }
                    >
                      <option value="" disabled>
                        Select a specialization
                      </option>
                      {specializations.map((subject, index) => (
                        <option key={index} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Experience (in years)
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={selectedTeacher.experience}
                      onChange={(e) =>
                        setSelectedTeacher({
                          ...selectedTeacher,
                          experience: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              )}
              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTeacher}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  Save
                </button>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default TeacherProfile;
