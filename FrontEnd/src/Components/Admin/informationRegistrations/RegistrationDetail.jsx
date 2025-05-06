import React from "react";
import { X } from "lucide-react";

const RegistrationDetailModal = ({ isOpen, onClose, registrationDetail }) => {
  if (!isOpen || !registrationDetail) return null;

  return (
    <div className="fixed inset-0 bg-black/30 bg-opacity-40 z-40 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          <X size={24} />
        </button>
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Registration Details
        </h3>
        <div className="space-y-4">
          <div>
            <span className="font-semibold text-gray-700">Name:</span>
            <p className="text-gray-600">{registrationDetail.name || "N/A"}</p>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Email:</span>
            <p className="text-gray-600">{registrationDetail.email || "N/A"}</p>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Phone Number:</span>
            <p className="text-gray-600">
              {registrationDetail.phoneNumber || "N/A"}
            </p>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Registered At:</span>
            <p className="text-gray-600">
              {registrationDetail.registeredAt
                ? new Date(registrationDetail.registeredAt).toLocaleDateString(
                    "vi-VN",
                    {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }
                  )
                : "N/A"}
            </p>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationDetailModal;