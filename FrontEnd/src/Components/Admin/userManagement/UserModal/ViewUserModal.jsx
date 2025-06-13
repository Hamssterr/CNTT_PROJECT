import React from "react";

import AddressDisplay from "../inputForm/AddressDisplay";
import PersonalDisplay from "../inputForm/PersonalDisplay";

const ViewUserModal = ({ show, onClose, user }) => {
  const roleOptions = [
    { value: "parent", label: "Parent" },
    { value: "student", label: "Student" },
  ];

  if (!show || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-40 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl relative z-50 max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 relative">
          <h3 className="text-xl md:text-2xl font-bold text-center">User Details</h3>
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
            {/* Personal Info Card */}
            <div className="bg-gray-50 rounded-lg p-4 md:p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Personal Information
              </h4>
              <PersonalDisplay user={user} roleOptions={roleOptions} />
            </div>

            {/* Student-specific fields */}
            {user.role === "student" && (
              <>
                <div className="bg-blue-50 rounded-lg p-4 md:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-blue-800 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      Student Status
                    </h4>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-700">Adult Student:</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.isAdultStudent 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {user.isAdultStudent ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                </div>

                {!user.isAdultStudent && (
                  <div className="bg-amber-50 rounded-lg p-4 md:p-6">
                    <h4 className="text-lg font-semibold text-amber-800 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Parent Information
                    </h4>
                    
                    {user.parents && user.parents.length > 0 ? (
                      <div className="space-y-4">
                        {user.parents.map((parent, index) => (
                          <div key={index} className="bg-white rounded-lg p-4 border border-amber-200">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">First Name</label>
                                <div className="bg-gray-50 border border-gray-200 rounded-md p-3 text-sm text-gray-800">
                                  {parent.firstName || "N/A"}
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Last Name</label>
                                <div className="bg-gray-50 border border-gray-200 rounded-md p-3 text-sm text-gray-800">
                                  {parent.lastName || "N/A"}
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Phone Number</label>
                                <div className="bg-gray-50 border border-gray-200 rounded-md p-3 text-sm text-gray-800">
                                  {parent.phoneNumber || user.parentPhoneNumber || "Not available"}
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                                <div className="bg-gray-50 border border-gray-200 rounded-md p-3 text-sm text-gray-800 break-all">
                                  {parent.email || "Not available"}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white rounded-lg p-6 text-center border border-amber-200">
                        <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m3 5.197H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm text-gray-500">Not linked to a parent</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Parent-specific fields */}
            {user.role === "parent" && (
              <div className="bg-green-50 rounded-lg p-4 md:p-6">
                <h4 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Children Information
                </h4>
                
                {user.children && user.children.length > 0 ? (
                  <div className="space-y-4">
                    {user.children.map((child, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 border border-green-200">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">First Name</label>
                            <div className="bg-gray-50 border border-gray-200 rounded-md p-3 text-sm text-gray-800">
                              {child.firstName || "N/A"}
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Last Name</label>
                            <div className="bg-gray-50 border border-gray-200 rounded-md p-3 text-sm text-gray-800">
                              {child.lastName || "N/A"}
                            </div>
                          </div>
                          <div className="sm:col-span-2 lg:col-span-1">
                            <label className="block text-xs font-medium text-gray-600 mb-1">Phone Number</label>
                            <div className="bg-gray-50 border border-gray-200 rounded-md p-3 text-sm text-gray-800">
                              {child.phoneNumber || "Not available"}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg p-6 text-center border border-green-200">
                    <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p className="text-sm text-gray-500">No children linked</p>
                  </div>
                )}
              </div>
            )}

            {/* Address */}
            {(user.role === "parent" ||
              (user.role === "student" && user.isAdultStudent === true) ||
              user.role === "employee") && (
              <div className="bg-purple-50 rounded-lg p-4 md:p-6">
                <h4 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Address Information
                </h4>
                <div className="bg-white rounded-lg p-4 border border-purple-200">
                  <AddressDisplay address={user.address} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
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