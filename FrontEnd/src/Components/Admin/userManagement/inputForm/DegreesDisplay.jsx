import React from "react";
import { useState } from "react";

const DegreesDisplay = ({ degrees }) => {
  const [showDetail, setShowDetail] = useState(false);

  if (!degrees || degrees.length === 0) {
    return (
      <div className="border p-4 rounded-md bg-gray-50">
        <h4 className="text-md font-semibold mb-2">Degrees</h4>
        <p className="text-gray-500 italic">No degree information available</p>
      </div>
    );
  }

  return (
    <div className="border p-4 rounded-md bg-gray-50">
      <h4 className="text-md font-semibold mb-2">Degrees</h4>

      {!showDetail ? (
        <div>
          {degrees.map((deg, index) => (
            <p key={index} className="text-gray-700 mb-1">
              {deg.name && `Degree name: ${deg.name},... `}
            </p>
          ))}
          <button
            onClick={() => setShowDetail(true)}
            className="text-blue-600 hover:underline text-sm mt-2"
          >
            View Details
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {degrees.map((deg, index) => (
            <div key={index} className="text-gray-700 space-y-1 border rounded p-2">
              {deg.name && (
                <p>
                  <span className="font-medium">Degree name:</span> {deg.name}
                </p>
              )}
              {deg.institution && (
                <p>
                  <span className="font-medium">Institution:</span> {deg.institution}
                </p>
              )}
              {deg.year && (
                <p>
                  <span className="font-medium">Year:</span> {deg.year}
                </p>
              )}
              {deg.major && (
                <p>
                  <span className="font-medium">Major:</span> {deg.major}
                </p>
              )}
            </div>
          ))}
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


export default DegreesDisplay;
