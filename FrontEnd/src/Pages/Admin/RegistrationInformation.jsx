import React, { useContext, useEffect, useState } from "react";
import { Search, Eye, RefreshCw, Mail, Phone } from "lucide-react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../../Components/Loading";
import NavbarAdmin from "../../Components/Admin/Navbar";
import SidebarAdmin from "../../Components/Admin/Sidebar";
import RegistrationDetailModal from "../../Components/Admin/informationRegistrations/RegistrationDetail";

// Update TABLE_HEAD array
const TABLE_HEAD = [
  "Parent Information",
  "Student Information",
  "Course",
  "Status",
  "Payment Status",
  "Actions",
];

const RegistrationInformation = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [registrationDetail, setRegistrationDetail] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Thêm trạng thái phân trang
  const [itemsPerPage] = useState(5); // Số mục mỗi trang
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
      toast.error("Failed to fetch registrations.", error);
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

  // Logic phân trang
  const totalPages = Math.ceil(filteredRegistrations.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRegistrations.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Reset về trang 1 khi searchQuery thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <div className="flex flex-col min-h-screen mt-[85px]">
      <div className="fixed top-0 left-0 right-0 z-50">
        <NavbarAdmin />
      </div>
      <div className="flex flex-1">
        <div className="fixed top-[70px] left-0 bottom-0 z-40 w-[280px]">
          <SidebarAdmin />
        </div>
        <main className="flex-1 p-5 md:ml-30">
          {/* Nội dung chính */}
          <div>
            <div className="w-full min-h-screen bg-gray-50/50">
              <div className="mx-auto px-1">
                {/* Header Section */}
                <div className="bg-white rounded-xl shadow-sm mb-6 p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
                        Registration Management
                      </h1>
                      <p className="text-gray-600 mt-1">
                        {filteredRegistrations.length} total registrations
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
                    <div className="flex flex-col justify-center items-center h-64 p-6">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                          <svg
                            className="w-8 h-8 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                        <p className="text-gray-500 text-lg font-medium">
                          No registrations found
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                          Try adjusting your search or filters
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Desktop Table View */}
                      <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                              {TABLE_HEAD.map((head) => (
                                <th
                                  key={head}
                                  className="px-6 py-4 text-left text-sm font-semibold text-gray-900 tracking-wide"
                                >
                                  {head}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {currentItems.map((registration, index) => (
                              <tr
                                key={registration._id}
                                className={`hover:bg-blue-50/50 transition-all duration-200 ${
                                  index % 2 === 0 ? "bg-gray-50/30" : "bg-white"
                                }`}
                              >
                                {/* Parent Information Column */}
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                      {registration.name
                                        ?.charAt(0)
                                        .toUpperCase() || "N"}
                                    </div>
                                    <div className="flex-1">
                                      <div className="font-medium text-gray-900 mb-1">
                                        {registration.name || "N/A"}
                                      </div>
                                      <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                          <Mail
                                            size={14}
                                            className="text-blue-500 flex-shrink-0"
                                          />
                                          <span className="truncate">
                                            {registration.email || "N/A"}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                          <Phone
                                            size={14}
                                            className="text-blue-500 flex-shrink-0"
                                          />
                                          <span>
                                            {registration.phone || "N/A"}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </td>

                                {/* Student Information Column */}
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                      {registration.studentName
                                        ?.charAt(0)
                                        .toUpperCase() || "S"}
                                    </div>
                                    <div className="flex-1">
                                      <div className="font-medium text-gray-900 mb-1">
                                        {registration.studentName || "N/A"}
                                      </div>
                                      <div className="space-y-1">
                                        {registration.studentEmail && (
                                          <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Mail
                                              size={14}
                                              className="text-purple-500 flex-shrink-0"
                                            />
                                            <span className="truncate">
                                              {registration.studentEmail}
                                            </span>
                                          </div>
                                        )}
                                        {registration.studentPhone && (
                                          <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Phone
                                              size={14}
                                              className="text-purple-500 flex-shrink-0"
                                            />
                                            <span>
                                              {registration.studentPhone}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </td>

                                <td className="px-6 py-4">
                                  <div className="flex flex-col gap-2">
                                    <div className="flex flex-wrap gap-1">
                                      {Array.isArray(registration.course)
                                        ? registration.course.map((c, idx) => (
                                            <span
                                              key={idx}
                                              className="inline-block bg-blue-100 text-blue-800 rounded-full px-2 py-1 text-xs font-medium"
                                            >
                                              {c}
                                            </span>
                                          ))
                                        : registration.course}
                                    </div>
                                  </div>
                                </td>

                                {/* Status Column */}
                                <td className="px-6 py-4">
                                  <span
                                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                                      registration.status === "Pending"
                                        ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                        : registration.status === "Contacted"
                                        ? "bg-green-100 text-green-800 border border-green-200"
                                        : "bg-red-100 text-red-800 border border-red-200"
                                    }`}
                                  >
                                    {registration.status || "N/A"}
                                  </span>
                                </td>

                                <td className="px-6 py-4">
                                  <span
                                    className={`inline-flex items-center px-10 py-1.5 rounded-full text-xs font-semibold ${
                                      registration.paymentStatus === "Unpaid"
                                        ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                        : registration.paymentStatus === "Paid"
                                        ? "bg-green-100 text-green-800 border border-green-200"
                                        : "bg-red-100 text-red-800 border border-red-200"
                                    }`}
                                  >
                                    {registration.paymentStatus || "N/A"}
                                  </span>
                                </td>

                                {/* Actions Column */}
                                <td className="px-6 py-4">
                                  <button
                                    onClick={() => handleView(registration)}
                                    className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-blue-600 hover:text-white hover:bg-blue-600 bg-blue-50 transition-all duration-200"
                                  >
                                    <Eye size={16} className="mr-1.5" />
                                    <span className="text-sm font-medium"></span>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Mobile Card View */}
                      <div className="lg:hidden">
                        <div className="divide-y divide-gray-100">
                          {currentItems.map((registration, index) => (
                            <div
                              key={registration._id}
                              className="p-6 hover:bg-gray-50/50 transition-colors border-b border-gray-100 last:border-b-0"
                            >
                              <div className="space-y-4">
                                {/* Parent Information */}
                                <div className="flex items-start gap-3">
                                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                    {registration.name
                                      ?.charAt(0)
                                      .toUpperCase() || "N"}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2">
                                      <h3 className="font-semibold text-gray-900">
                                        Parent: {registration.name || "N/A"}
                                      </h3>
                                      <span
                                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                          registration.status === "Pending"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : registration.status ===
                                              "Contacted"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                        }`}
                                      >
                                        {registration.status || "N/A"}
                                      </span>
                                    </div>
                                    <div className="space-y-1.5">
                                      <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Mail
                                          size={14}
                                          className="text-blue-500 flex-shrink-0"
                                        />
                                        <span className="truncate">
                                          {registration.email || "N/A"}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Phone
                                          size={14}
                                          className="text-blue-500 flex-shrink-0"
                                        />
                                        <span>
                                          {registration.phone || "N/A"}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Student Information */}
                                <div className="flex items-start gap-3 pl-4">
                                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                    {registration.studentName
                                      ?.charAt(0)
                                      .toUpperCase() || "S"}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-gray-900 mb-1">
                                      {registration.studentName || "N/A"}
                                    </div>
                                    <div className="space-y-1.5">
                                      {registration.studentEmail && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                          <Mail
                                            size={14}
                                            className="text-purple-500 flex-shrink-0"
                                          />
                                          <span className="truncate">
                                            {registration.studentEmail}
                                          </span>
                                        </div>
                                      )}
                                      {registration.studentPhone && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                          <Phone
                                            size={14}
                                            className="text-purple-500 flex-shrink-0"
                                          />
                                          <span>
                                            {registration.studentPhone}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Tablet View (md to lg) */}
                      <div className="hidden md:block lg:hidden overflow-x-auto">
                        <div className="divide-y divide-gray-100">
                          {currentItems.map((registration, index) => (
                            <div
                              key={registration._id}
                              className="p-6 hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                    {registration.name
                                      ? registration.name
                                          .charAt(0)
                                          .toUpperCase()
                                      : "N"}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">
                                          {registration.name || "N/A"}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                          Student:{" "}
                                          {registration.studentName || "N/A"}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-gray-600 mb-1">
                                          {registration.email || "N/A"}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                          {registration.phone || "N/A"}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span
                                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                                      registration.status === "Pending"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : registration.status === "Contacted"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {registration.status || "N/A"}
                                  </span>
                                  <button
                                    onClick={() => handleView(registration)}
                                    className="inline-flex items-center justify-center w-10 h-10 rounded-full text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                                  >
                                    <Eye size={18} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Enhanced Footer */}
                      <div className="flex flex-col sm:flex-row items-center justify-between p-4 lg:p-6 bg-gray-50/50 backdrop-blur-sm border-t border-gray-200/50 gap-4">
                        <div className="text-sm text-gray-600 font-medium order-2 sm:order-1">
                          Showing{" "}
                          <span className="text-gray-900 font-semibold">
                            {currentItems.length > 0 ? indexOfFirstItem + 1 : 0}
                            -{indexOfFirstItem + currentItems.length}
                          </span>{" "}
                          of{" "}
                          <span className="text-gray-900 font-semibold">
                            {filteredRegistrations.length}
                          </span>{" "}
                          registrations
                        </div>
                        <div className="flex items-center gap-2 lg:gap-3 order-1 sm:order-2">
                          <button
                            className="px-3 lg:px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() =>
                              setCurrentPage((prev) => Math.max(prev - 1, 1))
                            }
                            disabled={currentPage === 1}
                          >
                            Previous
                          </button>
                          <div className="flex items-center gap-2">
                            <span className="px-3 lg:px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-100 rounded-xl">
                              {currentPage}
                            </span>
                            <span className="text-gray-500 text-sm">
                              of {totalPages}
                            </span>
                          </div>
                          <button
                            disabled={
                              currentPage === totalPages || totalPages === 0
                            }
                            onClick={() =>
                              setCurrentPage((prev) =>
                                Math.min(prev + 1, totalPages)
                              )
                            }
                            className="px-3 lg:px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <RegistrationDetailModal
                isOpen={modalOpen}
                onClose={closeModal}
                registrationDetail={registrationDetail}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RegistrationInformation;
