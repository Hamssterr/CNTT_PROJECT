import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Users,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Sparkles,
} from "lucide-react";

import AddressDisplay from "../inputForm/AddressDisplay";
import PersonalDisplay from "../inputForm/PersonalDisplay";

const ViewUserModal = ({ show, onClose, user }) => {
  const roleOptions = [
    { value: "parent", label: "Parent" },
    { value: "student", label: "Student" },
  ];

  if (!show || !user) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex justify-center items-center p-2 sm:p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 300,
            duration: 0.3,
          }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl relative z-[10000] max-h-[95vh] overflow-hidden border border-white/20"
        >
          {/* Enhanced Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-6 relative"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                    <Sparkles className="w-2 h-2 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">User Details</h3>
                  <p className="text-blue-100 text-sm">
                    Comprehensive user information
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-2xl flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>

          {/* Enhanced Content */}
          <div className="overflow-y-auto max-h-[calc(95vh-140px)] custom-scrollbar">
            <div className="p-6 space-y-6">
              {/* Personal Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 shadow-lg border border-gray-100"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-800">
                    Personal Information
                  </h4>
                </div>
                <div className="bg-white rounded-xl p-4 border border-blue-100">
                  <PersonalDisplay user={user} roleOptions={roleOptions} />
                </div>
              </motion.div>

              {/* Student-specific fields */}
              {user.role === "student" && (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-lg border border-blue-100"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <h4 className="text-xl font-bold text-blue-800">
                        Student Status
                      </h4>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-blue-100">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-700">
                          Adult Student:
                        </span>
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-semibold ${
                            user.isAdultStudent
                              ? "bg-green-100 text-green-800 border border-green-200"
                              : "bg-orange-100 text-orange-800 border border-orange-200"
                          }`}
                        >
                          {user.isAdultStudent ? "Yes" : "No"}
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  {!user.isAdultStudent && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 shadow-lg border border-amber-100"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                          <Users className="w-5 h-5 text-amber-600" />
                        </div>
                        <h4 className="text-xl font-bold text-amber-800">
                          Parent Information
                        </h4>
                      </div>

                      {user.parents && user.parents.length > 0 ? (
                        <div className="space-y-4">
                          {user.parents.map((parent, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 * index }}
                              className="bg-white rounded-xl p-4 border border-amber-200 shadow-sm"
                            >
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-2">
                                    First Name
                                  </label>
                                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-800">
                                    {parent.firstName || "N/A"}
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-2">
                                    Last Name
                                  </label>
                                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-800">
                                    {parent.lastName || "N/A"}
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-2">
                                    Phone Number
                                  </label>
                                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-800 flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-gray-500" />
                                    {parent.phoneNumber ||
                                      user.parentPhoneNumber ||
                                      "Not available"}
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-2">
                                    Email
                                  </label>
                                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-800 break-all flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                    <span>
                                      {parent.email || "Not available"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-white rounded-xl p-8 text-center border border-amber-200">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-sm text-gray-500 font-medium">
                            Not linked to a parent
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </>
              )}

              {/* Parent-specific fields */}
              {user.role === "parent" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-lg border border-green-100"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <h4 className="text-xl font-bold text-green-800">
                      Children Information
                    </h4>
                  </div>

                  {user.children && user.children.length > 0 ? (
                    <div className="space-y-4">
                      {user.children.map((child, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className="bg-white rounded-xl p-4 border border-green-200 shadow-sm"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-2">
                                First Name
                              </label>
                              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-800">
                                {child.firstName || "N/A"}
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-2">
                                Last Name
                              </label>
                              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-800">
                                {child.lastName || "N/A"}
                              </div>
                            </div>
                            <div className="sm:col-span-2 lg:col-span-1">
                              <label className="block text-xs font-medium text-gray-600 mb-2">
                                Phone Number
                              </label>
                              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-800 flex items-center gap-2">
                                <Phone className="w-4 h-4 text-gray-500" />
                                {child.phoneNumber || "Not available"}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl p-8 text-center border border-green-200">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-500 font-medium">
                        No children linked
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Address */}
              {(user.role === "parent" ||
                (user.role === "student" && user.isAdultStudent === true) ||
                user.role === "employee") && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 shadow-lg border border-purple-100"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-purple-600" />
                    </div>
                    <h4 className="text-xl font-bold text-purple-800">
                      Address Information
                    </h4>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-purple-200">
                    <AddressDisplay address={user.address} />
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Enhanced Footer */}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ViewUserModal;
