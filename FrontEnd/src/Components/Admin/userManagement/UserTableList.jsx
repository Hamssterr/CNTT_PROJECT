import { React, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../../context/AppContext";
import { Search, ChevronUp, Pencil, UserPlus, Trash2 } from "lucide-react";
import Loading from "../../Loading";
import image from "../../../assets/3.jpg";

const TABS = [
  { label: "All", value: "all" },
  { label: "Admin", value: "unmonitored" },
  { label: "Finance", value: "finance" },
  { label: "Student", value: "student" },
  { label: "Parent", value: "parent" },
];

const TABLE_HEAD = [
  "Member",
  "Function",
  "Status",
  "Employed",
  "Update & Delete",
];

const SortableTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { backendUrl } = useContext(AppContext);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = userData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(userData.length / itemsPerPage);

  const fetchingUserData = async () => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;

      const { data } = await axios.get(`${backendUrl}/api/admin/getDataUsers`);
      if (data.success) {
        setUserData(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchingUserData();
  }, [backendUrl]);

  const handleUpdate = () => {
    console.log("Updated");
  };

  const handleDelete = () => {
    console.log("Deleted!");
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "",
    });
  }

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(
        `${backendUrl}/api/admin/createNewUser`,
        formData
      );

      if (data.success) {
        toast.success("Added successfully");
        fetchingUserData();

        resetForm();

        setShowForm(false);
      } else {
        toast.error(data.message || "Failed to add memeber");
      }
    } catch (error) {
      console.error("Create error:", error.response?.data);
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full bg-white rounded-lg shadow-md border border-gray-200 relative">
      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-40 z-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative z-50">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Add New Member
            </h3>
            <form onSubmit={handleOnSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                className="border p-2 rounded-md w-full"
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                className="border p-2 rounded-md w-full"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="border p-2 rounded-md w-full"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="border p-2 rounded-md w-full"
                required
              />

              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="border p-2 rounded-md w-full"
                required
              >
                <option value="">Select Role</option>
                <option value="student">Student</option>
                <option value="parent">Parent</option>
                <option value="finance">Finance</option>
              </select>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false); 
                    resetForm();
                  } }
                  className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm text-white bg-green-600 rounded-md hover:bg-green-700 transition"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h5 className="text-xl font-bold text-gray-800">Members list</h5>
            <p className="text-sm text-gray-600 mt-1">
              See information about all members
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition">
              View all
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
            >
              <UserPlus size={16} />
              Add member
            </button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex gap-2 w-full md:w-auto">
            {TABS.map(({ label, value }) => (
              <button
                key={value}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition"
              >
                {label}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            />
          </div>
        </div>
      </div>

      {/* Table Body */}
      {loading ? (
        <div className="p-6 text-center text-blue-600 font-semibold">
          <Loading />
        </div>
      ) : (
        <div className="overflow-x-auto px-0">
          <table className="w-full min-w-max text-left">
            <thead>
              <tr className="bg-gray-50 border-y border-gray-200">
                {TABLE_HEAD.map((head, index) => (
                  <th
                    key={head}
                    className="p-4 text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center justify-between gap-2">
                      {head}
                      {index !== TABLE_HEAD.length - 1 && (
                        <ChevronUp size={16} className="text-gray-500" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentItems.map((user, index) => {
                const isLast = index === userData.length - 1;
                const classes = isLast ? "p-4" : "p-4 border-b border-gray-100";

                return (
                  <tr key={user.email} className="hover:bg-gray-50 transition">
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <img
                          src={user.img || image}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-800 font-medium">
                            {user.lastName + " "}
                            {user.firstName}
                          </span>
                          <span className="text-sm text-gray-500">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-800 font-medium">
                          {user.job || "N/A"}
                        </span>
                        <span className="text-sm text-gray-500">
                          {user.org || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className={classes}>
                      <span
                        className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                          user.online
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.online ? "online" : "offline"}
                      </span>
                    </td>
                    <td className={classes}>
                      <span className="text-sm text-gray-800">
                        {user.role || "Unknown"}
                      </span>
                    </td>
                    <td className={classes}>
                      <button
                        onClick={handleUpdate}
                        className="text-gray-600 hover:text-blue-600 transition"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={handleDelete}
                        className="pl-2 text-red-600 hover:text-blue-600 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between p-4 border-t border-gray-200">
        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SortableTable;
