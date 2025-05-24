import React from "react";

const ChildDetailModal = ({ isOpen, onClose, child, classes }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 bg-opacity-50 z-40 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {child ? `${child.firstName} ${child.lastName}'s Details` : "Child Details"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            &times;
          </button>
        </div>

        {child && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Child Information</h3>
            <div className="space-y-2 text-gray-600">
              <p>
                <span className="font-medium">Name:</span> {child.firstName} {child.lastName}
              </p>
              <p>
                <span className="font-medium">ID:</span> {child.id}
              </p>
            </div>
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Enrolled Classes</h3>
          {classes.length === 0 ? (
            <p className="text-gray-500">This child is not enrolled in any classes.</p>
          ) : (
            <div className="space-y-4">
              {classes.map((classItem) => (
                <div
                  key={classItem._id}
                  className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                >
                  <h4 className="text-md font-semibold text-gray-800">
                    {classItem.className}
                  </h4>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Course:</span>{" "}
                    {classItem.courseId?.title || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Schedule:</span>{" "}
                    {classItem.schedule?.daysOfWeek.join(", ")} ({classItem.schedule?.shift})
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Instructor:</span>{" "}
                    {classItem.instructor?.name || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Room:</span> {classItem.room || "N/A"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChildDetailModal;