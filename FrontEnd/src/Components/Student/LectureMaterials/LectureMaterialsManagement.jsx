import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Search,
  Download,
  Eye,
  Calendar,
  BookOpen,
  Sparkles,
  GraduationCap,
  User,
  Clock,
  Filter,
  ChevronDown,
  ArrowLeft,
  Star,
  RefreshCw,
  Grid3X3,
  List,
  FolderOpen,
} from "lucide-react";
import axios from "axios";
import { AppContext } from "../../../context/AppContext";
import { toast } from "react-toastify";
import PdfViewer from "../../Teacher/PdfViewer";

const LectureMaterialsManagement = () => {
  const { user, backendUrl } = useContext(AppContext);
  const [classes, setClasses] = useState([]);
  const [classData, setClassData] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [showFilters, setShowFilters] = useState(false);

  // PDF viewer state
  const [pdfViewer, setPdfViewer] = useState({
    open: false,
    url: "",
    name: "",
  });

  // Mobile view state
  const [isMobileView, setIsMobileView] = useState(false);

  const fetchClassData = async () => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;

      const response = await axios.get(
        `${backendUrl}/api/student/getClassByIdStudent`
      );
      const { data } = response;
      if (data.success && Array.isArray(data.classes)) {
        setClassData(data.classes);
      } else {
        setClassData([]);
        toast.error(data.message || "No classes found");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load class data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassData();
  }, [backendUrl]);

  // Detect viewport size
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getFileTypeColor = (fileName) => {
    const extension = fileName?.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return "from-red-500 to-red-600";
      case "doc":
      case "docx":
        return "from-blue-500 to-blue-600";
      case "ppt":
      case "pptx":
        return "from-orange-500 to-orange-600";
      case "xls":
      case "xlsx":
        return "from-green-500 to-green-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const formatFileSize = (size) => {
    if (!size) return "Unknown size";
    if (typeof size === "string") return size;
    const units = ["B", "KB", "MB", "GB"];
    let unitIndex = 0;
    let fileSize = size;

    while (fileSize >= 1024 && unitIndex < units.length - 1) {
      fileSize /= 1024;
      unitIndex++;
    }

    return `${fileSize.toFixed(1)} ${units[unitIndex]}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your materials...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-[50px]">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Lecture Materials
                  </h1>
                  <p className="text-gray-500 mt-1">
                    Access your course materials and study resources
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full">
                      {classData.length} classes
                    </span>
                    <span className="text-sm text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full flex items-center gap-1">
                      <GraduationCap className="w-3 h-3" />
                      Study Hub
                    </span>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchClassData}
                className="p-3 bg-blue-100 hover:bg-blue-200 rounded-xl transition-all duration-200 group"
                title="Refresh materials"
              >
                <RefreshCw className="w-5 h-5 text-blue-600 group-hover:rotate-180 transition-transform duration-500" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search materials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setViewMode("grid")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                    viewMode === "grid"
                      ? "bg-white text-blue-600 shadow-md"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                  Grid
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setViewMode("list")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                    viewMode === "list"
                      ? "bg-white text-blue-600 shadow-md"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <List className="w-4 h-4" />
                  List
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Back Button (Mobile) */}
        {selectedClass && isMobileView && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <button
              onClick={() => setSelectedClass(null)}
              className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Classes
            </button>
          </motion.div>
        )}

        {/* Classes Grid */}
        {!selectedClass || !isMobileView ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Your Classes
                  </h2>
                  <p className="text-sm text-gray-600">
                    Select a class to view materials
                  </p>
                </div>
              </div>

              {classData.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BookOpen className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    No Classes Found
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    You are not enrolled in any classes yet. Contact your
                    administrator to get enrolled.
                  </p>
                </motion.div>
              ) : (
                <div
                  className={`grid gap-6 ${
                    viewMode === "grid"
                      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                      : "grid-cols-1"
                  }`}
                >
                  {classData.map((cls, index) => (
                    <motion.div
                      key={cls._id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: isMobileView ? 1 : 1.02 }}
                      className={`group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 cursor-pointer ${
                        selectedClass?._id === cls._id
                          ? "border-blue-500 ring-2 ring-blue-200"
                          : "border-gray-100 hover:border-blue-300"
                      }`}
                      onClick={() => setSelectedClass(cls)}
                    >
                      {/* Class Header */}
                      <div className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                              <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            {selectedClass?._id === cls._id && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                <Star className="w-2 h-2 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors text-lg">
                              {cls.className}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {cls.courseId?.title || "Course"}
                            </p>
                          </div>
                        </div>

                        {/* Class Details */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                              <User className="w-4 h-4 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-medium">
                                Instructor
                              </p>
                              <p className="text-sm font-semibold text-gray-800">
                                {cls.instructor?.name || "N/A"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                              <Calendar className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-medium">
                                Schedule
                              </p>
                              <p className="text-sm font-semibold text-gray-800">
                                {cls.schedule?.daysOfWeek?.join(", ") || "N/A"}{" "}
                                • {cls.schedule?.shift || "N/A"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                              <FileText className="w-4 h-4 text-orange-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-medium">
                                Materials
                              </p>
                              <p className="text-sm font-semibold text-gray-800">
                                {cls.materials?.length || 0} files available
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Hover effect overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/5 to-purple-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"></div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ) : null}

        {/* Materials List */}
        {selectedClass && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {selectedClass.className} Materials
                  </h2>
                  <p className="text-sm text-gray-600">
                    {
                      (selectedClass.materials || []).filter((material) =>
                        material.name
                          ?.toLowerCase()
                          .includes(searchQuery.toLowerCase())
                      ).length
                    }{" "}
                    materials found
                  </p>
                </div>
              </div>

              {!isMobileView && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedClass(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200"
                >
                  Back to Classes
                </motion.button>
              )}
            </div>

            <div className="space-y-4">
              {(selectedClass.materials || [])
                .filter((material) =>
                  material.name
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase())
                )
                .map((material, index) => (
                  <motion.div
                    key={material._id || material.id || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 gap-4"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        className={`p-3 bg-gradient-to-br ${getFileTypeColor(
                          material.name
                        )} rounded-xl shadow-md`}
                      >
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 truncate group-hover:text-blue-600 transition-colors">
                          {material.name}
                        </h3>
                        <div className="flex items-center gap-4 mt-1">
                          <p className="text-sm text-gray-500">
                            {material.uploadedAt
                              ? new Date(
                                  material.uploadedAt
                                ).toLocaleDateString()
                              : "Unknown date"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() =>
                          setPdfViewer({
                            open: true,
                            url: material.url,
                            name: material.name,
                          })
                        }
                        className="p-3 hover:bg-blue-100 rounded-xl transition-all duration-200 group/btn"
                        title="Preview file"
                      >
                        <Eye className="w-5 h-5 text-blue-600 group-hover/btn:scale-110 transition-transform" />
                      </motion.button>

                      <motion.a
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        href={material.url}
                        download={material.name}
                        className="p-3 hover:bg-green-100 rounded-xl transition-all duration-200 group/btn"
                        title="Download file"
                      >
                        <Download className="w-5 h-5 text-green-600 group-hover/btn:scale-110 transition-transform" />
                      </motion.a>
                    </div>
                  </motion.div>
                ))}

              {/* No materials message */}
              {(selectedClass.materials || []).filter((material) =>
                material.name?.toLowerCase().includes(searchQuery.toLowerCase())
              ).length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileText className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {searchQuery
                      ? "No materials found"
                      : "No materials available"}
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    {searchQuery
                      ? "Try adjusting your search terms or check back later."
                      : "Your instructor hasn't uploaded any materials for this class yet."}
                  </p>
                  {searchQuery && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSearchQuery("")}
                      className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 font-medium transition-all duration-200"
                    >
                      Clear search
                    </motion.button>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* PDF Viewer */}
        <AnimatePresence>
          {pdfViewer.open && (
            <PdfViewer
              fileUrl={pdfViewer.url}
              fileName={pdfViewer.name}
              onClose={() => setPdfViewer({ open: false, url: "", name: "" })}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LectureMaterialsManagement;
