import React from "react";

const ViewUserModal = ({ show, onClose, user }) => {
  const roleOptions = [
    { value: "parent", label: "Parent" },
    { value: "student", label: "Student" },
  ];

  if (!show || !user) return null;

  // Debug: Kiểm tra giá trị của isAdultStudent và address
  console.log("User data:", user);
  console.log("isAdultStudent:", user.isAdultStudent);
  console.log("Address:", user.address);

  return (
    <div className="fixed inset-0 bg-black/30 bg-opacity-40 z-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl relative z-50 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4 text-center">
          User Details
        </h3>
        <div className="flex flex-col gap-4">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="First Name"
              value={user.firstName || ""}
              readOnly
              className="border p-2 rounded-md w-full bg-gray-100 cursor-not-allowed"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={user.lastName || ""}
              readOnly
              className="border p-2 rounded-md w-full bg-gray-100 cursor-not-allowed"
            />
          </div>

          <input
            type="email"
            placeholder="Email"
            value={user.email || ""}
            readOnly
            className="border p-2 rounded-md w-full bg-gray-100 cursor-not-allowed"
          />

          <input
            type="text"
            placeholder="Phone Number (10 digits)"
            value={user.phoneNumber || ""}
            readOnly
            className="border p-2 rounded-md w-full bg-gray-100 cursor-not-allowed"
          />

          <select
            value={user.role || ""}
            disabled
            className="border p-2 rounded-md w-full bg-gray-100 cursor-not-allowed"
          >
            <option value="">Select Role</option>
            {roleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Student-specific fields */}
          {user.role === "student" && (
            <>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700 font-semibold">
                  Adult Student:
                </label>
                <span className="text-sm text-gray-800">
                  {user.isAdultStudent ? "Yes" : "No"}
                </span>
              </div>
              {!user.isAdultStudent && (
                <div className="border p-4 rounded-md">
                  <h4 className="text-md font-semibold mb-2">Parent Information</h4>
                  {user.parents && user.parents.length > 0 ? (
                    user.parents.map((parent, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input
                          type="text"
                          placeholder="Parent's First Name"
                          value={parent.firstName || "N/A"}
                          readOnly
                          className="border p-2 rounded-md w-full bg-gray-100 cursor-not-allowed"
                        />
                        <input
                          type="text"
                          placeholder="Parent's Last Name"
                          value={parent.lastName || "N/A"}
                          readOnly
                          className="border p-2 rounded-md w-full bg-gray-100 cursor-not-allowed"
                        />
                        <input
                          type="text"
                          placeholder="Parent's Phone Number"
                          value={parent.phoneNumber || user.parentPhoneNumber || "Not available"}
                          readOnly
                          className="border p-2 rounded-md w-full bg-gray-100 cursor-not-allowed"
                        />
                        <input
                          type="email"
                          placeholder="Parent's Email"
                          value={parent.email || "Not available"}
                          readOnly
                          className="border p-2 rounded-md w-full bg-gray-100 cursor-not-allowed"
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">Not linked to a parent.</p>
                  )}
                </div>
              )}
            </>
          )}

          {/* Parent-specific fields */}
          {user.role === "parent" && (
            <div className="border p-4 rounded-md">
              <h4 className="text-md font-semibold mb-2">Children Information</h4>
              {user.children && user.children.length > 0 ? (
                user.children.map((child, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Child's First Name"
                      value={child.firstName || "N/A"}
                      readOnly
                      className="border p-2 rounded-md w-full bg-gray-100 cursor-not-allowed"
                    />
                    <input
                      type="text"
                      placeholder="Child's Last Name"
                      value={child.lastName || "N/A"}
                      readOnly
                      className="border p-2 rounded-md w-full bg-gray-100 cursor-not-allowed"
                    />
                    <input
                      type="text"
                      placeholder="Child's Phone Number"
                      value={child.phoneNumber || "Not available"}
                      readOnly
                      className="border p-2 rounded-md w-full bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No children linked.</p>
              )}
            </div>
          )}

          {/* Address */}
          {(user.role === "parent" || (user.role === "student" && user.isAdultStudent === true)) && (
            <div className="border p-4 rounded-md">
              <h4 className="text-md font-semibold mb-2">Address</h4>
              {user.address ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="House Number"
                    value={user.address.houseNumber || ""}
                    readOnly
                    className="border p-2 rounded-md w-full bg-gray-100 cursor-not-allowed"
                  />
                  <input
                    type="text"
                    placeholder="Street"
                    value={user.address.street || ""}
                    readOnly
                    className="border p-2 rounded-md w-full bg-gray-100 cursor-not-allowed"
                  />
                  <input
                    type="text"
                    placeholder="Ward/Commune"
                    value={user.address.ward || ""}
                    readOnly
                    className="border p-2 rounded-md w-full bg-gray-100 cursor-not-allowed"
                  />
                  <input
                    type="text"
                    placeholder="District"
                    value={user.address.district || ""}
                    readOnly
                    className="border p-2 rounded-md w-full bg-gray-100 cursor-not-allowed"
                  />
                  <input
                    type="text"
                    placeholder="City"
                    value={user.address.city || ""}
                    readOnly
                    className="border p-2 rounded-md w-full bg-gray-100 cursor-not-allowed"
                  />
                  <input
                    type="text"
                    placeholder="Province"
                    value={user.address.province || ""}
                    readOnly
                    className="border p-2 rounded-md w-full bg-gray-100 cursor-not-allowed"
                  />
                  <input
                    type="text"
                    placeholder="Country"
                    value={user.address.country || "Vietnam"}
                    readOnly
                    className="border p-2 rounded-md w-full bg-gray-100 cursor-not-allowed"
                  />
                </div>
              ) : (
                <p className="text-sm text-gray-500">Address not provided.</p>
              )}
            </div>
          )}

          {/* Close Button */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition"
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