import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import Navbar from "../../Components/Teacher/NavBar";
import Loading from "../../Components/Loading";
import Sidebar from "../../Components/Teacher/SideBar";
import {
  FolderOpen,
  File,
  Upload,
  ChevronRight,
  ChevronDown,
  Trash2,
  Download,
} from "lucide-react";

function LectureMaterials() {
  const { backendUrl, user } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState({});
  const [isDragging, setIsDragging] = useState(false);

  // Fetch classes từ API
  const fetchClasses = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/admin/getClasses`, {
        withCredentials: true,
      });
      if (data.success && Array.isArray(data.classes)) {
        const filteredClasses = data.classes.filter(
          (cls) =>
            cls.instructor &&
            cls.instructor.id &&
            user &&
            String(cls.instructor.id) === String(user._id)
        );
        // Thêm trường materials nếu chưa có
        const classesWithMaterials = filteredClasses.map((cls) => ({
          ...cls,
          materials: cls.materials || [], // Nếu API trả về materials thì dùng, không thì mảng rỗng
        }));
        setClasses(classesWithMaterials);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchClasses();
    }
  }, [backendUrl, user]);

  const toggleFolder = (classId) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [classId]: !prev[classId],
    }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e, classId) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);

    try {
      const uploadedMaterials = await Promise.all(
        files.map((file) => uploadFile(file, classId))
      );

      // Cập nhật danh sách tài liệu của lớp
      setClasses((prevClasses) =>
        prevClasses.map((cls) =>
          cls._id === classId
            ? { ...cls, materials: [...cls.materials, ...uploadedMaterials] }
            : cls
        )
      );
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const handleFileSelect = async (e, classId) => {
    const files = Array.from(e.target.files);

    try {
      const uploadedMaterials = await Promise.all(
        files.map((file) => uploadFile(file, classId))
      );

      // Cập nhật danh sách tài liệu của lớp
      setClasses((prevClasses) =>
        prevClasses.map((cls) =>
          cls._id === classId
            ? { ...cls, materials: [...cls.materials, ...uploadedMaterials] }
            : cls
        )
      );
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const uploadFile = async (file, classId) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/class/${classId}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      return data.material; // Trả về thông tin tài liệu đã upload
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-8 ml-25">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Lecture Materials
          </h1>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loading />
            </div>
          ) : classes.length === 0 ? (
            <div className="text-center text-gray-500">No classes found.</div>
          ) : (
            <div className="flex gap-6">
              {/* Left Side - Folder Structure */}
              <div className="w-1/3 bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                  Classes
                </h2>
                <div className="space-y-2">
                  {classes.map((cls) => (
                    <div key={cls._id} className="select-none">
                      <div
                        className={`flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-50 ${
                          selectedClass === cls._id ? "bg-blue-50" : ""
                        }`}
                        onClick={() => {
                          setSelectedClass(cls._id);
                          toggleFolder(cls._id);
                        }}
                      >
                        {expandedFolders[cls._id] ? (
                          <ChevronDown
                            size={20}
                            className="text-gray-500 mr-2"
                          />
                        ) : (
                          <ChevronRight
                            size={20}
                            className="text-gray-500 mr-2"
                          />
                        )}
                        <FolderOpen
                          size={20}
                          className="text-yellow-500 mr-2"
                        />
                        <span className="text-gray-700">{cls.className}</span>
                        <span className="ml-auto text-sm text-gray-500">
                          ({cls.materials?.length || 0})
                        </span>
                      </div>
                      {expandedFolders[cls._id] && (
                        <div className="ml-9 mt-2 space-y-1">
                          {cls.materials?.map((material) => (
                            <div
                              key={material.id}
                              className="flex items-center p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                            >
                              <File size={16} className="text-blue-500 mr-2" />
                              <span>{material.name}</span>
                              <div className="ml-auto flex items-center gap-2">
                                <Download
                                  size={16}
                                  className="text-gray-400 hover:text-blue-500 cursor-pointer"
                                />
                                <Trash2
                                  size={16}
                                  className="text-gray-400 hover:text-red-500 cursor-pointer"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side - Upload Area */}
              {selectedClass && (
                <div className="w-2/3 bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-700 mb-4">
                    Upload Materials for{" "}
                    {classes.find((c) => c._id === selectedClass)?.className}
                  </h2>
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center ${
                      isDragging
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-blue-500"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, selectedClass)}
                  >
                    <Upload
                      size={48}
                      className={`mx-auto mb-4 ${
                        isDragging ? "text-blue-500" : "text-gray-400"
                      }`}
                    />
                    <p className="text-gray-600 mb-2">
                      Drag and drop your files here, or
                    </p>
                    <label className="inline-block">
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf"
                        multiple
                        onChange={(e) => handleFileSelect(e, selectedClass)}
                      />
                      <span className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors">
                        Browse Files
                      </span>
                    </label>
                    <p className="text-sm text-gray-500 mt-2">
                      Supported file type: PDF
                    </p>
                  </div>

                  {/* Recently Uploaded Files */}
                  <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-700 mb-4">
                      Uploaded Materials
                    </h3>
                    {classes
                      .find((c) => c._id === selectedClass)
                      ?.materials.map((material) => (
                        <div
                          key={material.url}
                          className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center">
                            <File size={20} className="text-blue-500 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-700">
                                {material.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                Uploaded on{" "}
                                {new Date(
                                  material.uploadedAt
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <a
                              href={material.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 hover:text-blue-500"
                            >
                              <Download size={18} />
                            </a>
                            <button className="p-1 hover:text-red-500">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LectureMaterials;
