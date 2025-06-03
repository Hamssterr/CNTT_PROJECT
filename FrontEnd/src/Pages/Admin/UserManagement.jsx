import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";
import {
  Search,
  ChevronUp,
  Pencil,
  UserPlus,
  Trash2,
  Eye,
  BookOpen,
  Calendar,
  Plus,
} from "lucide-react";

import NavbarAdmin from "../../Components/Admin/Navbar";
import SidebarAdmin from "../../Components/Admin/Sidebar";
import Loading from "../../Components/Loading";
import AddEmployeeModal from "../../Components/Admin/userManagement/EmployeeModal/AddEmployeeModal";
import AddUserModal from "../../Components/Admin/userManagement/UserModal/AddUserModal";
import EditEmployeeModal from "../../Components/Admin/userManagement/EmployeeModal/EditEmployeeModal";
import EditUserModal from "../../Components/Admin/userManagement/UserModal/EditUserModal";
import ViewEmployeeModal from "../../Components/Admin/userManagement/EmployeeModal/ViewEmployeeModal";
import ViewUserModal from "../../Components/Admin/userManagement/UserModal/ViewUserModal";
import DeleteUserModal from "../../Components/Admin/userManagement/DeleteModal";
import ResponsiveUserCard from "../../Components/Admin/userManagement/ResponsiveUserCard";

const TABS = [
  { label: "All", value: "all" },
  { label: "Admin", value: "admin" },
  { label: "Finance", value: "finance" },
  { label: "Student", value: "student" },
  { label: "Parent", value: "parent" },
  { label: "Teacher", value: "teacher" },
];

