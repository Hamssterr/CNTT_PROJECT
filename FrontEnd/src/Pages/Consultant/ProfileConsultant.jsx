import { useState, useCallback, useEffect, useContext } from "react";
import {
  Edit2,
  Plus,
  Moon,
  Sun,
  MapPin,
  Phone,
  Mail,
  Building,
  GraduationCap,
  User,
  Trash2,
} from "lucide-react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../../Components/Loading";

const UserProfile = () => {
  const { backendUrl } = useContext(AppContext);
  const [darkMode, setDarkMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [profileImage, setProfileImage] = useState(
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
  );
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [idCounter, setIdCounter] = useState(0);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    phoneNumber: "",
    address: {
      houseNumber: "",
      street: "",
      ward: "",
      district: "",
      city: "",
      province: "",
      country: "",
    },
    degree: [],
    experience: [],
  });

  // Fetching profile data
  const fetchingProfileData = async () => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;

      const { data } = await axios.get(`${backendUrl}/api/consultant/profile`);

      console.log("Get Data:", data);
      if (data.success) {
        setFormData({
          firstName: data.data.firstName || "",
          lastName: data.data.lastName || "",
          email: data.data.email || "",
          role: data.data.role || "",
          phoneNumber: data.data.phoneNumber || "",
          address: {
            houseNumber: data.data.address?.houseNumber || "",
            street: data.data.address?.street || "",
            ward: data.data.address?.ward || "",
            district: data.data.address?.district || "",
            city: data.data.address?.city || "",
            province: data.data.address?.province || "",
            country: data.data.address?.country || "",
          },
          degree: Array.isArray(data.data.degree)
            ? data.data.degree.map((deg, index) => ({
                ...deg,
                id: deg.id || `deg-${index}-${Date.now()}`,
              }))
            : [],
          experience: Array.isArray(data.data.experience)
            ? data.data.experience.map((exp, index) => ({
                ...exp,
                id: exp.id || `exp-${index}-${Date.now()}`,
              }))
            : [],
        });
        setProfileImage(data.data.profileImage || profileImage);
      } else {
        toast.error(data.message || "No data received");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchingProfileData();
  }, []);

  const handleImageUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("File size exceeds 5MB or invalid file type");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append("data", JSON.stringify(formData));
      if (profileImageFile) {
        formDataToSend.append("profileImage", profileImageFile);
      }

      const response = await axios.put(
        `${backendUrl}/api/consultant/profile`,
        formDataToSend,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.success) {
        toast.success("Profile updated successfully");
        setFormData({
          firstName: response.data.data.firstName || "",
          lastName: response.data.data.lastName || "",
          email: response.data.data.email || "",
          role: response.data.data.role || "",
          phoneNumber: response.data.data.phoneNumber || "",
          address: {
            houseNumber: response.data.data.address?.houseNumber || "",
            street: response.data.data.address?.street || "",
            ward: response.data.data.address?.ward || "",
            district: response.data.data.address?.district || "",
            city: response.data.data.address?.city || "",
            province: response.data.data.address?.province || "",
            country: response.data.data.address?.country || "",
          },
          degree: Array.isArray(response.data.data.degree)
            ? response.data.data.degree.map((deg, index) => ({
                ...deg,
                id: deg.id || `deg-${index}-${Date.now()}`,
              }))
            : [],
          experience: Array.isArray(response.data.data.experience)
            ? response.data.data.experience.map((exp, index) => ({
                ...exp,
                id: exp.id || `exp-${index}-${Date.now()}`,
              }))
            : [],
        });
        setProfileImage(response.data.data.profileImage || profileImage);
        setProfileImageFile(null);
        setEditMode(false);
      } else {
        toast.error(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const addDegree = () => {
    setFormData((prev) => ({
      ...prev,
      degree: [
        ...(prev.degree || []),
        {
          id: `deg-${idCounter}-${Date.now()}`,
          name: "",
          institution: "",
          year: new Date().getFullYear().toString(),
          major: "",
        },
      ],
    }));
    setIdCounter((prev) => prev + 1);
  };

  const addExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experience: [
        ...(prev.experience || []),
        {
          id: `exp-${idCounter}-${Date.now()}`,
          position: "",
          company: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    }));
    setIdCounter((prev) => prev + 1);
  };

  const removeDegree = (index) => {
    setFormData((prev) => ({
      ...prev,
      degree: prev.degree.filter((_, i) => i !== index),
    }));
  };

  const removeExperience = (index) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const formatAddress = (address) => {
    if (!address) return "";
    const parts = [
      address.houseNumber,
      address.street,
      address.ward,
      address.district,
      address.city,
      address.province,
      address.country,
    ].filter(Boolean);
    return parts.join(", ");
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";

    try {
      // Tạo Date object từ ISO string
      const date = new Date(dateString);

      // Check if date is valid
      if (isNaN(date.getTime())) return "";

      // Format thành YYYY-MM-DD
      return date.toISOString().split("T")[0];
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
          : "bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-gray-900"
      }`}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => (window.location.href = "/consultant/dashboard")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-white hover:bg-gray-100 text-gray-700"
            } shadow-lg hover:shadow-xl`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span className="font-medium">Back</span>
          </button>

          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            User Profile
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-3 rounded-full transition-all duration-300 ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-white hover:bg-gray-100"
            } shadow-lg hover:shadow-xl`}
          >
            {darkMode ? (
              <Sun className="w-6 h-6 text-yellow-400" />
            ) : (
              <Moon className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div
              className={`rounded-2xl shadow-2xl p-8 transition-all duration-300 ${
                darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
              }`}
            >
              {/* Profile Image */}
              <div className="relative group mb-6">
                <div className="w-40 h-40 mx-auto rounded-full overflow-hidden shadow-lg ring-4 ring-blue-500/20">
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                {editMode && (
                  <label className="absolute bottom-2 right-2 bg-blue-500 p-3 rounded-full text-white cursor-pointer hover:bg-blue-600 transition-colors shadow-lg">
                    <Edit2 className="w-4 h-4" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>

              {/* Basic Info */}
              <div className="text-center space-y-3">
                <h2 className="text-2xl font-bold">{`${formData.firstName} ${formData.lastName}`}</h2>
                <div className="flex items-center justify-center space-x-2 text-blue-600">
                  <User className="w-4 h-4" />
                  <span className="capitalize font-medium">
                    {formData.role}
                  </span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-300">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{formData.email}</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-300">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{formData.phoneNumber}</span>
                </div>
                <div className="flex items-start justify-center space-x-2 text-gray-600 dark:text-gray-300">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-center">
                    {formatAddress(formData.address)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div
                className={`rounded-2xl shadow-xl p-8 transition-all duration-300 ${
                  darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
                }`}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold flex items-center space-x-2">
                    <User className="w-6 h-6 text-blue-500" />
                    <span>Personal Information</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setEditMode(!editMode)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    disabled={loading}
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>{editMode ? "Cancel Edit" : "Edit Profile"}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={formData.firstName || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          firstName: e.target.value,
                        }))
                      }
                      disabled={!editMode || loading}
                      className={`w-full p-3 border-2 rounded-lg transition-all ${
                        editMode
                          ? "border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          : "border-gray-300"
                      } ${
                        darkMode
                          ? "bg-gray-700 text-white"
                          : "bg-white text-gray-900"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={formData.lastName || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          lastName: e.target.value,
                        }))
                      }
                      disabled={!editMode || loading}
                      className={`w-full p-3 border-2 rounded-lg transition-all ${
                        editMode
                          ? "border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          : "border-gray-300"
                      } ${darkMode ? "bg-gray-700 text-white" : "bg-white"}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      disabled={!editMode || loading}
                      className={`w-full p-3 border-2 rounded-lg transition-all ${
                        editMode
                          ? "border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          : "border-gray-300"
                      } ${darkMode ? "bg-gray-700 text-white" : "bg-white"}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phoneNumber || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          phoneNumber: e.target.value,
                        }))
                      }
                      disabled={!editMode || loading}
                      className={`w-full p-3 border-2 rounded-lg transition-all ${
                        editMode
                          ? "border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          : " border-gray-300"
                      } ${darkMode ? "bg-gray-700 text-white" : "bg-white"}`}
                    />
                  </div>
                </div>

                {/* Address Section */}
                <div className="mt-8">
                  <h4 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-green-500" />
                    <span>Address Information</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        House Number
                      </label>
                      <input
                        type="text"
                        value={formData.address?.houseNumber || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            address: {
                              ...prev.address,
                              houseNumber: e.target.value,
                            },
                          }))
                        }
                        disabled={!editMode || loading}
                        className={`w-full p-3 border-2 rounded-lg transition-all ${
                          editMode
                            ? "border-blue-300 focus:border-blue-500"
                            : " border-gray-300"
                        } ${darkMode ? "bg-gray-700 text-white" : "bg-white"}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Street
                      </label>
                      <input
                        type="text"
                        value={formData.address?.street || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            address: {
                              ...prev.address,
                              street: e.target.value,
                            },
                          }))
                        }
                        disabled={!editMode || loading}
                        className={`w-full p-3 border-2 rounded-lg transition-all ${
                          editMode
                            ? "border-blue-300 focus:border-blue-500"
                            : " border-gray-300"
                        } ${darkMode ? "bg-gray-700 text-white" : "bg-white"}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Ward
                      </label>
                      <input
                        type="text"
                        value={formData.address?.ward || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            address: { ...prev.address, ward: e.target.value },
                          }))
                        }
                        disabled={!editMode || loading}
                        className={`w-full p-3 border-2 rounded-lg transition-all ${
                          editMode
                            ? "border-blue-300 focus:border-blue-500"
                            : " border-gray-300"
                        } ${darkMode ? "bg-gray-700 text-white" : "bg-white"}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        District
                      </label>
                      <input
                        type="text"
                        value={formData.address?.district || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            address: {
                              ...prev.address,
                              district: e.target.value,
                            },
                          }))
                        }
                        disabled={!editMode || loading}
                        className={`w-full p-3 border-2 rounded-lg transition-all ${
                          editMode
                            ? "border-blue-300 focus:border-blue-500"
                            : " border-gray-300"
                        } ${darkMode ? "bg-gray-700 text-white" : "bg-white"}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={formData.address?.city || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            address: { ...prev.address, city: e.target.value },
                          }))
                        }
                        disabled={!editMode || loading}
                        className={`w-full p-3 border-2 rounded-lg transition-all ${
                          editMode
                            ? "border-blue-300 focus:border-blue-500"
                            : " border-gray-300"
                        } ${darkMode ? "bg-gray-700 text-white" : "bg-white"}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        value={formData.address?.country || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            address: {
                              ...prev.address,
                              country: e.target.value,
                            },
                          }))
                        }
                        disabled={!editMode || loading}
                        className={`w-full p-3 border-2 rounded-lg transition-all ${
                          editMode
                            ? "border-blue-300 focus:border-blue-500"
                            : " border-gray-300"
                        } ${darkMode ? "bg-gray-700 text-white" : "bg-white"}`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Education Section */}
              <div
                className={`rounded-2xl shadow-xl p-8 transition-all duration-300 ${
                  darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
                }`}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold flex items-center space-x-2">
                    <GraduationCap className="w-6 h-6 text-purple-500" />
                    <span>Education</span>
                  </h3>
                  {editMode && (
                    <button
                      type="button"
                      onClick={addDegree}
                      className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                      disabled={loading}
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Degree</span>
                    </button>
                  )}
                </div>
                <div className="space-y-6">
                  {(formData.degree || []).map((degree, index) => (
                    <div
                      key={degree.id || `deg-${index}-${Date.now()}`}
                      className={`p-6 border-2 rounded-xl ${
                        darkMode
                          ? "border-gray-600 bg-gray-700"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      {editMode && (
                        <div className="flex justify-end mb-4">
                          <button
                            type="button"
                            onClick={() => removeDegree(index)}
                            className="text-red-500 hover:text-red-700 p-2"
                            disabled={loading}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Degree Name
                          </label>
                          <input
                            type="text"
                            value={degree.name || ""}
                            onChange={(e) =>
                              setFormData((prev) => {
                                const newDegree = [...(prev.degree || [])];
                                newDegree[index] = {
                                  ...newDegree[index],
                                  name: e.target.value,
                                };
                                return { ...prev, degree: newDegree };
                              })
                            }
                            disabled={!editMode || loading}
                            className={`w-full p-3 border rounded-lg ${
                              darkMode
                                ? "bg-gray-600 border-gray-500 text-white"
                                : "bg-white border-gray-300"
                            }`}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Institution
                          </label>
                          <input
                            type="text"
                            value={degree.institution || ""}
                            onChange={(e) =>
                              setFormData((prev) => {
                                const newDegree = [...(prev.degree || [])];
                                newDegree[index] = {
                                  ...newDegree[index],
                                  institution: e.target.value,
                                };
                                return { ...prev, degree: newDegree };
                              })
                            }
                            disabled={!editMode || loading}
                            className={`w-full p-3 border rounded-lg ${
                              darkMode
                                ? "bg-gray-600 border-gray-500 text-white"
                                : "bg-white border-gray-300"
                            }`}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Graduation Year
                          </label>
                          <input
                            type="number"
                            value={degree.year || ""}
                            onChange={(e) =>
                              setFormData((prev) => {
                                const newDegree = [...(prev.degree || [])];
                                newDegree[index] = {
                                  ...newDegree[index],
                                  year: e.target.value,
                                };
                                return { ...prev, degree: newDegree };
                              })
                            }
                            disabled={!editMode || loading}
                            className={`w-full p-3 border rounded-lg ${
                              darkMode
                                ? "bg-gray-600 border-gray-500 text-white"
                                : "bg-white border-gray-300"
                            }`}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Major
                          </label>
                          <input
                            type="text"
                            value={degree.major || ""}
                            onChange={(e) =>
                              setFormData((prev) => {
                                const newDegree = [...(prev.degree || [])];
                                newDegree[index] = {
                                  ...newDegree[index],
                                  major: e.target.value,
                                };
                                return { ...prev, degree: newDegree };
                              })
                            }
                            disabled={!editMode || loading}
                            className={`w-full p-3 border rounded-lg ${
                              darkMode
                                ? "bg-gray-600 border-gray-500 text-white"
                                : "bg-white border-gray-300"
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience Section */}
              <div
                className={`rounded-2xl shadow-xl p-8 transition-all duration-300 ${
                  darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
                }`}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold flex items-center space-x-2">
                    <Building className="w-6 h-6 text-green-500" />
                    <span>Professional Experience</span>
                  </h3>
                  {editMode && (
                    <button
                      type="button"
                      onClick={addExperience}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      disabled={loading}
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Experience</span>
                    </button>
                  )}
                </div>
                <div className="space-y-6">
                  {(formData.experience || []).map((exp, index) => (
                    <div
                      key={exp.id || `exp-${index}-${Date.now()}`}
                      className={`p-6 border-2 rounded-xl ${
                        darkMode
                          ? "border-gray-600 bg-gray-700"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      {editMode && (
                        <div className="flex justify-end mb-4">
                          <button
                            type="button"
                            onClick={() => removeExperience(index)}
                            className="text-red-500 hover:text-red-700 p-2"
                            disabled={loading}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Position
                          </label>
                          <input
                            type="text"
                            value={exp.position || ""}
                            onChange={(e) =>
                              setFormData((prev) => {
                                const newExperience = [
                                  ...(prev.experience || []),
                                ];
                                newExperience[index] = {
                                  ...newExperience[index],
                                  position: e.target.value,
                                };
                                return { ...prev, experience: newExperience };
                              })
                            }
                            disabled={!editMode || loading}
                            className={`w-full p-3 border rounded-lg ${
                              darkMode
                                ? "bg-gray-600 border-gray-500 text-white"
                                : "bg-white border-gray-300"
                            }`}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Company
                          </label>
                          <input
                            type="text"
                            value={exp.company || ""}
                            onChange={(e) =>
                              setFormData((prev) => {
                                const newExperience = [
                                  ...(prev.experience || []),
                                ];
                                newExperience[index] = {
                                  ...newExperience[index],
                                  company: e.target.value,
                                };
                                return { ...prev, experience: newExperience };
                              })
                            }
                            disabled={!editMode || loading}
                            className={`w-full p-3 border rounded-lg ${
                              darkMode
                                ? "bg-gray-600 border-gray-500 text-white"
                                : "bg-white border-gray-300"
                            }`}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Start Date
                          </label>
                          <input
                            type="date"
                            value={formatDateForInput(exp.startDate)}
                            onChange={(e) =>
                              setFormData((prev) => {
                                const newExperience = [
                                  ...(prev.experience || []),
                                ];
                                newExperience[index] = {
                                  ...newExperience[index],
                                  startDate: e.target.value
                                    ? new Date(e.target.value).toISOString()
                                    : null,
                                };
                                return { ...prev, experience: newExperience };
                              })
                            }
                            disabled={!editMode || loading}
                            className={`w-full p-3 border rounded-lg ${
                              darkMode
                                ? "bg-gray-600 border-gray-500 text-white"
                                : "bg-white border-gray-300"
                            }`}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            End Date (Leave empty if current)
                          </label>
                          <input
                            type="date"
                            value={formatDateForInput(exp.endDate)}
                            onChange={(e) =>
                              setFormData((prev) => {
                                const newExperience = [
                                  ...(prev.experience || []),
                                ];
                                newExperience[index] = {
                                  ...newExperience[index],
                                  endDate: e.target.value,
                                };
                                return { ...prev, experience: newExperience };
                              })
                            }
                            disabled={!editMode || loading}
                            className={`w-full p-3 border rounded-lg ${
                              darkMode
                                ? "bg-gray-600 border-gray-500 text-white"
                                : "bg-white border-gray-300"
                            }`}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium mb-2">
                            Description
                          </label>
                          <textarea
                            rows="3"
                            value={exp.description || ""}
                            onChange={(e) =>
                              setFormData((prev) => {
                                const newExperience = [
                                  ...(prev.experience || []),
                                ];
                                newExperience[index] = {
                                  ...newExperience[index],
                                  description: e.target.value,
                                };
                                return { ...prev, experience: newExperience };
                              })
                            }
                            disabled={!editMode || loading}
                            className={`w-full p-3 border rounded-lg ${
                              darkMode
                                ? "bg-gray-600 border-gray-500 text-white"
                                : "bg-white border-gray-300"
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              {editMode && (
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
