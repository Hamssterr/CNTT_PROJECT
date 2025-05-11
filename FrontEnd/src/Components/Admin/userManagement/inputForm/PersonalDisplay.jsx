import React, { useState } from "react";

const PersonalDisplay = ({ user }) => {
  const [showDetail, setShowDetail] = useState(false);

  if (!user) {
    return (
      <div className="border p-4 rounded-md bg-gray-50">
        <h4 className="text-md font-semibold mb-2">Personal Info</h4>
        <p className="text-gray-500 italic">
          No personal information available
        </p>
      </div>
    );
  }

  return (
    <div className="border p-4 rounded-md bg-gray-50">
      <h4 className="text-md font-semibold mb-3">Personal Information</h4>

      {!showDetail ? (
        <div className="text-gray-700">
          <p>
            {user.firstName} {user.lastName} - {user.role}
          </p>
          <button
            onClick={() => setShowDetail(true)}
            className="text-blue-600 hover:underline text-sm mt-2"
          >
            View Details
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {user.firstName && (
            <p>
              <span className="font-medium">Full name: </span>
              {user.firstName} {user.lastName}
            </p>
          )}

          {user.email && (
            <p>
              <span className="font-medium">Email: </span>
              {user.email}
            </p>
          )}

          {user.phoneNumber && (
            <p>
              <span className="font-medium">Phone number: </span>
              {user.phoneNumber}
            </p>
          )}

          {user.role && (
            <p>
              <span className="font-medium">Role: </span>
              {user.role}
            </p>
          )}

          <button
            onClick={() => setShowDetail(false)}
            className="text-blue-600 hover:underline text-sm mt-2 block"
          >
            Hide Details
          </button>
        </div>
      )}
    </div>
  );
};

export default PersonalDisplay;
