import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import Navbar from "../../Components/Teacher/NavBar";
import Loading from "../../Components/Loading";
import Sidebar from "../../Components/Teacher/SideBar";
import UploadProgress from "../../Components/Teacher/UploadProgress";
import {
  FolderOpen,
  File,
  Upload,
  ChevronRight,
  ChevronDown,
  Trash2,
  Download,
  Eye,
} from "lucide-react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { AlertTriangle } from "lucide-react";
import PdfViewer from "../../Components/Teacher/PdfViewer";

function LectureMaterials() {
  const { backendUrl, user } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadStatus, setUploadStatus] = useState({});
  const [pdfViewer, setPdfViewer] = useState({
    open: false,
    url: "",
    name: "",
  });
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    materialId: null,
    className: "",
    classId: null,
    materialName: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showFolderView, setShowFolderView] = useState(true);

  // Thêm state để theo dõi files đang upload
  const [uploadingFiles, setUploadingFiles] = useState([]);

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

  const uploadFile = async (file, classId) => {
    const formData = new FormData();
    formData.append("file", file);

    // Thêm file vào danh sách đang upload
    setUploadingFiles((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: file.name,
        progress: 0,
        status: "uploading",
      },
    ]);

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/class/${classId}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            // Cập nhật progress cho file
            setUploadingFiles((prev) =>
              prev.map((f) =>
                f.name === file.name ? { ...f, progress: percentCompleted } : f
              )
            );
          },
        }
      );

      // Cập nhật trạng thái thành công
      setUploadingFiles((prev) =>
        prev.map((f) =>
          f.name === file.name
            ? { ...f, status: "completed", progress: 100 }
            : f
        )
      );

      // Tự động xóa file khỏi danh sách sau 3 giây
      setTimeout(() => {
        setUploadingFiles((prev) => prev.filter((f) => f.name !== file.name));
      }, 3000);

      return data.material;
    } catch (error) {
      // Cập nhật trạng thái lỗi
      setUploadingFiles((prev) =>
        prev.map((f) => (f.name === file.name ? { ...f, status: "error" } : f))
      );
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  const handleFileSelect = async (e, classId) => {
    const files = Array.from(e.target.files);

    // Validate files
    const validFiles = files.filter((file) => {
      const isValidType = file.type === "application/pdf";
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      toast.error(
        "Some files were skipped. Only PDF files under 5MB are allowed."
      );
    }

    let uploadError = false;

    try {
      // Upload từng file, nếu lỗi thì chỉ báo lỗi cho file đó, không throw toàn bộ
      for (const file of validFiles) {
        try {
          await uploadFile(file, classId);
        } catch (err) {
          uploadError = true;
          // Báo lỗi riêng cho từng file
          toast.error(`Error uploading file "${file.name}". Please try again.`);
        }
      }

      // Sau khi upload xong hết, fetch lại materials 1 lần duy nhất
      try {
        const updatedClass = await axios.get(
          `${backendUrl}/api/teacher/class/${classId}`,
          { withCredentials: true }
        );
        if (updatedClass.data.success) {
          setClasses((prevClasses) =>
            prevClasses.map((cls) =>
              cls._id === classId
                ? { ...cls, materials: updatedClass.data.class.materials }
                : cls
            )
          );
        }
      } catch (fetchErr) {
        // Nếu chỉ fetch lại materials lỗi thì chỉ cảnh báo nhẹ
        toast.warn(
          "Uploaded, but failed to refresh materials list. Please reload."
        );
      }

      setTimeout(() => {
        setUploadProgress({});
        setUploadStatus({});
      }, 2000);

      // Nếu có file nào lỗi thì báo lỗi tổng quát
      if (uploadError) {
        throw new Error("Some files failed to upload.");
      }
    } catch (error) {
      // Chỉ báo lỗi nếu thực sự không upload được file nào
      if (!uploadError) {
        toast.error("Error to upload file. Please try again");
      }
    }
  };

  const handleDeleteMaterial = async (
    classId,
    materialId,
    className,
    materialName
  ) => {
    setDeleteModal({
      show: true,
      materialId,
      className,
      classId,
      materialName,
    });
  };

  const confirmDelete = async () => {
    try {
      setIsDeleting(true); // Bắt đầu deleting
      const classId = deleteModal.classId || selectedClass;
      const response = await axios.delete(
        `${backendUrl}/api/teacher/class/${classId}/material/${deleteModal.materialId}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        // Add small delay for better UX
        await new Promise((resolve) => setTimeout(resolve, 500));

        setClasses((prevClasses) =>
          prevClasses.map((cls) =>
            cls._id === classId
              ? {
                  ...cls,
                  materials: cls.materials.filter(
                    (m) => m._id !== deleteModal.materialId
                  ),
                }
              : cls
          )
        );

        toast.success("Material deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting material:", error);
      toast.error(
        error.response?.data?.message ||
          "Error deleting material. Please try again."
      );
    } finally {
      setIsDeleting(false); // Kết thúc deleting
      setDeleteModal({
        show: false,
        materialId: null,
        classId: null,
        className: "",
        materialName: "",
      });
    }
  };

  // Add resize listener
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
      <div className="flex min-h-screen bg-gray-100">
        <div className="fixed top-[70px] left-0 bottom-0 z-40 w-[280px]">
          <Sidebar />
        </div>
        <div className="flex-1 p-4 sm:p-6 md:p-8 md:ml-20 mt-[70px]">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Lecture Materials
              </h1>
              <p className="mt-2 text-gray-600">
                Manage your materials for each class
              </p>
            </motion.div>

            {/* Mobile Toggle Button */}
            {isMobileView && (
              <div className="flex gap-2 mt-4 w-full">
                <button
                  onClick={() => setShowFolderView(true)}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                    showFolderView
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  Classes
                </button>
                <button
                  onClick={() => setShowFolderView(false)}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                    !showFolderView
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  Upload
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loading />
            </div>
          ) : classes.length === 0 ? (
            <div className="text-center text-gray-500">No classes found.</div>
          ) : (
            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
              {/* Left Side - Folder Structure */}
              <div
                className={`
                w-full md:w-1/3 bg-white rounded-xl shadow-lg p-4 md:p-6
                ${isMobileView && !showFolderView ? "hidden" : "block"}
              `}
              >
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
                          {cls.materials?.map((material, index) => (
                            <div
                              key={
                                material._id ||
                                material.id ||
                                `${material.name}-${index}`
                              }
                              className="flex items-center p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                            >
                              <File size={16} className="text-blue-500 mr-2" />
                              <span>{material.name}</span>
                              <div className="ml-auto flex items-center gap-2">
                                <a
                                  href={material.url}
                                  download={material.name}
                                  className="text-gray-400 hover:text-blue-500 cursor-pointer"
                                  title="Download file"
                                >
                                  <Download size={16} />
                                </a>
                                <Trash2
                                  size={16}
                                  className="text-gray-400 hover:text-red-500 cursor-pointer"
                                  onClick={() =>
                                    handleDeleteMaterial(
                                      cls._id,
                                      material._id,
                                      cls.className,
                                      material.name
                                    )
                                  }
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
                <div
                  className={`
                  w-full md:w-2/3 bg-white rounded-xl shadow-lg p-4 md:p-6
                  ${isMobileView && showFolderView ? "hidden" : "block"}
                `}
                >
                  <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-4">
                    Upload Materials for{" "}
                    {classes.find((c) => c._id === selectedClass)?.className}
                  </h2>

                  {/* Upload Area */}
                  <div className="space-y-4">
                    <div
                      className={`border-2 border-dashed rounded-lg p-4 md:p-8 text-center ${
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
                  </div>

                  {/* Recently Uploaded Files */}
                  <div className="mt-6 md:mt-8">
                    <h3 className="text-lg font-medium text-gray-700 mb-4">
                      Uploaded Materials
                    </h3>
                    <div className="space-y-2">
                      {classes
                        .find((c) => c._id === selectedClass)
                        ?.materials.map((material, index) => (
                          <div
                            key={material._id || `${material.name}-${index}`}
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-3 hover:bg-gray-50 rounded-lg gap-2"
                          >
                            <div className="flex items-center">
                              <File
                                size={20}
                                className="text-blue-500 mr-3 flex-shrink-0"
                              />
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-700 truncate">
                                  {material.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {new Date(
                                    material.uploadedAt
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 ml-8 sm:ml-0">
                              <button
                                onClick={() =>
                                  setPdfViewer({
                                    open: true,
                                    url: material.url,
                                    name: material.name,
                                  })
                                }
                                className="p-2 hover:bg-blue-50 rounded-full transition-colors"
                              >
                                <Eye size={18} className="text-blue-500" />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteMaterial(
                                    selectedClass,
                                    material._id,
                                    classes.find((c) => c._id === selectedClass)
                                      ?.className,
                                    material.name
                                  )
                                }
                                className="p-2 hover:bg-red-50 rounded-full transition-colors"
                              >
                                <Trash2 size={18} className="text-red-500" />
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Transition appear show={deleteModal.show} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() =>
            setDeleteModal({
              show: false,
              materialId: null,
              className: "",
              materialName: "",
            })
          }
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-semibold leading-6 text-gray-900"
                      >
                        Delete Material
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to delete "
                          {deleteModal.materialName}" from{" "}
                          {deleteModal.className}? This action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isDeleting}
                      onClick={() =>
                        setDeleteModal({
                          show: false,
                          materialId: null,
                          className: "",
                          materialName: "",
                        })
                      }
                      className={`inline-flex justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium
                        ${
                          isDeleting
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                        }
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2`}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={!isDeleting ? { scale: 1.02 } : {}}
                      whileTap={!isDeleting ? { scale: 0.98 } : {}}
                      disabled={isDeleting}
                      onClick={confirmDelete}
                      className={`inline-flex justify-center items-center rounded-lg border border-transparent px-4 py-2 text-sm font-medium
                        ${
                          isDeleting
                            ? "bg-red-500 text-white cursor-not-allowed"
                            : "bg-red-600 text-white hover:bg-red-700"
                        }
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2`}
                    >
                      {isDeleting ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Deleting...
                        </>
                      ) : (
                        "Delete Material"
                      )}
                    </motion.button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* PDF Viewer */}
      {pdfViewer.open && (
        <PdfViewer
          fileUrl={pdfViewer.url}
          fileName={pdfViewer.name}
          onClose={() => setPdfViewer({ open: false, url: "", name: "" })}
        />
      )}

      {/* Upload Progress Section */}
      {uploadingFiles.length > 0 && (
        <div className="fixed bottom-4 right-4 w-80 z-50">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Uploading Files
            </h3>
            {uploadingFiles.map((file) => (
              <UploadProgress
                key={file.id}
                fileName={file.name}
                progress={file.progress}
                status={file.status}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default LectureMaterials;
