import React, { useContext, useEffect, useState } from "react";
import { Search, ChevronUp, Pencil, UserPlus, Trash2, Eye } from "lucide-react";
import { AppContext } from "../../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../../Loading";
import AddBannerModal from "../bannerManagement/AddBannerModal";
import DeleteBannerModal from "../bannerManagement/DeleteBannerModal";
import BannerDetailModal from "./BannerDetailModal";

const TABS = [
  { label: "All", value: "all" },
  { label: "Newest", value: "newBanner" },
];

const TABLE_HEAD = [
  "Background Image",
  "Title",
  "Description",
  "Course",
  "Number",
  "Created At",
  "Actions",
];

const BannerTableList = () => {
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

  return (
    <div className="w-full bg-white rounded-lg shadow-md border border-gray-200">
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

      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h5 className="text-xl font-bold text-gray-800">Banner List</h5>
            <p className="text-sm text-gray-600 mt-1">
              Manage all banners for courses
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
              onClick={() => {
                setIsEditMode(false);
                setShowAddModal(true);
              }}
            >
              <UserPlus size={16} /> Add Banner
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex gap-2 w-full md:w-auto">
            {TABS.map(({ label, value }) => (
              <button
                key={value}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                {label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search banners..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loading />
        </div>
      ) : currentItems.length === 0 ? (
        <div className="p-4 text-center text-gray-500">No banners found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-y border-gray-200">
                {TABLE_HEAD.map((head, index) => (
                  <th
                    key={head}
                    className="p-4 text-sm font-semibold text-gray-700"
                  >
                    <div className="flex items-center gap-2">
                      {head}
                      {index !== TABLE_HEAD.length - 1 && (
                        <ChevronUp size={16} className="text-gray-500" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentItems.map((banner) => (
                <tr
                  key={banner._id}
                  className="hover:bg-gray-50 transition-all"
                >
                  <td className="p-4">
                    <img
                      src={banner.backgroundImage}
                      alt={banner.title}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="p-4 text-sm font-medium text-gray-800">
                    {banner.title || "N/A"}
                  </td>
                  <td className="p-4 text-sm text-gray-700">
                    {banner.description?.substring(0, 50) || "N/A"}
                    {banner.description?.length > 50 && "..."}
                  </td>
                  <td className="p-4 text-sm text-gray-700">
                    {banner.courseId?.title || "N/A"}
                  </td>
                  <td className="p-4 text-sm text-gray-700">
                    {banner.number || "N/A"}
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {banner.createdAt
                      ? new Date(banner.createdAt).toLocaleDateString("en-GB")
                      : "N/A"}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="text-gray-600 hover:text-blue-600 mr-2"
                        onClick={() => handleViewDetails(banner)}
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="text-gray-600 hover:text-blue-600 mr-2"
                        onClick={() => handleEditBanner(banner)}
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => {
                          setBannerToDelete(banner);
                          setShowDeleteModal(true);
                        }}
                        title="Delete"
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
      )}

      <div className="flex items-center justify-between p-4 border-t border-gray-200">
        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages || 1}
        </span>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default BannerTableList;
