import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Search,
  Download,
  Eye,
  Calendar,
  BookOpen,
} from "lucide-react";
import axios from "axios";
import { AppContext } from "../../../context/AppContext"; // Giả sử bạn có context lưu user và backendUrl
import PdfViewer from "../../Teacher/PdfViewer";

const LectureMaterialsManagement = () => {
  const { user, backendUrl } = useContext(AppContext); // user._id là id học sinh hiện tại
  const [classes, setClasses] = useState([]);
  const [classData, setClassData] = useState([]);

  const [selectedClass, setSelectedClass] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Thêm state để quản lý PDF viewer
  const [pdfViewer, setPdfViewer] = useState({
    open: false,
    url: "",
    name: "",
  });

  // Thêm state để kiểm tra mobile view
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
        toast.error(data.message || "No timetable found");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load timetable data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassData();
  }, [backendUrl]);

  // Thêm useEffect để detect viewport size
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section - Cải thiện spacing cho mobile */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 md:mb-8 pt-4 md:pt-6"
      >
        <h1 className="text-xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 text-center md:text-left">
          Lecture Materials
        </h1>
        <p className="mt-2 text-sm md:text-base text-gray-600 text-center md:text-left">
          Access your course materials and resources
        </p>
      </motion.div>

      {/* Search Bar - Cải thiện UI cho mobile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 md:mb-8"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search materials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 md:py-3.5 bg-white rounded-xl shadow-sm border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
          />
        </div>
      </motion.div>

      {/* Classes Grid - Cải thiện layout cho mobile */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          {classData.length === 0 && (
            <div className="col-span-full text-center py-12 bg-white rounded-xl shadow-sm">
              <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">
                You are not enrolled in any class.
              </p>
            </div>
          )}
          {classData.map((cls) => (
            <motion.div
              key={cls._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: isMobileView ? 1 : 1.02 }}
              className={`
                bg-white rounded-xl shadow-sm p-4 md:p-6 cursor-pointer border-2
                ${
                  selectedClass?._id === cls._id
                    ? "border-blue-500"
                    : "border-transparent"
                }
                transition-all duration-200
              `}
              onClick={() => setSelectedClass(cls)}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <BookOpen className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {cls.className}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {cls.instructor?.name}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>
                    {cls.schedule?.daysOfWeek?.join(", ")} {cls.schedule?.shift}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FileText className="h-4 w-4 mr-2" />
                  <span>{cls.materials?.length || 0} materials</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Materials List - Cải thiện UI cho mobile */}
      {selectedClass && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-4 md:p-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-2">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900">
              {selectedClass.className} Materials
            </h2>
            <button
              onClick={() => setSelectedClass(null)}
              className="text-sm text-blue-600 hover:text-blue-700 md:hidden"
            >
              ← Back to Classes
            </button>
          </div>
          <div className="space-y-3 md:space-y-4">
            {(selectedClass.materials || [])
              .filter((material) =>
                material.name?.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((material) => (
                <motion.div
                  key={material._id || material.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors gap-3 sm:gap-4"
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="p-2 bg-blue-100 rounded-lg shrink-0">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-gray-900 text-sm md:text-base truncate">
                        {material.name}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-500 mt-0.5">
                        {material.uploadedAt
                          ? new Date(material.uploadedAt).toLocaleDateString()
                          : ""}
                        {material.size ? ` • ${material.size}` : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 ml-auto">
                    <button
                      onClick={() =>
                        setPdfViewer({
                          open: true,
                          url: material.url,
                          name: material.name,
                        })
                      }
                      className="p-2 hover:bg-blue-100 rounded-lg transition-colors flex-1 sm:flex-none"
                    >
                      <Eye className="h-5 w-5 text-blue-600" />
                    </button>
                    <a
                      href={material.url}
                      download={material.name}
                      className="p-2 hover:bg-green-100 rounded-lg transition-colors flex-1 sm:flex-none"
                    >
                      <Download className="h-5 w-5 text-green-600" />
                    </a>
                  </div>
                </motion.div>
              ))}
            {/* No materials message */}
            {(selectedClass.materials || []).filter((material) =>
              material.name?.toLowerCase().includes(searchQuery.toLowerCase())
            ).length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No materials found.</p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* PDF Viewer - Đã responsive by default */}
      {pdfViewer.open && (
        <PdfViewer
          fileUrl={pdfViewer.url}
          fileName={pdfViewer.name}
          onClose={() => setPdfViewer({ open: false, url: "", name: "" })}
        />
      )}
    </div>
  );
};

export default LectureMaterialsManagement;
