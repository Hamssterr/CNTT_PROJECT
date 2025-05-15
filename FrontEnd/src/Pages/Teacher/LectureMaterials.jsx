import React, { useState } from "react";
import Navbar from "../../Components/Teacher/NavBar";
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

// Mock data for classes and materials
const mockClasses = [
  {
    id: 1,
    name: "Advanced Mathematics",
    materials: [
      { id: 1, name: "Chapter 1 - Calculus.pdf", date: "2024-01-15" },
      { id: 2, name: "Chapter 2 - Integration.pdf", date: "2024-01-20" },
    ],
  },
  {
    id: 2,
    name: "Basic Physics",
    materials: [
      { id: 3, name: "Introduction to Mechanics.pdf", date: "2024-01-16" },
    ],
  },
  {
    id: 3,
    name: "Chemistry Lab",
    materials: [],
  },
];

function LectureMaterials() {
  const [selectedClass, setSelectedClass] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState({});
  const [isDragging, setIsDragging] = useState(false);

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

  const handleDrop = (e, classId) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    console.log("Dropped files for class", classId, files);
    // Handle file upload logic here
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

          <div className="flex gap-6">
            {/* Left Side - Folder Structure */}
            <div className="w-1/3 bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Classes
              </h2>
              <div className="space-y-2">
                {mockClasses.map((cls) => (
                  <div key={cls.id} className="select-none">
                    <div
                      className={`flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-50 ${
                        selectedClass === cls.id ? "bg-blue-50" : ""
                      }`}
                      onClick={() => {
                        setSelectedClass(cls.id);
                        toggleFolder(cls.id);
                      }}
                    >
                      {expandedFolders[cls.id] ? (
                        <ChevronDown size={20} className="text-gray-500 mr-2" />
                      ) : (
                        <ChevronRight
                          size={20}
                          className="text-gray-500 mr-2"
                        />
                      )}
                      <FolderOpen size={20} className="text-yellow-500 mr-2" />
                      <span className="text-gray-700">{cls.name}</span>
                      <span className="ml-auto text-sm text-gray-500">
                        ({cls.materials.length})
                      </span>
                    </div>
                    {expandedFolders[cls.id] && (
                      <div className="ml-9 mt-2 space-y-1">
                        {cls.materials.map((material) => (
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
                  {mockClasses.find((c) => c.id === selectedClass)?.name}
                </h2>

                {/* Upload Area */}
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
                    Drag and drop your PDF files here, or
                  </p>
                  <label className="inline-block">
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files);
                        console.log("Selected files:", files);
                        // Handle file upload logic here
                      }}
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
                    Recently Uploaded
                  </h3>
                  {mockClasses
                    .find((c) => c.id === selectedClass)
                    ?.materials.map((material) => (
                      <div
                        key={material.id}
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
                              {new Date(material.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-1 hover:text-blue-500">
                            <Download size={18} />
                          </button>
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
        </div>
      </div>
    </div>
  );
}

export default LectureMaterials;
