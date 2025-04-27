import React from "react";

const ViewUserModal = ({ show, onClose, user }) => {
  const roleOptions = [
    { value: "teacher", label: "Teacher" },
    { value: "finance", label: "Finance" },
    { value: "admin", label: "Admin" },
  ];

  if (!show || !user) return null;

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

          {/* Address */}
          <div className="border p-4 rounded-md">
            <h4 className="text-md font-semibold mb-2">Address</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="House Number"
                value={user.address?.houseNumber || ""}
                readOnly
                className="border p-2 rounded-md w-full bg-gray-100 cursor-not-allowed"
              />
              <input
                type="text"
                placeholder="Street"
                value={user.address?.street || ""}
                readOnly
                className="border p-2 rounded-md w-full bg-gray-100 cursor-not-allowed"
              />
              <input
                type="text"
                placeholder="Ward/Commune"
                value={user.address?.ward || ""}
                readOnly
                className="border p-2 rounded-md w-full bg-gray-100 cursor-not-allowed"
              />
              <input
                type="text"
                placeholder="District"
                value={user.address?.district || ""}
                readOnly
                className="border p-2 rounded-md w-full bg-gray-100 cursor-not-allowed"
              />
              <input
                type="text"
                placeholder="City"
                value={user.address?.city || ""}
                readOnly
                className="border p-2 rounded-md w-full bg-gray-100 cursor-not-allowed"
              />
              <input
                type="text"
                placeholder="Province"
                value={user.address?.province || ""}
                readOnly
                className="border p-2 rounded-md w-full bg-gray-100 cursor-not-allowed"
              />
              <input
                type="text"
                placeholder="Country"
                value={user.address?.country || "Vietnam"}
                readOnly
                className="border p-2 rounded-md w-full bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Degrees */}
          <div className="border p-4 rounded-md">
            <h4 className="text-mdняет

 font-semibold mb-2">Degrees</h4>
            {user.degree && user.degree.length > 0 ? (
              user.degree.map((degree, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
                >
                  <input
                    type="text"
                    placeholder="Degree Name"
                    value={degree.name || ""}
                    readOnly
                    className="border p-2 rounded-md w-full bg-gray-100 cursor-not-allowed"
                  />
                  <input
                    type="text"
                    placeholder="Institution"
                    value={degree.institution || ""}
                    readOnly
                    className="border p-2 rounded-md w-full bg-gray-100 cursor-not-allowed"
                  />
                  <input
                    type="number"
                    placeholder="Year"
                    value={degree.year || ""}
                    readOnly
                    className="border p-2 rounded-md w-full bg-gray-100 cursor-not-allowed"
                  />
                  <input
                    type="text"
                    placeholder="Major (Optional)"
                    value={degree.major || ""}
                    readOnly
                    className="border p-2 rounded-md w-full bg-gray-100 cursor-not-allowed"
                  />
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No degrees available.</p>
            )}
          </div>

          {/* Experiences */}
          <div className="border p-4 rounded-md">
            <h4 className="text-md font-semibold mb-2">Experiences</h4>
            {user.experience && user.experience.length > 0 ? (
              user.experience.map((experience, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
                >
                  <input
                    type="text"
                    placeholder="Position"
                    value={experience.position || ""}
                    readOnly
                    className="border p-2 rounded-md w-full bg-gray-100 cursor-not-allowed"
                  />
                  <input
                    type="text"
                    placeholder="Company"
                    value={experience.company || ""}
                    readOnly
                    className="border p-2 rounded-md w-full bg-gray-100 cursor-not-allowed"
                  />
                  <input
                    type="date"
                    placeholder="Start Date"
                    value={
                      experience.startDate
                        ? new Date(experience.startDate)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    readOnly
                    className="border p-2 rounded-md w-full bg-gray-100 cursor-not-allowed"
                  />
                  <input
                    type="date"
                    placeholder="End Date (Optional)"
                    value={
                      experience.endDate
                        ? new Date(experience.endDate)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    readOnly
                    className="border p-2 rounded-md w-full bg-gray-100 cursor-not-allowed"
                  />
                  <textarea
                    placeholder="Description (Optional)"
                    value={experience.description || ""}
                    readOnly
                    className="border p-2 rounded-md w-full col-span-2 bg-gray-100 cursor-not-allowed"
                    rows="3"
                  />
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No experiences available.</p>
            )}
          </div>

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