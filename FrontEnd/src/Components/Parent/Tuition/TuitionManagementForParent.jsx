import React, { useState } from "react";

const TuitionManagementForParent = () => {
  const [darkMode, setDarkMode] = useState(false);

  const mockStudentData = {
    fees: {
      total: 10000,
      paid: 6000,
      remaining: 4000,
      dueDate: "2024-03-31",
      breakdown: [
        { type: "Tuition", amount: 7000 },
        { type: "Lab Fees", amount: 1500 },
        { type: "Library", amount: 1000 },
        { type: "Miscellaneous", amount: 500 },
      ],
    },
  };

  return (
    <div className="w-full min-h-screen bg-gray-50/50">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          className={`p-6 rounded-lg shadow-md ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h2
            className={`text-xl font-semibold mb-4 ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Fee Summary
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">
                Total Fee
              </span>
              <span className={darkMode ? "text-white" : "text-gray-800"}>
                ${mockStudentData.fees.total}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">
                Paid Amount
              </span>
              <span className="text-green-500">
                ${mockStudentData.fees.paid}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">
                Remaining Balance
              </span>
              <span className="text-red-500">
                ${mockStudentData.fees.remaining}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Due Date</span>
              <span className={darkMode ? "text-white" : "text-gray-800"}>
                {mockStudentData.fees.dueDate}
              </span>
            </div>
          </div>
        </div>

        <div
          className={`p-6 rounded-lg shadow-md ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h2
            className={`text-xl font-semibold mb-4 ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Fee Breakdown
          </h2>
          <div className="space-y-4">
            {mockStudentData.fees.breakdown.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">
                  {item.type}
                </span>
                <span className={darkMode ? "text-white" : "text-gray-800"}>
                  ${item.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TuitionManagementForParent;
