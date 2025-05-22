import React, { useState, useMemo } from "react";

const ChildrenManagementForParent = () => {
  // Mock data for parent's children. In a real app, this would come from props or an API.
  // Using useState to hold the data, similar to how data might be fetched and set.
  const [childrenData, setChildrenData] = useState([
    {
      id: 1,
      name: "Alex Johnson",
      age: 10,
      grade: "5th Grade",
      school: "Sunnyvale Elementary School",
      profileImageUrl: "https://via.placeholder.com/128/007bff/FFFFFF?Text=Alex",
    },
    {
      id: 2,
      name: "Mia Williams",
      age: 8,
      grade: "3rd Grade",
      school: "Oakwood Academy for Bright Youngsters",
      profileImageUrl: "https://via.placeholder.com/128/28a745/FFFFFF?Text=Mia",
    },
    {
      id: 3,
      name: "Ethan Brown",
      age: 12,
      grade: "7th Grade",
      school: "Northwood Middle School of Performing Arts",
      profileImageUrl: "https://via.placeholder.com/128/ffc107/000000?Text=Ethan",
    },
    {
      id: 4,
      name: "Sophia Davis",
      age: 6,
      grade: "1st Grade",
      school: "Little Sprouts Kindergarten",
      profileImageUrl: "https://via.placeholder.com/128/dc3545/FFFFFF?Text=Sophia",
    },
  ]);

  // In the future, filters could be added here, e.g., search by name
  // const [searchTerm, setSearchTerm] = useState("");

  const displayedChildren = useMemo(() => {
    // If search/filter functionality were added, it would be applied here.
    // For now, it just returns all children.
    // Example of filtering:
    // if (!searchTerm) return childrenData;
    // return childrenData.filter(child =>
    //   child.name.toLowerCase().includes(searchTerm.toLowerCase())
    // );
    return childrenData;
  }, [childrenData /*, searchTerm */]); // Add dependencies like searchTerm if filters are used

  return (
    <div className="w-full min-h-screen bg-gray-50/50 p-4 md:p-6">
      <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-800">My Children</h2>

      
      <div className="mb-6 max-w-md">
        <input
          type="text"
          placeholder="Search child by name..."
          // value={searchTerm}
          // onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
     

      {displayedChildren.length === 0 ? (
        <div className="text-center text-gray-500 py-10 bg-white rounded-lg shadow">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="mt-4 text-xl font-medium">No children information available.</p>
          <p className="mt-2 text-sm">You currently have no children registered in the system.</p>
          <p className="mt-1 text-sm">If this is an error, please contact support or try adding a child.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedChildren.map((child) => (
            <div
              key={child.id}
              className="bg-white p-5 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out flex flex-col group"
            >
              <div className="flex flex-col items-center mb-4">
                <img
                  src={child.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(child.name)}&background=random&color=fff&size=100&font-size=0.5&bold=true`}
                  alt={`${child.name}'s profile`}
                  className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-blue-200 group-hover:border-blue-400 transition-all duration-300 shadow-md"
                />
                <h3 className="text-lg md:text-xl font-bold text-blue-700 group-hover:text-blue-800 transition-colors duration-300 mt-3 text-center truncate w-full" title={child.name}>
                  {child.name}
                </h3>
              </div>
              <div className="space-y-2 text-sm text-gray-700 flex-grow">
                <div className="flex justify-between items-center py-2 border-t border-gray-200">
                  <p className="font-medium text-gray-500">Age:</p>
                  <p className="font-semibold">{child.age} years old</p>
                </div>
                <div className="flex justify-between items-center py-2 border-t border-gray-200">
                  <p className="font-medium text-gray-500">Grade:</p>
                  <p className="font-semibold truncate" title={child.grade}>{child.grade}</p>
                </div>
                <div className="flex justify-between items-start py-2 border-t border-b border-gray-200">
                  <p className="font-medium text-gray-500 shrink-0 mr-2">School:</p>
                  <p className="font-semibold text-right break-words" title={child.school}>{child.school}</p>
                </div>
              </div>
              {/* Optional: Add a button for more details or actions */}
              
              <button className="mt-auto w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300">
                View Details
              </button>
             
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChildrenManagementForParent;
