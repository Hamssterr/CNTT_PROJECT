import React, { useContext, useEffect, useState } from "react";
import { Search, UserPlus, Check, Eye, RefreshCw } from "lucide-react";
import { AppContext } from "../../../context/AppContext";
import Loading from "../../Loading";
import axios from "axios";
import { toast } from "react-toastify";
import RegistrationDetailModal from "./RegistrationDetail";

const TABLE_HEAD = [
  "Parent's Name",
  "Student's Name",
  "Email",
  "Phone Number",
  "Status",
  "Actions",
];

const RegistrationTableList = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [registrationDetail, setRegistrationDetail] = useState(null);
  const { backendUrl } = useContext(AppContext);

  // Fetch registrations data
  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${backendUrl}/api/consultant/getLeadUsers`
      );
      if (data.success) {
        setRegistrations(data.leadUsers);
      } else {
        toast.error(data.message || "Failed to fetch registrations.");
      }
    } catch (error) {
      toast.error("Failed to fetch registrations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleView = (registration) => {
    setRegistrationDetail(registration);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setRegistrationDetail(null);
  };

  const filteredRegistrations = registrations.filter((registration) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      (registration.name || "").toLowerCase().includes(searchTerm) ||
      (registration.studentName || "").toLowerCase().includes(searchTerm) ||
      (registration.email || "").toLowerCase().includes(searchTerm) ||
      (registration.phone || "").toLowerCase().includes(searchTerm) ||
      (registration.status || "").toLowerCase().includes(searchTerm)
    );
  });

  return (
    <div className="w-full min-h-screen bg-gray-50/50">
      <div className="mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm mb-6 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Registration Management
              </h1>
              <p className="text-gray-600 mt-1">
                View and manage course registrations
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchRegistrations}
                className="p-2 text-gray-600 hover:text-gray-900 bg-white rounded-lg shadow-sm hover:shadow transition-all"
                title="Refresh"
              >
                <RefreshCw size={20} />
              </button>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search registrations..."
                  className="w-[300px] pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <Search
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loading />
            </div>
          ) : filteredRegistrations.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-64">
              <p className="text-gray-500 text-lg">No registrations found</p>
              <p className="text-gray-400 text-sm mt-1">
                Try adjusting your search
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {TABLE_HEAD.map((head) => (
                      <th
                        key={head}
                        className="px-6 py-4 text-left text-sm font-semibold text-gray-900"
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRegistrations.map((registration, index) => (
                    <tr
                      key={registration._id}
                      className={`hover:bg-blue-50/30 transition-colors ${
                        index % 2 === 0 ? "bg-gray-50/30" : ""
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="font-medium text-gray-900">
                            {registration.name || "N/A"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {registration.studentName || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {registration.email || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {registration.phone || "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            registration.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : registration.status === "Contacted"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {registration.status || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleView(registration)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <RegistrationDetailModal
        isOpen={modalOpen}
        onClose={closeModal}
        registrationDetail={registrationDetail}
      />
    </div>
  );
};

export default RegistrationTableList;
