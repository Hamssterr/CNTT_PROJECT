import React, { useState, useMemo } from "react";
import { useContext } from "react";
import { AppContext } from "../../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
import Loading from "../../Loading";
import ChildDetailModal from "./ChildDetailModal";

const ChildrenManagementForParent = () => {
  const { backendUrl } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [childrenData, setChildrenData] = useState([]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);
  const [childClasses, setChildClasses] = useState([]);

  const fetchChildrenData = async () => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;

      const response = await axios.get(
        `${backendUrl}/api/parent/getDataChildrenForParent`
      );
      const { data } = response;

      if (data.success && Array.isArray(data.data)) {
        setChildrenData(data.data);
      } else {
        setChildrenData([]);
        toast.error(data.message || "No children found");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load children data"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchChildClasses = async (childId) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/parent/getClassWithHaveChildren`,
        {
          params: { childId },
          withCredentials: true,
        }
      );
      const { data } = response;

      if (data.success && Array.isArray(data.data)) {
        setChildClasses(data.data);
      } else {
        setChildClasses([]);
        toast.error(data.message || "No classes found for this child");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load class data");
      setChildClasses([]);
    }
  };

  const handleViewDetails = (child) => {
    setSelectedChild(child);
    setIsDetailModalOpen(true);
    fetchChildClasses(child.id);
  };

  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setSelectedChild(null);
    setChildClasses([]);
  };

  useEffect(() => {
    fetchChildrenData();
  }, [backendUrl]);

  const displayedChildren = useMemo(() => {
    return childrenData;
  }, [childrenData]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="w-full min-h-screen bg-gray-50/50 p-4 md:p-6">
      {/* <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-800">
        My Children
      </h2> */}

      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            My Children
          </span>
        </h2>
        <p className="mt-2 text-gray-600">Manage and view your children's</p>
      </div>

      {loading ? (
        <div>
          <Loading />
        </div>
      ) : displayedChildren.length === 0 ? (
        <div className="text-center text-gray-500 py-10 bg-white rounded-lg shadow">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="mt-4 text-xl font-medium">
            No children information available.
          </p>
          <p className="mt-2 text-sm">
            You currently have no children registered in the system.
          </p>
          <p className="mt-1 text-sm">
            If this is an error, please contact support or try adding a child.
          </p>
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
                  src={
                    child.profileImage
                      ? child.profileImage
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          `${child.firstName} ${child.lastName}`
                        )}&background=random&color=fff&size=100&font-size=0.5&bold=true`
                  }
                  alt={`${child.firstName}'s profile`}
                  className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-blue-200 group-hover:border-blue-400 transition-all duration-300 shadow-md"
                />
                <h3
                  className="text-lg md:text-xl font-bold text-blue-700 group-hover:text-blue-800 transition-colors duration-300 mt-3 text-center truncate w-full"
                  title={`${child.firstName} ${child.lastName}`}
                >
                  {`${child.firstName} ${child.lastName}`}
                </h3>
              </div>
              <div className="space-y-2 text-sm text-gray-700 flex-grow">
                <div className="flex justify-between items-center py-2 border-t border-gray-200">
                  <p className="font-medium text-gray-500">Name:</p>
                  <p className="font-semibold">{`${child.firstName} ${child.lastName}`}</p>
                </div>
              </div>
              <button
                onClick={() => handleViewDetails(child)}
                className="mt-auto w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      <ChildDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseModal}
        child={selectedChild}
        classes={childClasses}
      />
    </div>
  );
};

export default ChildrenManagementForParent;
