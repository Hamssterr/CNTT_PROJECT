import React from "react";
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  Users,
  GraduationCap,
} from "lucide-react";

const RegistrationDetail = ({ isOpen, onClose, registrationDetail }) => {
  if (!isOpen || !registrationDetail) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full transform transition-all animate-modal-entry">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Registration Details
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                View detailed information about this registration
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-6">
          <div className="space-y-8">
            {/* Parent Information */}
            <div className="bg-blue-50/50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Users size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-blue-900">
                    Parent Information
                  </h4>
                  <p className="text-sm text-blue-600">Primary Contact</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-2">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-blue-600">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Name</p>
                      <p className="text-base font-semibold text-gray-900">
                        {registrationDetail.name || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-blue-600">
                      <Mail size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-base font-semibold text-gray-900">
                        {registrationDetail.email || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-blue-600">
                      <Phone size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="text-base font-semibold text-gray-900">
                        {registrationDetail.phone || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-blue-600">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Registration Date
                      </p>
                      <p className="text-base font-semibold text-gray-900">
                        {registrationDetail.registrationDate
                          ? new Date(
                              registrationDetail.registrationDate
                            ).toLocaleDateString("vi-VN", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Student Information */}
            <div className="bg-purple-50/50 rounded-xl p-6 border border-purple-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                  <GraduationCap size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-purple-900">
                    Student Information
                  </h4>
                  <p className="text-sm text-purple-600">Course Participant</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-2">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-purple-600">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Name</p>
                      <p className="text-base font-semibold text-gray-900">
                        {registrationDetail.studentName || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-purple-600">
                      <Mail size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-base font-semibold text-gray-900">
                        {registrationDetail.studentEmail || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-purple-600">
                      <Phone size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="text-base font-semibold text-gray-900">
                        {registrationDetail.studentPhone || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-2xl border-t border-gray-100">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationDetail;
