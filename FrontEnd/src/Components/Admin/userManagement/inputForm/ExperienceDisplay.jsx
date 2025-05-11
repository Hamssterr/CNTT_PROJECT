import React from "react";
import { useState } from "react";

const ExperienceDisplay = ({experiences}) => {
  const [showDetail, setShowDetail] = useState(false);

  if (!experiences || experiences.length == 0) {
    return (
      <div className="border p-4 rounded-md bg-gray-50">
        <h4 className="text-md font-semibold mb-2">Experiences</h4>
        <p className="text-gray-500 italic">
          No experiences information available
        </p>
      </div>
    );
  }
  return (
    <div className="border p-4 rounded-md bg-gray-50">
      <h4 className="text-md font-semibold mb-2">Experiences</h4>

      {!showDetail ? (
        <div>
          {experiences.map((exp, index) => (
            <p key={index} className="text-gray-700 mb-1">
              {exp.position && `Position name: ${exp.position},...`}
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
          {experiences.map((exp, index) => (
            <div
              key={index}
              className="text-gray-700 space-y-1 border rounded p-2"
            >
              {exp.position && (
                <p>
                  <span className="font-medium">Position name: </span>
                  {exp.position}
                </p>
              )}
              {exp.company && (
                <p>
                  <span className="font-medium">Company name: </span>
                  {exp.company}
                </p>
              )}
              {exp.startDate && (
                <p>
                  <span className="font-medium">Start date: </span>
                  {exp.startDate}
                </p>
              )}
              {exp.endDate && (
                <p>
                  <span className="font-medium">End date:</span> {exp.endDate}
                </p>
              )}
              {exp.description && (
                <div className="col-span-2">
                  <label className="block font-medium mb-1">Description</label>
                  <textarea
                    value={exp.description}
                    readOnly
                    className="border p-2 rounded-md w-full bg-gray-100 cursor-not-allowed"
                    rows="3"
                  />
                </div>
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

export default ExperienceDisplay;
