import React, { useState, useEffect, useContext } from "react";
import Modal from "react-modal";
import Swal from "sweetalert2";
import { Edit3, Trash2, Plus } from "lucide-react";
import axios from "axios";
import SideBar from "../../Components/Academic-Finance/SideBar";
import NavBar from "../../Components/Academic-Finance/NavBar";
import { AppContext } from "../../context/AppContext";

Modal.setAppElement("#root");

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const ClassManagement = () => {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const { backendUrl } = useContext(AppContext);

  // Fetch classes
  const fetchClasses = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/academic-finance/getClasses`
      );
      if (data.success) {
        setClasses(data.classes);
      } else {
        Swal.fire("Error", data.message || "Failed to fetch classes.", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Failed to fetch classes.", "error");
    }
  };

  // Fetch teachers
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
    fetchClasses();
    fetchTeachers();
  }, []);

  // Open modal for adding a new class
  const handleAddNew = () => {
    setSelectedClass({
      className: "",
      teacher: "",
      students: "",
      startDate: "",
    });
    setSelectedDays([]);
    setStartTime("");
    setEndTime("");
    setModalIsOpen(true);
  };

  // Open modal for editing a class
  const handleEdit = (cls) => {
    setSelectedClass({
      id: cls._id,
      className: cls.className,
      teacher: cls.teacher,
      students: cls.students,
      startDate: new Date(cls.startDate).toISOString().split("T")[0],
    });
    setSelectedDays(cls.classTime ? cls.classTime.split(", ") : []);
    setStartTime(cls.startTime || "");
    setEndTime(cls.endTime || "");
    setModalIsOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedClass(null);
  };

  // Save class (add or update)
  const handleSave = async () => {
    try {
      if (
        !selectedClass.className ||
        !selectedClass.teacher ||
        !selectedClass.students ||
        !selectedClass.startDate ||
        !startTime ||
        !endTime ||
        selectedDays.length === 0
      ) {
        Swal.fire("Error", "Please fill in all required fields.", "error");
        return;
      }

      const classData = {
        className: selectedClass.className,
        teacher: selectedClass.teacher,
        students: selectedClass.students,
        startDate: new Date(selectedClass.startDate).getTime(),
        classTime: selectedDays.join(", "),
        startTime,
        endTime,
      };

      let response;
      if (selectedClass.id) {
        response = await axios.put(
          `${backendUrl}/api/academic-finance/updateClass/${selectedClass.id}`,
          classData
        );
      } else {
        response = await axios.post(
          `${backendUrl}/api/academic-finance/addNewClass`,
          classData
        );
      }

      if (response.data.success) {
        Swal.fire(
          "Success",
          `Class ${selectedClass.id ? "updated" : "added"} successfully!`,
          "success"
        );
        fetchClasses();
        closeModal();
      } else {
        Swal.fire(
          "Error",
          response.data.message || "Operation failed.",
          "error"
        );
      }
    } catch (error) {
      Swal.fire("Error", "Operation failed. Please try again.", "error");
    }
  };

  // Delete class
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This class will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const { data } = await axios.delete(`${backendUrl}/deleteClass/${id}`);
        if (data.success) {
          Swal.fire("Deleted!", "The class has been deleted.", "success");
          fetchClasses();
        } else {
          Swal.fire(
            "Error",
            data.message || "Failed to delete class.",
            "error"
          );
        }
      } catch (error) {
        Swal.fire("Error", "Failed to delete class.", "error");
      }
    }
  };

  // Filter classes based on search query
  const filteredClasses = classes.filter((cls) =>
    cls.className.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <NavBar />
      <div className="flex min-h-screen bg-gray-100">
        <SideBar />
        <div className="flex-1 p-8 ml-30">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Class Management
            </h1>
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Search classes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleAddNew}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                <Plus size={16} />
                Add New Class
              </button>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Class Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teacher
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Students
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClasses.length > 0 ? (
                  filteredClasses.map((cls) => (
                    <tr key={cls._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {cls.className}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {cls.teacher}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {cls.students}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {new Date(cls.startDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {cls.classTime
                          ? `${cls.classTime} ${cls.startTime} - ${cls.endTime}`
                          : "Not scheduled"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(cls)}
                            className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm flex items-center gap-1"
                          >
                            <Edit3 size={16} /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(cls._id)}
                            className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm flex items-center gap-1"
                          >
                            <Trash2 size={16} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No classes found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            closeTimeoutMS={300}
            contentLabel="Add/Edit Class Modal"
            className="myModal "
            overlayClassName="myOverlay "
            ariaHideApp={false}
          >
            <div className="relative bg-white rounded-lg shadow-lg max-w-4xl w-full mx-auto p-6">
              <div className="flex justify-between items-center pb-4 mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">
                  {selectedClass?.id ? "Edit Class" : "Add New Class"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 transition"
                >
                  ✕
                </button>
              </div>

              {selectedClass && (
                <div className="space-y-4">
                  {/* Class Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Class Name
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={selectedClass.className}
                      onChange={(e) =>
                        setSelectedClass({
                          ...selectedClass,
                          className: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Teacher */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teacher
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={selectedClass.teacher}
                      onChange={(e) =>
                        setSelectedClass({
                          ...selectedClass,
                          teacher: e.target.value,
                        })
                      }
                    >
                      <option value="" disabled>
                        Select a teacher
                      </option>
                      {teachers.map((teacher) => (
                        <option key={teacher._id} value={teacher.name}>
                          {teacher.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Number of Students */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Number of Students
                    </label>
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={selectedClass.students}
                      onChange={(e) =>
                        setSelectedClass({
                          ...selectedClass,
                          students: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Start Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={selectedClass.startDate}
                      onChange={(e) =>
                        setSelectedClass({
                          ...selectedClass,
                          startDate: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Class Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Class Time
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {daysOfWeek.map((day) => (
                        <label key={day} className="inline-flex items-center">
                          <input
                            type="checkbox"
                            value={day}
                            checked={selectedDays.includes(day)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedDays([...selectedDays, day]);
                              } else {
                                setSelectedDays(
                                  selectedDays.filter((d) => d !== day)
                                );
                              }
                            }}
                            className="form-checkbox h-4 w-4 text-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {day}
                          </span>
                        </label>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
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
};

export default ClassManagement;
