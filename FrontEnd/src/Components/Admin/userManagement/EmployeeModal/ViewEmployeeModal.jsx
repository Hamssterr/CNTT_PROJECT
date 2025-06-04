import React from "react";

import AddressDisplay from "../inputForm/AddressDisplay";
import DegreesDisplay from "../inputForm/DegreesDisplay";
import ExperienceDisplay from "../inputForm/ExperienceDisplay";
import PersonalDisplay from "../inputForm/PersonalDisplay";

const ViewUserModal = ({ show, onClose, user }) => {
  const roleOptions = [
    { value: "teacher", label: "Teacher" },
    { value: "finance", label: "Finance" },
    { value: "admin", label: "Admin" },
    { value: "consultant", label: "Consultant" },
  ];

  if (!show || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-40 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl relative z-50 max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6 relative">
          <h3 className="text-xl md:text-2xl font-bold text-center">Employee Details</h3>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
          <div className="p-6 space-y-6">
            {/* Personal Information Card */}
            <div className="bg-slate-50 rounded-lg p-4 md:p-6">
              <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Personal Information
              </h4>
              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <PersonalDisplay user={user} roleOptions={roleOptions} />
              </div>
            </div>

            {/* Address Information Card */}
            <div className="bg-emerald-50 rounded-lg p-4 md:p-6">
              <h4 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Address Information
              </h4>
              <div className="bg-white rounded-lg p-4 border border-emerald-200">
                <AddressDisplay address={user.address} />
              </div>
            </div>

            {/* Education & Degrees Card */}
            <div className="bg-purple-50 rounded-lg p-4 md:p-6">
              <h4 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
                Education & Degrees
              </h4>
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                {user.degree && user.degree.length > 0 ? (
                  <DegreesDisplay degrees={user.degree} />
                ) : (
                  <div className="text-center py-6">
                    <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                    <p className="text-sm text-gray-500">No degree information available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Professional Experience Card */}
            <div className="bg-amber-50 rounded-lg p-4 md:p-6">
              <h4 className="text-lg font-semibold text-amber-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6m8 0H8m8 0h2a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8a2 2 0 012-2h2" />
                </svg>
                Professional Experience
              </h4>
              <div className="bg-white rounded-lg p-4 border border-amber-200">
                {user.experience && user.experience.length > 0 ? (
                  <ExperienceDisplay experiences={user.experience} />
                ) : (
                  <div className="text-center py-6">
                    <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6m8 0H8m8 0h2a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8a2 2 0 012-2h2" />
                    </svg>
                    <p className="text-sm text-gray-500">No work experience available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Role Badge */}
            <div className="bg-blue-50 rounded-lg p-4 md:p-6">
              <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                Employee Role
              </h4>
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-center">
                  <span className={`px-6 py-3 rounded-full text-sm font-semibold text-white ${
                    user.role === 'teacher' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                    user.role === 'finance' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                    user.role === 'admin' ? 'bg-gradient-to-r from-purple-500 to-purple-600' :
                    user.role === 'consultant' ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                    'bg-gradient-to-r from-gray-500 to-gray-600'
                  }`}>
                    {roleOptions.find(role => role.value === user.role)?.label || user.role}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewUserModal;