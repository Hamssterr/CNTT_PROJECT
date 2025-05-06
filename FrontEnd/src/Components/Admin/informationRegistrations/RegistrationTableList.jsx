import React, { useContext, useEffect, useState } from "react";
import { Search, UserPlus, Check, Tally1, Eye } from "lucide-react";
import { AppContext } from "../../../context/AppContext";
import Loading from "../../Loading";
import axios from "axios";
import { toast } from "react-toastify";
import RegistrationDetailModal from "./RegistrationDetail";

const TABS = [
  { label: "All", value: "all" },
  { label: "Newest", value: "newStudent" },
];

const TABLE_HEAD = [
  "Name",
  "Email",
  "Create At",
  "Phone Number",
  "View & Done",
];

const RegistrationTableList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [registrationDetail, setRegistrationDetail] = useState(null);
  const { backendUrl } = useContext(AppContext);
  const itemsPerPage = 8;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const filteredData = () => {
    let data = userData;
    if (searchQuery) {
      data = data.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (activeTab === "newStudent") {
      return data.sort(
        (a, b) => new Date(b.registeredAt) - new Date(a.registeredAt)
      );
    }
    return data;
  };

  const currentItems = filteredData().slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData().length / itemsPerPage);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${backendUrl}/api/admin/registrations`,
        {
          withCredentials: true,
        }
      );
      if (data.success) {
        setUserData(data.data);
      } else {
        setUserData([]);
        toast.error(data.message || "No data received");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [backendUrl]);

  const handleView = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/admin/${id}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setRegistrationDetail(response.data.data);
        setModalOpen(true);
      } else {
        toast.error(response.data.message || "Failed to fetch details");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch details");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setRegistrationDetail(null);
  };

  return (
    <div className="w-full h-full bg-white rounded-lg shadow-md border border-gray-200">
      {/* Header */}
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h5 className="text-xl font-bold text-gray-800">
              Registration Information List
            </h5>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100">
              View All
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 border rounded-md hover:bg-blue-700">
              <UserPlus size={16} /> Add Course
            </button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            {TABS.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setActiveTab(value)}
                className={`px-4 py-2 text-sm rounded-md ${
                  activeTab === value
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64 bg-gray-100/50">
          <Loading />
        </div>
      ) : filteredData().length === 0 ? (
        <div className="flex justify-center items-center h-64 bg-gray-100/50">
          <p className="text-gray-600">No registration data available</p>
        </div>
      ) : (
        <div className="overflow-x-auto px-0">
          <table className="w-full min-w-max text-left table-auto">
            <thead>
              <tr className="bg-gray-50 border-y border-gray-200">
                {TABLE_HEAD.map((head, index) => (
                  <th
                    key={head}
                    className="p-4 text-sm font-semibold text-gray-700"
                  >
                    <div className="flex items-center justify-between gap-2">
                      {head}
                      {index !== TABLE_HEAD.length - 1 && (
                        <Tally1 size={16} className="text-gray-500" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentItems.map((user, index) => {
                const isLast = index === currentItems.length - 1;
                const classes = isLast ? "p-4" : "p-4 border-b border-gray-100";

                return (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50 transition-all"
                  >
                    <td className={classes}>
                      <span className="text-sm font-medium text-gray-800">
                        {user.name || "N/A"}
                      </span>
                    </td>
                    <td className={classes}>
                      <span className="text-sm font-medium text-gray-800">
                        {user.email || "N/A"}
                      </span>
                    </td>
                    <td className={classes}>
                      <span className="text-sm font-medium text-gray-800">
                        {user.registeredAt
                          ? new Date(user.registeredAt).toLocaleDateString(
                              "vi-VN",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            )
                          : "N/A"}
                      </span>
                    </td>
                    <td className={classes}>
                      <span className="text-sm font-medium text-gray-800">
                        {user.phoneNumber || "N/A"}
                      </span>
                    </td>
                    <td className={classes}>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleView(user._id)}
                          className="p-2 rounded hover:bg-blue-100 text-gray-600 hover:text-blue-600"
                        >
                          <Eye size={18} />
                        </button>
                        <button className="p-2 rounded hover:bg-blue-100 text-gray-600 hover:text-blue-600">
                          <Check size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <RegistrationDetailModal
        isOpen={modalOpen}
        onClose={closeModal}
        registrationDetail={registrationDetail}
      />

      {/* Footer */}
      <div className="flex items-center justify-between p-4 border-t border-gray-200">
        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationTableList;