const TABLE_HEAD = ["Member", "Create At", "Role", "Function"];

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

  const [viewMode, setViewMode] = useState("cards");

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

  const usersThisMonth = useMemo(() => {
    if (!Array.isArray(userData)) return 0;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return userData.filter((user) => {
      if (!user.createdAt) return false;
      const createdAt = new Date(user.createdAt);
      // Validate date
      if (isNaN(createdAt.getTime())) return false;
      return (
        createdAt.getMonth() === currentMonth &&
        createdAt.getFullYear() === currentYear
      );
    }).length;
  }, [userData]);

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

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 mt-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total User
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {userData.length}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 lg:p-6 shadow-lg border border-white/50 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-100/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-xs lg:text-sm font-medium text-gray-600">
                    New Users This Month
                  </p>
                  <p className="text-xl lg:text-2xl font-bold text-orange-600">
                    {usersThisMonth}
                  </p>
                </div>
                <div className="p-2 lg:p-3 bg-orange-100 rounded-full group-hover:bg-orange-200 transition-colors duration-300">
                  <Calendar className="w-5 h-5 lg:w-6 lg:h-6 text-orange-600" />
                </div>
              </div>
              {usersThisMonth === 0 && (
                <p className="text-xs text-gray-500 mt-2 italic">
                  No users added this month
                </p>
              )}
            </div>
          </div>

          {/* Enhanced Header */}
          <div className="p-4 lg:p-8 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 text-white rounded-xl lg:rounded-2xl border border-white/10 bg-opacity-90 backdrop-blur-lg shadow-xl mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 lg:mb-6">
              <div className="mb-4 lg:mb-0">
                <h2 className="text-xl lg:text-2xl font-bold mb-2">
                  Users Directory
                </h2>
                <p className="text-blue-100 text-sm lg:text-base">
                  Comprehensive overview of all educational content
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  className="flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white/30 transition-all duration-300 group self-start"
                  onClick={() => {
                    setIsEditMode(false);
                    resetForm();
                    setShowAddUserModal(true);
                  }}
                >
                  <Plus
                    size={18}
                    className="group-hover:rotate-90 transition-transform duration-300"
                  />
                  <span className="font-semibold text-sm lg:text-base">
                    Add User
                  </span>
                </button>

                <button
                  className="flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white/30 transition-all duration-300 group self-start"
                  onClick={() => {
                    setIsEditMode(false);
                    resetForm();
                    setShowAddEmployeeModal(true);
                  }}
                >
                  <Plus
                    size={18}
                    className="group-hover:rotate-90 transition-transform duration-300"
                  />
                  <span className="font-semibold text-sm lg:text-base">
                    Add Employee
                  </span>
                </button>
              </div>
            </div>

            {/* Enhanced Controls */}
            <div className="space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between lg:gap-6">
              {/* Tabs - Scrollable on mobile */}
              <div className="flex gap-1 lg:gap-2 bg-white/10 backdrop-blur-sm rounded-xl p-1 lg:p-2 overflow-x-auto">
                {(window.innerWidth < 1024 ? TABS.slice(0, 5) : TABS).map(
                  ({ label, value }) => (
                    <button
                      key={value}
                      onClick={() => setActiveTab(value)}
                      className={`px-3 lg:px-6 py-1.5 lg:py-2 rounded-lg font-medium transition-all duration-300 whitespace-nowrap text-sm lg:text-base ${
                        activeTab === value
                          ? "bg-white text-blue-600 shadow-lg"
                          : "text-white/80 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {label}
                    </button>
                  )
                )}
              </div>

              {/* Search and Filter */}
              <div className="flex gap-2 lg:gap-4">
                <div className="relative flex-1 lg:flex-none">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search courses..."
                    className="w-full lg:w-80 pl-10 lg:pl-12 pr-4 py-2 lg:py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/30 transition-all duration-300 text-sm lg:text-base"
                  />
                  <Search
                    size={16}
                    className="lg:hidden absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70"
                  />
                  <Search
                    size={20}
                    className="hidden lg:block absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70"
                  />
                </div>

                {/* View mode toggle for desktop */}
                <div className="hidden lg:flex gap-1 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode("cards")}
                    className={`px-3 py-2 rounded-lg transition-all duration-300 ${
                      viewMode === "cards" ? "bg-white/30" : "hover:bg-white/10"
                    }`}
                  >
                    <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                      <div className="bg-white rounded-sm"></div>
                      <div className="bg-white rounded-sm"></div>
                      <div className="bg-white rounded-sm"></div>
                      <div className="bg-white rounded-sm"></div>
                    </div>
                  </button>
                  <button
                    onClick={() => setViewMode("table")}
                    className={`px-3 py-2 rounded-lg transition-all duration-300 ${
                      viewMode === "table" ? "bg-white/30" : "hover:bg-white/10"
                    }`}
                  >
                    <div className="w-4 h-4 flex flex-col gap-0.5">
                      <div className="h-0.5 bg-white rounded"></div>
                      <div className="h-0.5 bg-white rounded"></div>
                      <div className="h-0.5 bg-white rounded"></div>
                      <div className="h-0.5 bg-white rounded"></div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
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

              <div className="bg-white rounded-xl shadow-md border border-gray-200">
                {/* Mobile Card View (default) / Desktop responsive view */}
                <div
                  className={`${
                    viewMode === "table" ? "hidden lg:block" : "block lg:hidden"
                  }`}
                >
                  <div className=" p-4">
                    <div className=" grid gap-4">
                      {currentItems.map((user) => (
                        <ResponsiveUserCard
                          key={user._id}
                          user={user}
                          onView={handleView}
                          onEdit={handleUpdate}
                          onDelete={handleDelete}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Desktop Table View */}
                <div
                  className={`${
                    viewMode === "cards"
                      ? "hidden lg:block"
                      : "hidden lg:hidden"
                  } lg:block`}
                >
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50/80 backdrop-blur-sm border-b border-gray-200/50">
                          {TABLE_HEAD.map((head, index) => (
                            <th
                              key={head}
                              className="p-6 text-left text-sm font-semibold text-gray-700 hover:bg-gray-100/50 transition-colors duration-200 cursor-pointer"
                            >
                              <div className="flex items-center justify-between gap-2">
                                {head}
                                {index !== TABLE_HEAD.length - 1 && (
                                  <ChevronUp
                                    size={16}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                  />
                                )}
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100/50">
                        {currentItems.map((user) => (
                          <tr
                            key={user._id}
                            className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-300 group"
                          >
                            <td className="p-4">
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

                            <td className="p-4">
                              <span className="text-gray-600 font-medium">
                                {new Date(user.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )}
                              </span>
                            </td>

                            <td className="p-4">
                              <span className="text-sm text-gray-800">
                                {user.role
                                  ? user.role.charAt(0).toUpperCase() +
                                    user.role.slice(1).toLowerCase()
                                  : "Unknown"}
                              </span>
                            </td>

                            <td className="p-4">
                              <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                                <button
                                  className="p-2 rounded-xl hover:bg-blue-100 text-gray-500 hover:text-blue-600 transition-all duration-300"
                                  onClick={() => handleView(user)}
                                >
                                  <Eye size={16} />
                                </button>
                                <button
                                  className="p-2 rounded-xl hover:bg-blue-100 text-gray-500 hover:text-blue-600 transition-all duration-300"
                                  onClick={() => handleUpdate(user)}
                                >
                                  <Pencil size={16} />
                                </button>
                                <button
                                  className="p-2 rounded-xl hover:bg-red-100 text-gray-500 hover:text-red-600 transition-all duration-300"
                                  onClick={() => handleDelete(user)}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Enhanced Footer */}
                <div className="flex flex-col sm:flex-row items-center justify-between p-4 lg:p-6 bg-gray-50/50 backdrop-blur-sm border-t border-gray-200/50 gap-4">
                  <div className="text-sm text-gray-600 font-medium order-2 sm:order-1">
                    Showing{" "}
                    <span className="text-gray-900 font-semibold">
                      {currentItems.length > 0 ? indexOfFirstItem + 1 : 0}-
                      {indexOfFirstItem + currentItems.length}
                    </span>{" "}
                    of{" "}
                    <span className="text-gray-900 font-semibold">
                      {filterUsers.length}
                    </span>{" "}
                    courses
                  </div>
                  <div className="flex items-center gap-2 lg:gap-3 order-1 sm:order-2">
                    <button
                      className="px-3 lg:px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    <div className="flex items-center gap-2">
                      <span className="px-3 lg:px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-100 rounded-xl">
                        {currentPage}
                      </span>
                      <span className="text-gray-500 text-sm">
                        of {totalPages}
                      </span>
                    </div>
                    <button
                      disabled={currentPage === totalPages || totalPages === 0}
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      className="px-3 lg:px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
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
