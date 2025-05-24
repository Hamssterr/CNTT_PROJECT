import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition, Tab } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  BookOpen,
  MapPin,
  GraduationCap,
  Users,
  UserPlus,
  UserMinus,
  Mail,
} from "lucide-react";
import { toast } from "react-toastify";

const EditClassModal = ({
  show,
  onClose,
  onSubmit,
  loading,
  courses,
  classData,
  students,
  onAddStudent,
  onRemoveStudent,
}) => {
  const [formData, setFormData] = useState({
    className: "",
    room: "",
    courseId: "",
  });
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [studentToRemove, setStudentToRemove] = useState(null);

  // Initialize form with classData
  useEffect(() => {
    if (show && classData) {
      setFormData({
        className: classData.className || "",
        room: classData.room || "",
        courseId: classData.courseId?._id || "",
      });
      setSelectedStudentId("");
    }
  }, [show, classData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.className || !formData.room || !formData.courseId) {
      toast.error("All fields are required");
      return;
    }
    await onSubmit(formData);
  };

  const handleAddStudent = async () => {
    if (!selectedStudentId) {
      toast.error("Please select a student to add");
      return;
    }
    await onAddStudent(selectedStudentId);
    setSelectedStudentId("");
  };

  const handleRemoveStudent = async (student) => {
    // Open confirmation modal instead of removing directly
    setStudentToRemove(student);
    setShowConfirmModal(true);
  };

  const confirmRemoveStudent = async () => {
    if (studentToRemove) {
      await onRemoveStudent(studentToRemove.userId?._id);
    }
    setShowConfirmModal(false);
    setStudentToRemove(null);
  };

  const cancelRemoveStudent = () => {
    setShowConfirmModal(false);
    setStudentToRemove(null);
  };

  if (!show) return null;

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
                {/* Header với Gradient */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4 relative">
                  <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all"
                  >
                    <X size={20} />
                  </button>
                  <Dialog.Title className="text-xl font-bold text-white">
                    Edit Class
                  </Dialog.Title>
                  <p className="text-blue-100 mt-1">
                    {classData?.className} - {classData?.courseId?.title}
                  </p>
                </div>

                <Tab.Group>
                  <Tab.List className="flex space-x-1 border-b border-gray-200 px-6">
                    {["Basic Information", "Student Management"].map(
                      (category) => (
                        <Tab
                          key={category}
                          className={({ selected }) =>
                            `py-4 px-6 text-sm font-medium border-b-2 transition-all outline-none ${
                              selected
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                            }`
                          }
                        >
                          {category}
                        </Tab>
                      )
                    )}
                  </Tab.List>

                  <Tab.Panels className="p-6">
                    <Tab.Panel>
                      <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        onSubmit={handleSubmit}
                        className="space-y-6"
                      >
                        {/* Class Name Field */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Class Name
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <GraduationCap className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              name="className"
                              value={formData.className}
                              onChange={handleChange}
                              className="pl-10 w-full px-4 py-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block transition-all"
                              required
                            />
                          </div>
                        </div>

                        {/* Room Field */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Room
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <MapPin className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              name="room"
                              value={formData.room}
                              onChange={handleChange}
                              className="pl-10 w-full px-4 py-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block transition-all"
                              required
                            />
                          </div>
                        </div>

                        {/* Course Select */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Course
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <BookOpen className="h-5 w-5 text-gray-400" />
                            </div>
                            <select
                              name="courseId"
                              value={formData.courseId}
                              onChange={handleChange}
                              className="pl-10 w-full px-4 py-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block transition-all"
                              required
                            >
                              <option value="">Select a course</option>
                              {courses?.map((course) => (
                                <option key={course._id} value={course._id}>
                                  {course.title}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3 pt-6">
                          <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                            disabled={loading}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50"
                          >
                            {loading ? "Saving..." : "Save Changes"}
                          </button>
                        </div>
                      </motion.form>
                    </Tab.Panel>

                    <Tab.Panel>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                      >
                        {/* Add Student Section */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-4">
                            Add New Student
                          </h4>
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <UserPlus className="h-5 w-5 text-gray-400" />
                              </div>
                              <select
                                value={selectedStudentId}
                                onChange={(e) =>
                                  setSelectedStudentId(e.target.value)
                                }
                                className="pl-10 w-full px-4 py-2.5 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block transition-all"
                              >
                                <option value="">
                                  Select a student to add
                                </option>
                                {students?.map((user) => (
                                  <option key={user._id} value={user._id}>
                                    {user.lastName} {user.firstName} (
                                    {user.email})
                                  </option>
                                ))}
                              </select>
                            </div>
                            <button
                              type="button"
                              onClick={handleAddStudent}
                              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all disabled:opacity-50"
                              disabled={loading}
                            >
                              Add Student
                            </button>
                          </div>
                        </div>

                        {/* Students List */}
                        <div className="bg-white rounded-lg border border-gray-200">
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="bg-gray-50">
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Student
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                {classData?.students?.map((student, index) => (
                                  <motion.tr
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    key={student.userId?._id || student.email}
                                    className="hover:bg-gray-50"
                                  >
                                    <td className="px-6 py-4">
                                      <div className="flex items-center">
                                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                          <Users className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div className="ml-3">
                                          <p className="text-sm font-medium text-gray-900">
                                            {(student.lastName || "") +
                                              " " +
                                              (student.firstName || "") ||
                                              "N/A"}
                                          </p>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                      {student.email || "N/A"}
                                    </td>
                                    <td className="px-6 py-4">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleRemoveStudent(student)
                                        }
                                        className="text-red-600 hover:text-red-900 text-sm font-medium hover:bg-red-50 px-2 py-1 rounded transition-all"
                                        disabled={loading}
                                      >
                                        Remove
                                      </button>
                                    </td>
                                  </motion.tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </motion.div>
                    </Tab.Panel>
                  </Tab.Panels>
                </Tab.Group>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>

      {/* Confirmation Modal */}
      <Transition appear show={showConfirmModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[60]"
          onClose={() => setShowConfirmModal(false)}
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
                  Confirm Removal
                </Dialog.Title>
                <p className="text-sm text-gray-500 mb-6">
                  Are you sure you want to remove{" "}
                  <span className="font-medium text-gray-900">
                    {(studentToRemove?.lastName || "") +
                      " " +
                      (studentToRemove?.firstName || "") ||
                      studentToRemove?.email ||
                      "this student"}
                  </span>{" "}
                  from the class?
                </p>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={cancelRemoveStudent}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={confirmRemoveStudent}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all"
                  >
                    Remove Student
                  </button>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>
    </Transition>
  );
};

export default EditClassModal;
