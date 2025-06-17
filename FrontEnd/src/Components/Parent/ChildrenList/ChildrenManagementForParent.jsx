import React, { useState, useMemo } from "react";
import { useContext } from "react";
import { AppContext } from "../../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Eye,
  Heart,
  Star,
  Calendar,
  BookOpen,
  Award,
  Sparkles,
  Baby,
  GraduationCap,
  UserCheck,
  Search,
  Filter,
  Grid3X3,
  List,
} from "lucide-react";

import Loading from "../../Loading";
import ChildDetailModal from "./ChildDetailModal";

const ChildrenManagementForParent = () => {
  const { backendUrl } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [childrenData, setChildrenData] = useState([]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);
  const [childClasses, setChildClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  const fetchChildrenData = async () => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;

      const response = await axios.get(
        `${backendUrl}/api/parent/getDataChildrenForParent`
      );
      const { data } = response;

      if (data.success && Array.isArray(data.data)) {
        setChildrenData(data.data);
      } else {
        setChildrenData([]);
        toast.error(data.message || "No children found");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load children data"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchChildClasses = async (childId) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/parent/getClassWithHaveChildren`,
        {
          params: { childId },
          withCredentials: true,
        }
      );
      const { data } = response;

      if (data.success && Array.isArray(data.data)) {
        setChildClasses(data.data);
      } else {
        setChildClasses([]);
        toast.error(data.message || "No classes found for this child");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load class data");
      setChildClasses([]);
    }
  };

  const handleViewDetails = (child) => {
    setSelectedChild(child);
    setIsDetailModalOpen(true);
    fetchChildClasses(child.id);
  };

  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setSelectedChild(null);
    setChildClasses([]);
  };

  useEffect(() => {
    fetchChildrenData();
  }, [backendUrl]);

  const displayedChildren = useMemo(() => {
    return childrenData.filter((child) =>
      `${child.firstName} ${child.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [childrenData, searchTerm]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your children...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl">
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
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                    <Heart className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    My Children
                  </h1>
                  <p className="text-gray-500 mt-1">
                    Manage and view your children's academic journey
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full">
                      {childrenData.length} children
                    </span>
                    <span className="text-sm text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Family Dashboard
                    </span>
                  </div>
                </div>
              </div>
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
                  placeholder="Search children..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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

        {/* Children Display */}
        <AnimatePresence mode="wait">
          {displayedChildren.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-16"
            >
              <div className="relative mx-auto mb-6 w-24 h-24">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                  <Baby className="w-12 h-12 text-gray-400" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {searchTerm ? "No children found" : "No children registered"}
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {searchTerm
                  ? "Try adjusting your search criteria"
                  : "You currently have no children registered in the system. Contact support if this seems incorrect."}
              </p>

              {searchTerm && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSearchTerm("")}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 font-medium transition-all duration-200"
                >
                  Clear search
                </motion.button>
              )}
            </motion.div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedChildren.map((child, index) => (
                <motion.div
                  key={child.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
                >
                  {/* Card Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="relative p-6">
                    {/* Profile Section */}
                    <div className="flex flex-col items-center mb-6">
                      <div className="relative">
                        <motion.img
                          whileHover={{ scale: 1.05 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          src={
                            child.profileImage ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              `${child.firstName} ${child.lastName}`
                            )}&background=random&color=fff&size=120&font-size=0.5&bold=true`
                          }
                          alt={`${child.firstName}'s profile`}
                          className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-lg group-hover:shadow-xl transition-all duration-300"
                        />
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                          <UserCheck className="w-4 h-4 text-white" />
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-gray-800 mt-4 text-center group-hover:text-blue-600 transition-colors">
                        {`${child.firstName} ${child.lastName}`}
                      </h3>

                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          <GraduationCap className="w-3 h-3" />
                          Student
                        </div>
                      </div>
                    </div>

                    {/* Quick Info */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <span className="text-sm text-gray-600 font-medium">
                          Status:
                        </span>
                        <span className="text-sm font-semibold text-green-600 flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Active
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleViewDetails(child)}
                      className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </motion.button>
                  </div>

                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/5 to-purple-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"></div>
                </motion.div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-4">
              {displayedChildren.map((child, index) => (
                <motion.div
                  key={child.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <motion.img
                          whileHover={{ scale: 1.05 }}
                          src={
                            child.profileImage ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              `${child.firstName} ${child.lastName}`
                            )}&background=random&color=fff&size=80&font-size=0.5&bold=true`
                          }
                          alt={`${child.firstName}'s profile`}
                          className="w-16 h-16 rounded-xl object-cover border-2 border-gray-200 group-hover:border-blue-300 transition-all duration-300"
                        />
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                            {`${child.firstName} ${child.lastName}`}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                              Student
                            </span>
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              Active
                            </span>
                          </div>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleViewDetails(child)}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-medium flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      <ChildDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseModal}
        child={selectedChild}
        classes={childClasses}
      />
    </div>
  );
};

export default ChildrenManagementForParent;
