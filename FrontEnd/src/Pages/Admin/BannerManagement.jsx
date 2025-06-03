import React, { useContext, useEffect, useMemo, useState } from "react";
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
  Users,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";
import Loading from "../../Components/Loading";

import NavbarAdmin from "../../Components/Admin/Navbar";
import SidebarAdmin from "../../Components/Admin/Sidebar";
import AddBannerModal from "../../Components/Admin/bannerManagement/AddBannerModal";
import DeleteBannerModal from "../../Components/Admin/bannerManagement/DeleteBannerModal";
import BannerDetailModal from "../../Components/Admin/bannerManagement/BannerDetailModal";
import ResponsiveBannerCard from "../../Components/Admin/bannerManagement/ResponsiveBannerCard";

const TABS = [
  { label: "All", value: "all" },
  { label: "Newest", value: "newBanner" },
];

const TABLE_HEAD = [
  "Background Image",
  "Title",
  "Course Name",
  "Number",
  "Created At",
  "Actions",
];

const BannerManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const { backendUrl } = useContext(AppContext);
  const [bannerData, setBannerData] = useState([]);
  const [filteredBanners, setFilteredBanners] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedBannerId, setSelectedBannerId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);

  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("cards");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    buttonText: "",
    buttonColor: "",
    backgroundImage: null,
    gradient: "",
    courseId: "",
    courseTitle: "",
    number: "",
    numberColor: "",
  });

  const fetchBannerData = async () => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;

      const { data } = await axios.get(`${backendUrl}/api/admin/getBanner`);
      if (data.success && Array.isArray(data.banners)) {
        setBannerData(data.banners);
        setFilteredBanners(data.banners);
      } else {
        setBannerData([]);
        toast.error(data.message || "No banners found");
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
      toast.error(
        error.response?.data?.message || "Failed to load banner data"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.get(`${backendUrl}/api/admin/getCourse`);
      if (data.success && Array.isArray(data.courses)) {
        setCourses(data.courses);
      } else {
        setCourses([]);
        toast.error(data.message || "No courses found");
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error(
        error.response?.data?.message || "Failed to load course data"
      );
    }
  };

  useEffect(() => {
    fetchBannerData();
    fetchCourses();
  }, [backendUrl]);

  useEffect(() => {
    let filtered = bannerData;
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      filtered = bannerData.filter(
        (banner) =>
          banner.title?.toLowerCase().includes(query) ||
          banner.description?.toLowerCase().includes(query) ||
          banner.courseId?.title?.toLowerCase().includes(query)
      );
    }
    setFilteredBanners(filtered);
    setCurrentPage(1);
  }, [searchQuery, bannerData]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBanners.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBanners.length / itemsPerPage);

  const handleEditBanner = (banner) => {
    setFormData({
      title: banner.title || "",
      description: banner.description || "",
      buttonText: banner.buttonText || "",
      buttonColor: banner.buttonColor || "",
      backgroundImage: banner.backgroundImage || null,
      gradient: banner.gradient || "",
      courseId: banner.courseId?._id || banner.courseId || "",
      courseTitle: banner.courseId?.title || "",
      number: banner.number || "",
      numberColor: banner.numberColor || "",
    });
    setSelectedBannerId(banner._id);
    setIsEditMode(true);
    setShowAddModal(true);
  };

  const handleDeleteBanner = async () => {
    if (!bannerToDelete) return;
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;
      const response = await axios.delete(
        `${backendUrl}/api/admin/deleteBanner/${bannerToDelete._id}`
      );
      if (response.data.success) {
        toast.success("Banner deleted successfully");
        await fetchBannerData();
      } else {
        toast.error(response.data.message || "Failed to delete banner");
      }
    } catch (error) {
      console.error("Error deleting banner:", error);
      toast.error(error.response?.data?.message || "Failed to delete banner");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setBannerToDelete(null);
    }
  };

  const handleDeleteClick = (banner) => {
    setBannerToDelete(banner);
    setShowDeleteModal(true);
  };

  const handleViewDetails = (banner) => {
    setSelectedBanner(banner);
    setShowDetailModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowAddModal(false);
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;

      const submissionData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "backgroundImage" && value && typeof value !== "string") {
          submissionData.append(key, value);
        } else if (key !== "courseTitle") {
          submissionData.append(key, value);
        }
      });

      let response;
      if (isEditMode) {
        response = await axios.put(
          `${backendUrl}/api/admin/updateBanner/${selectedBannerId}`,
          submissionData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        response = await axios.post(
          `${backendUrl}/api/admin/createBanner`,
          submissionData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }

      if (response.data.success) {
        toast.success(
          isEditMode
            ? "Banner updated successfully"
            : "Banner created successfully"
        );
        await fetchBannerData();
        setFormData({
          title: "",
          description: "",
          buttonText: "",
          buttonColor: "",
          backgroundImage: null,
          gradient: "",
          courseId: "",
          courseTitle: "",
          number: "",
          numberColor: "",
        });
        setIsEditMode(false);
        setSelectedBannerId(null);
      } else {
        toast.error(response.data.message || "Failed to save banner");
        setShowAddModal(true);
      }
    } catch (error) {
      console.error("Error saving banner:", error);
      toast.error(error.response?.data?.message || "Failed to save banner");
      setShowAddModal(true);
    } finally {
      setLoading(false);
    }
  };

  const bannersThisMonth = useMemo(() => {
    if (!Array.isArray(bannerData)) return 0;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return bannerData.filter((user) => {
      if (!user.createdAt) return false;
      const createdAt = new Date(user.createdAt);
      // Validate date
      if (isNaN(createdAt.getTime())) return false;
      return (
        createdAt.getMonth() === currentMonth &&
        createdAt.getFullYear() === currentYear
      );
    }).length;
  }, [bannerData]);

  return (
    <div className=" flex flex-col min-h-screen">
      <NavbarAdmin />
      <div className=" flex flex-1">
        <SidebarAdmin />

        <main className=" flex-1 p-5 md:ml-30">
          {/* Header Section */}
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Banner Management
            </h1>
            <p className="text-gray-600">Monitor and manage banner</p>
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
                    {bannerData.length}
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
                    New Banners This Month
                  </p>
                  <p className="text-xl lg:text-2xl font-bold text-orange-600">
                    {bannersThisMonth}
                  </p>
                </div>
                <div className="p-2 lg:p-3 bg-orange-100 rounded-full group-hover:bg-orange-200 transition-colors duration-300">
                  <Calendar className="w-5 h-5 lg:w-6 lg:h-6 text-orange-600" />
                </div>
              </div>
              {bannersThisMonth === 0 && (
                <p className="text-xs text-gray-500 mt-2 italic">
                  No banners added this month
                </p>
              )}
            </div>
          </div>

          {/* Enhanced Header */}
          <div className="p-4 lg:p-8 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 text-white rounded-xl lg:rounded-2xl border border-white/10 bg-opacity-90 backdrop-blur-lg shadow-xl mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 lg:mb-6">
              <div className="mb-4 lg:mb-0">
                <h2 className="text-xl lg:text-2xl font-bold mb-2">
                  Banners Directory
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
                    setShowAddModal(true);
                  }}
                >
                  <Plus
                    size={18}
                    className="group-hover:rotate-90 transition-transform duration-300"
                  />
                  <span className="font-semibold text-sm lg:text-base">
                    Add New Banner
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
              <AddBannerModal
                show={showAddModal}
                onClose={() => {
                  setShowAddModal(false);
                  setFormData({
                    title: "",
                    description: "",
                    buttonText: "",
                    buttonColor: "",
                    backgroundImage: null,
                    gradient: "",
                    courseId: "",
                    courseTitle: "",
                    number: "",
                    numberColor: "",
                  });
                  setIsEditMode(false);
                  setSelectedBannerId(null);
                }}
                formData={formData}
                setFormData={setFormData}
                loading={loading}
                isEditMode={isEditMode}
                handleSubmit={handleSubmit}
                courses={courses}
              />

              <DeleteBannerModal
                show={showDeleteModal}
                onClose={() => {
                  setShowDeleteModal(false);
                  setBannerToDelete(null);
                }}
                onConfirm={handleDeleteBanner}
              />

              <BannerDetailModal
                isOpen={showDetailModal}
                onClose={() => {
                  setShowDetailModal(false);
                  setSelectedBanner(null);
                }}
                bannerDetail={selectedBanner}
              />

              {/* Content Area */}
              <div className="bg-white rounded-xl shadow-md border border-gray-200">
                {/* Mobile Card View (default) / Desktop responsive view */}
                <div
                  className={`${
                    viewMode === "table" ? "hidden lg:block" : "block lg:hidden"
                  }`}
                >
                  <div className="p-4">
                    <div className="grid gap-4">
                      {currentItems.map((banner) => (
                        <ResponsiveBannerCard
                          key={banner._id}
                          banner={banner}
                          onView={handleViewDetails}
                          onEdit={handleEditBanner}
                          onDelete={handleDeleteClick}
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
                        {currentItems.map((banner) => (
                          <tr
                            key={banner._id}
                            className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-300 group"
                          >
                            <td className="p-6">
                              <div className="relative">
                                <img
                                  src={banner.backgroundImage}
                                  alt={banner.title}
                                  className="w-12 h-12 rounded-xl object-cover shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                                />
                              </div>
                            </td>
                            <td className="p-6">
                              <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                                {banner.title}
                              </div>
                            </td>

                            <td className="p-6">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-700">
                                  {banner.bannerId?.title || "N/A"}
                                </span>
                              </div>
                            </td>

                            <td className="p-6">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-700">
                                  {banner.number}
                                </span>
                              </div>
                            </td>

                            <td className="p-6">
                              <span className="text-gray-600 font-medium">
                                {new Date(banner.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )}
                              </span>
                            </td>
                            <td className="p-6">
                              <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                                <button
                                  className="p-2 rounded-xl hover:bg-blue-100 text-gray-500 hover:text-blue-600 transition-all duration-300"
                                  onClick={() => handleViewDetails(banner)}
                                >
                                  <Eye size={16} />
                                </button>
                                <button
                                  className="p-2 rounded-xl hover:bg-blue-100 text-gray-500 hover:text-blue-600 transition-all duration-300"
                                  onClick={() => handleEditBanner(banner)}
                                >
                                  <Pencil size={16} />
                                </button>
                                <button
                                  className="p-2 rounded-xl hover:bg-red-100 text-gray-500 hover:text-red-600 transition-all duration-300"
                                  onClick={() => {
                                    setBannerToDelete(banner);
                                    setShowDeleteModal(true);
                                  }}
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
                      {filteredBanners.length}
                    </span>{" "}
                    banners
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

export default BannerManagement;
