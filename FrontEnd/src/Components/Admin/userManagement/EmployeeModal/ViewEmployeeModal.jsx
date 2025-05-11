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
    <div className="fixed inset-0 bg-black/30 bg-opacity-40 z-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl relative z-50 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4 text-center">User Details</h3>
        <div className="flex flex-col gap-4">
          {/* Basic Info */}
          <PersonalDisplay user={user} roleOptions={roleOptions} />

          {/* Address */}
          <AddressDisplay address={user.address} />

          {/* Degrees */}
          <DegreesDisplay degrees={user.degree} />

          {/* Experiences */}
          <ExperienceDisplay experiences={user.experience} />

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
