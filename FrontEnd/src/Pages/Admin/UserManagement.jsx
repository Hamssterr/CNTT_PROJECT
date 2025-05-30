import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";
import { Search, ChevronUp, Pencil, UserPlus, Trash2, Eye } from "lucide-react";

import NavbarAdmin from "../../Components/Admin/Navbar";
import SidebarAdmin from "../../Components/Admin/Sidebar";
import Loading from "../../Components/Loading";
import AddEmployeeModal from "../../Components/Admin/userManagement/EmployeeModal/AddEmployeeModal"
import AddUserModal from "../../Components/Admin/userManagement/UserModal/AddUserModal"
import EditEmployeeModal from "../../Components/Admin/userManagement/EmployeeModal/EditEmployeeModal"
import EditUserModal from "../../Components/Admin/userManagement/UserModal/EditUserModal"
import ViewEmployeeModal from "../../Components/Admin/userManagement/EmployeeModal/ViewEmployeeModal"
import ViewUserModal from "../../Components/Admin/userManagement/UserModal/ViewUserModal"
import DeleteUserModal from "../../Components/Admin/userManagement/DeleteModal"


const TABS = [
  { label: "All", value: "all" },
  { label: "Admin", value: "admin" },
  { label: "Finance", value: "finance" },
  { label: "Student", value: "student" },
  { label: "Parent", value: "parent" },
  { label: "Teacher", value: "teacher" },
];

const TABLE_HEAD = [
  "Member",
  "Function",
  "Status",
  "Employed",
  "Update & Delete",
];

const UserManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { backendUrl } = useContext(AppContext);
  const [userData, setUserData] = useState([]);
  const [filterUsers, setFilterUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showViewEmployeeModal, setShowViewEmployeeModal] = useState(false);
  const [showViewUserModal, setShowViewUserModal] = useState(false);
  const [selectedUserForView, setSelectedUserForView] = useState(null);

  // Update user
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Modal states
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [showEditEmployeeModal, setShowEditEmployeeModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
    phoneNumber: "",
    address: {
      houseNumber: "",
      street: "",
      ward: "",
      district: "",
      city: "",
      province: "",
      country: "Vietnam",
    },
    degree: [{ name: "", institution: "", year: "", major: "" }],
    experience: [
      {
        position: "",
        company: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ],
    parentPhoneNumber: "",
  });

  // Danh sách các role thuộc nhóm "employee"
  const employeeRoles = ["teacher", "finance", "admin", "consultant"];

  const fetchingUserData = async () => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;

      const { data } = await axios.get(`${backendUrl}/api/admin/getDataUsers`);
      if (data.success) {
        setUserData(data.data);
        setFilterUsers(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data user
  useEffect(() => {
    fetchingUserData();
  }, [backendUrl]);

  // Filter user
  useEffect(() => {
    let filtered = userData;

    // Filter tab
    if (activeTab !== "all") {
      filtered = userData.filter((user) => user.role === activeTab);
    }

    // Filter search
    if (searchQuery.trim() !== "") {
      const query = searchQuery.trim().toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.firstName?.toLowerCase().includes(query) ||
          user.lastName?.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query)
      );
    }
    setFilterUsers(filtered);
    setCurrentPage(1);
  }, [activeTab, userData, searchQuery]);

  // Page split
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filterUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filterUsers.length / itemsPerPage);

  const handleView = async (user) => {
    try {
      let enrichedUser = { ...user };

      // Nếu là student, lấy thông tin chi tiết của parent (nếu cần)
      if (user.role === "student" && user.parents && user.parents.length > 0) {
        const parentPromises = user.parents.map(async (parent) => {
          if (!parent.phoneNumber || !parent.email) {
            const response = await axios.get(
              `${backendUrl}/api/admin/getUser/${parent.id}`
            );
            return response.data.data;
          }
          return parent;
        });
        const detailedParents = await Promise.all(parentPromises);
        enrichedUser = { ...user, parents: detailedParents };
      }

      // Nếu là parent, lấy thông tin chi tiết của children (nếu cần)
      if (user.role === "parent" && user.children && user.children.length > 0) {
        const childPromises = user.children.map(async (child) => {
          if (!child.phoneNumber) {
            const response = await axios.get(
              `${backendUrl}/api/admin/getUser/${child.id}`
            );
            return response.data.data;
          }
          return child;
        });
        const detailedChildren = await Promise.all(childPromises);
        enrichedUser = { ...user, children: detailedChildren };
      }

      setSelectedUserForView(enrichedUser);
      if (employeeRoles.includes(user.role)) {
        setShowViewEmployeeModal(true);
        setShowViewUserModal(false);
      } else {
        setShowViewUserModal(true);
        setShowViewEmployeeModal(false);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load user details"
      );
    }
  };

  const handleUpdate = (user) => {
    setIsEditMode(true);
    setSelectedUser(user);

    const updatedFormData = {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      password: "",
      role: user.role || "",
      phoneNumber: user.phoneNumber || "",
      address: user.address || {
        houseNumber: "",
        street: "",
        ward: "",
        district: "",
        city: "",
        province: "",
        country: "Vietnam",
      },
      degree:
        user.degree && user.degree.length > 0
          ? user.degree
          : [{ name: "", institution: "", year: "", major: "" }],
      experience:
        user.experience && user.experience.length > 0
          ? user.experience
          : [
              {
                position: "",
                company: "",
                startDate: "",
                endDate: "",
                description: "",
              },
            ],
      parentPhoneNumber: user.parentPhoneNumber || "",
    };

    setFormData(updatedFormData);

    if (employeeRoles.includes(user.role)) {
      setShowEditEmployeeModal(true);
      setShowEditUserModal(false);
      setShowAddUserModal(false);
    } else {
      setShowEditUserModal(true);
      setShowEditEmployeeModal(false);
      setShowAddUserModal(false);
    }
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;

      const { data } = await axios.delete(
        `${backendUrl}/api/admin/deleteUser/${selectedUser._id}`
      );

      if (data.success) {
        toast.success("Deleted successfully");
        fetchingUserData();
      } else {
        toast.error(data.message || "Delete operation failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "",
      phoneNumber: "",
      address: {
        houseNumber: "",
        street: "",
        ward: "",
        district: "",
        city: "",
        province: "",
        country: "Vietnam",
      },
      degree: [{ name: "", institution: "", year: "", major: "" }],
      experience: [
        {
          position: "",
          company: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
      parentPhoneNumber: "",
    });
    setIsEditMode(false);
    setSelectedUser(null);
  };

  const handleOnSubmit = async (e, updatedFormData = formData) => {
    e.preventDefault();

    try {
      setLoading(true);
      axios.defaults.withCredentials = true;

      let response;
      if (isEditMode && selectedUser) {
        // Xử lý cập nhật user hoặc employee
        let dataToSubmit;

        if (employeeRoles.includes(updatedFormData.role)) {
          // Cập nhật employee (admin, finance, teacher)
          dataToSubmit = {
            firstName: updatedFormData.firstName,
            lastName: updatedFormData.lastName,
            email: updatedFormData.email,
            password: updatedFormData.password || undefined,
            phoneNumber: updatedFormData.phoneNumber,
            role: updatedFormData.role,
            address: updatedFormData.address,
            degree: updatedFormData.degree,
            experience: updatedFormData.experience,
          };
        } else {
          // Cập nhật user (parent, student, consultant)
          dataToSubmit = {
            firstName: updatedFormData.firstName,
            lastName: updatedFormData.lastName,
            email: updatedFormData.email,
            password: updatedFormData.password || undefined,
            phoneNumber: updatedFormData.phoneNumber,
            role: updatedFormData.role,
            ...(updatedFormData.role === "parent" && {
              address: updatedFormData.address,
            }),
            ...(updatedFormData.role === "student" && {
              isAdultStudent: updatedFormData.isAdultStudent,
              ...(updatedFormData.isAdultStudent && {
                address: updatedFormData.address,
              }),
              ...(!updatedFormData.isAdultStudent &&
                updatedFormData.parentPhoneNumber && {
                  parentPhoneNumber: updatedFormData.parentPhoneNumber,
                }),
            }),
            // ...(updatedFormData.role === "consultant" && {
            //   address: undefined,
            //   parentPhoneNumber: undefined,
            //   isAdultStudent: undefined,
            // }),
          };
        }

        // Thêm logging để kiểm tra dữ liệu gửi đi
        console.log("Data to submit for update:", dataToSubmit);

        response = await axios.put(
          `${backendUrl}/api/admin/updateUser/${selectedUser._id}`,
          dataToSubmit
        );
      } else {
        // Tạo user mới
        const dataToSubmit = {
          firstName: updatedFormData.firstName,
          lastName: updatedFormData.lastName,
          email: updatedFormData.email,
          password: updatedFormData.password,
          phoneNumber: updatedFormData.phoneNumber,
          role: updatedFormData.role,
          ...(employeeRoles.includes(updatedFormData.role) && {
            address: updatedFormData.address,
            degree: updatedFormData.degree,
            experience: updatedFormData.experience,
          }),
          ...(updatedFormData.role === "parent" && {
            address: updatedFormData.address,
          }),
          ...(updatedFormData.role === "student" && {
            isAdultStudent: updatedFormData.isAdultStudent,
            ...(updatedFormData.isAdultStudent && {
              address: updatedFormData.address,
            }),
            ...(!updatedFormData.isAdultStudent &&
              updatedFormData.parentPhoneNumber && {
                parentPhoneNumber: updatedFormData.parentPhoneNumber,
              }),
          }),
        };

        // Thêm logging để kiểm tra dữ liệu gửi đi
        console.log("Data to submit for create:", dataToSubmit);

        if (employeeRoles.includes(updatedFormData.role)) {
          response = await axios.post(
            `${backendUrl}/api/admin/createEmployee`,
            dataToSubmit
          );
        } else if (updatedFormData.role === "parent") {
          response = await axios.post(
            `${backendUrl}/api/admin/createParentAccount`,
            dataToSubmit
          );
        } else if (updatedFormData.role === "student") {
          response = await axios.post(
            `${backendUrl}/api/admin/createStudentAccount`,
            dataToSubmit
          );
        }
      }

      const { data } = response;

      if (data.success) {
        toast.success(
          isEditMode ? "Updated successfully" : "Added successfully"
        );
        await fetchingUserData();
        resetForm();
        setShowAddEmployeeModal(false);
        setShowEditEmployeeModal(false);
        setShowEditUserModal(false);
        setShowAddUserModal(false);
        setIsEditMode(false);
        setSelectedUser(null);
      } else {
        toast.error(data.message || "Operation failed");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" flex flex-col min-h-screen">
      <NavbarAdmin />
      <div className=" flex flex-1">
        <SidebarAdmin />

        <main className=" flex-1 p-5 md:ml-30">
          {/* Header Section */}
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              User Management
            </h1>
            <p className="text-gray-600">Monitor and manage user</p>
          </div>

          {/* Ví dụ thêm nội dung */}
          <div className=" mt-6">
            <div className="w-full h-full bg-white rounded-lg shadow-md border border-gray-200 relative">
              {/* AddEmployeeModal cho employee */}
              <AddEmployeeModal
                show={showAddEmployeeModal}
                onClose={() => {
                  setShowAddEmployeeModal(false);
                  resetForm();
                }}
                onSubmit={handleOnSubmit}
                formData={formData}
                setFormData={setFormData}
                loading={loading}
                // isEditMode={isEditMode}
              />

              <EditEmployeeModal
                show={showEditEmployeeModal}
                onClose={() => {
                  setShowEditEmployeeModal(false);
                  resetForm();
                }}
                onSubmit={handleOnSubmit}
                formData={formData}
                setFormData={setFormData}
                loading={loading}
                isEditMode={isEditMode}
              />

              {/* EditUserModal cho các role không phải employee */}
              <EditUserModal
                show={showEditUserModal}
                onClose={() => {
                  setShowEditUserModal(false);
                  resetForm();
                }}
                onSubmit={handleOnSubmit}
                formData={formData}
                setFormData={setFormData}
                loading={loading}
                isEditMode={isEditMode}
              />

              {/* AddUserModal cho tạo student và parent */}
              <AddUserModal
                show={showAddUserModal}
                onClose={() => {
                  setShowAddUserModal(false);
                  resetForm();
                }}
                onSubmit={handleOnSubmit}
                formData={formData}
                setFormData={setFormData}
                loading={loading}
              />

              <DeleteUserModal
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
              />

              <ViewEmployeeModal
                show={showViewEmployeeModal}
                onClose={() => setShowViewEmployeeModal(false)}
                user={selectedUserForView}
              />

              <ViewUserModal
                show={showViewUserModal}
                onClose={() => setShowViewUserModal(false)}
                user={selectedUserForView}
              />

              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h5 className="text-xl font-bold text-gray-800">
                      Members list
                    </h5>
                    <p className="text-sm text-gray-600 mt-1">
                      See information about all members
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => {
                        setIsEditMode(false);
                        resetForm();
                        setShowAddUserModal(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-orange-400 rounded-md hover:bg-orange-700 transition"
                    >
                      <UserPlus size={16} />
                      Add User
                    </button>
                    <button
                      onClick={() => {
                        setIsEditMode(false);
                        resetForm();
                        setShowAddEmployeeModal(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
                    >
                      <UserPlus size={16} />
                      Add Employee
                    </button>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex gap-2 w-full md:w-auto">
                    {TABS.map(({ label, value }) => (
                      <button
                        key={value}
                        onClick={() => setActiveTab(value)}
                        className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <div className="relative w-full md:w-72">
                    <input
                      type="text"
                      placeholder="Search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Search
                      size={20}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    />
                  </div>
                </div>
              </div>

              {/* Table Body */}
              {loading ? (
                <div className="flex justify-center items-center h-64 bg-gray-100/50">
                  <Loading />
                </div>
              ) : currentItems.length === 0 ? (
                <div className=" p-4 text-center text-gray-500">
                  No matching members found
                </div>
              ) : (
                <div className="overflow-x-auto px-0">
                  <table className="w-full min-w-max text-left">
                    <thead>
                      <tr className="bg-gray-50 border-y border-gray-200">
                        {TABLE_HEAD.map((head, index) => (
                          <th
                            key={head}
                            className="p-4 text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition"
                          >
                            <div className="flex items-center justify-between gap-2">
                              {head}
                              {index !== TABLE_HEAD.length - 1 && (
                                <ChevronUp
                                  size={16}
                                  className="text-gray-500"
                                />
                              )}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {currentItems.map((user, index) => {
                        const isLast = index === filterUsers.length - 1;
                        const classes = isLast
                          ? "p-4"
                          : "p-4 border-b border-gray-100";

                        return (
                          <tr
                            key={user.email}
                            className="hover:bg-gray-50 transition"
                          >
                            <td className={classes}>
                              <div className="flex items-center gap-3">
                                <img
                                  src={
                                    user.profileImage ||
                                    "https://res.cloudinary.com/df9ibpz4g/image/upload/v1743752097/uploads/3.png"
                                  }
                                  alt={user.name}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                                <div className="flex flex-col">
                                  <span className="text-sm text-gray-800 font-medium">
                                    {user.lastName + " "}
                                    {user.firstName}
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    {user.email}
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td className={classes}>
                              <div className="flex flex-col">
                                <span className="text-sm text-gray-800 font-medium">
                                  {user.job || "N/A"}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {user.org || "N/A"}
                                </span>
                              </div>
                            </td>

                            <td className={classes}>
                              <span
                                className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                                  user.online
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {user.online ? "online" : "offline"}
                              </span>
                            </td>

                            <td className={classes}>
                              <span className="text-sm text-gray-800">
                                {user.role || "Unknown"}
                              </span>
                            </td>

                            <td className={classes}>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleView(user)}
                                  className="p-2 rounded hover:bg-blue-100 text-gray-600 hover:text-blue-600 transition"
                                >
                                  <Eye size={16} />
                                </button>
                                <button
                                  onClick={() => handleUpdate(user)}
                                  className="p-2 rounded hover:bg-blue-100 text-gray-600 hover:text-blue-600 transition"
                                >
                                  <Pencil size={16} />
                                </button>
                                <button
                                  onClick={() => handleDelete(user)}
                                  className="p-2 rounded hover:bg-red-100 text-red-600 hover:text-red-700 transition"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between p-4 border-t border-gray-200">
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition disabled:opacity-50"
                  >
                    Previous
                  </button>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserManagement;
