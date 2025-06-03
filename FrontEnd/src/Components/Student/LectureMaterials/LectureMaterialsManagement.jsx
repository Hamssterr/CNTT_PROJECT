import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Book,
  FileText,
  Search,
  Download,
  Eye,
  Calendar,
  Clock,
  User,
  BookOpen,
} from "lucide-react";

const MOCK_DATA = {
  classes: [
    {
      id: 1,
      name: "Advanced Mathematics",
      teacher: "Dr. John Smith",
      schedule: "Mon, Wed 10:00 AM",
      materials: [
        {
          id: 1,
          title: "Chapter 1 - Calculus Introduction",
          uploadedAt: "2024-03-01",
          type: "PDF",
          size: "2.4 MB",
          url: "#",
        },
        {
          id: 2,
          title: "Practice Problems Set 1",
          uploadedAt: "2024-03-02",
          type: "PDF",
          size: "1.8 MB",
          url: "#",
        },
      ],
    },
    {
      id: 2,
      name: "Physics Fundamentals",
      teacher: "Prof. Sarah Wilson",
      schedule: "Tue, Thu 2:00 PM",
      materials: [
        {
          id: 3,
          title: "Newton's Laws Explained",
          uploadedAt: "2024-03-03",
          type: "PDF",
          size: "3.1 MB",
          url: "#",
        },
      ],
    },
  ],
};

const LectureMaterialsManagement = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          Lecture Materials
        </h1>
        <p className="mt-2 text-gray-600">
          Access your course materials and resources
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search materials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white rounded-xl shadow-sm border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </motion.div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {MOCK_DATA.classes.map((cls) => (
          <motion.div
            key={cls.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            className={`
              bg-white rounded-xl shadow-sm p-6 cursor-pointer border-2
              ${
                selectedClass?.id === cls.id
                  ? "border-blue-500"
                  : "border-transparent"
              }
            `}
            onClick={() => setSelectedClass(cls)}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{cls.name}</h3>
                <p className="text-sm text-gray-500">{cls.teacher}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{cls.schedule}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <FileText className="h-4 w-4 mr-2" />
                <span>{cls.materials.length} materials</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Materials List */}
      {selectedClass && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {selectedClass.name} Materials
            </h2>
          </div>

          <div className="space-y-4">
            {selectedClass.materials.map((material) => (
              <motion.div
                key={material.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {material.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(material.uploadedAt).toLocaleDateString()} •{" "}
                      {material.size}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                    title="View"
                  >
                    <Eye className="h-5 w-5 text-blue-600" />
                  </button>
                  <button
                    className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                    title="Download"
                  >
                    <Download className="h-5 w-5 text-green-600" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default LectureMaterialsManagement;
