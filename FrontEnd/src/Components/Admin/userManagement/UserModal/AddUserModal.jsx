import React from "react";
import { X, User, Users, MapPin, Phone } from "lucide-react";
import InformationSection from "../inputForm/InformationSection";

const AddUserModal = ({
  show,
  onClose,
  onSubmit,
  formData,
  setFormData,
  loading,
}) => {
  if (!show) return null;

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setFormData({
      ...formData,
      role: newRole,
      parentPhoneNumber: newRole === "student" ? "" : undefined,
      isAdultStudent: newRole === "student" ? false : undefined, // Reset khi thay đổi role
      address:
        newRole === "parent" ||
        (newRole === "student" && formData.isAdultStudent)
          ? formData.address // Giữ nguyên address nếu là parent hoặc student với isAdultStudent: true
          : {
              houseNumber: "",
              street: "",
              ward: "",
              district: "",
              city: "",
              province: "",
              country: "Vietnam",
            },
    });
  };

  const handleAdultStudentChange = (e) => {
    const isAdult = e.target.checked;
    setFormData({
      ...formData,
      isAdultStudent: isAdult,
      parentPhoneNumber: isAdult ? undefined : formData.parentPhoneNumber, // Xóa parentPhoneNumber nếu là adult
      address: isAdult
        ? formData.address // Giữ nguyên address nếu chuyển sang adult student
        : {
            houseNumber: "",
            street: "",
            ward: "",
            district: "",
            city: "",
            province: "",
            country: "Vietnam",
          }, // Reset address nếu không phải adult student
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation phía client cho address
    if (
      (formData.role === "parent" ||
        (formData.role === "student" && formData.isAdultStudent)) &&
      (!formData.address?.ward || !formData.address?.city)
    ) {
      alert("Ward/Commune and City are required for address.");
      return;
    }
    // Log dữ liệu gửi đi để kiểm tra
    console.log("Data being submitted:", formData);
    onSubmit(e);
  };

 return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Add New User</h3>
              <p className="text-blue-100 text-sm">Fill in user details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-800">
                  Personal Information
                </h4>
              </div>
              <InformationSection formData={formData} setFormData={setFormData} />
            </div>

            {/* Role Selection */}
            <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-800">
                  Role Selection
                </h4>
              </div>
              <div className="relative">
                <select
                  value={formData.role}
                  onChange={handleRoleChange}
                  className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 text-gray-700 appearance-none"
                  required
                >
                  <option value="">Select Role</option>
                  <option value="parent">Parent</option>
                  <option value="student">Student</option>
                </select>
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Adult Student Checkbox */}
            {formData.role === "student" && (
              <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800">
                    Student Status
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isAdultStudent || false}
                    onChange={handleAdultStudentChange}
                    className="h-5 w-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    id="adultStudent"
                  />
                  <label
                    htmlFor="adultStudent"
                    className="text-sm text-gray-700 font-medium"
                  >
                    This student is an adult
                  </label>
                </div>
              </div>
            )}

            {/* Parent's Phone Number */}
            {formData.role === "student" && !formData.isAdultStudent && (
              <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800">
                    Parent Information
                  </h4>
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    placeholder="Parent's Phone Number (optional)"
                    value={formData.parentPhoneNumber || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        parentPhoneNumber: e.target.value,
                      })
                    }
                    className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 placeholder-gray-400 text-gray-700 text-sm"
                    autoComplete="tel"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Leave blank if the student does not need to be linked to a
                  parent.
                </p>
              </div>
            )}

            {/* Address */}
            {(formData.role === "parent" ||
              (formData.role === "student" && formData.isAdultStudent)) && (
              <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-green-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800">
                    Address Information
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      key: "houseNumber",
                      placeholder: "House Number",
                      autoComplete: "address-line1",
                    },
                    {
                      key: "street",
                      placeholder: "Street",
                      autoComplete: "address-line2",
                    },
                    {
                      key: "ward",
                      placeholder: "Ward/Commune",
                      autoComplete: "address-level4",
                      required: true,
                    },
                    {
                      key: "district",
                      placeholder: "District",
                      autoComplete: "address-level3",
                    },
                    {
                      key: "city",
                      placeholder: "City",
                      autoComplete: "address-level2",
                      required: true,
                    },
                    {
                      key: "province",
                      placeholder: "Province",
                      autoComplete: "address-level1",
                    },
                    {
                      key: "country",
                      placeholder: "Country",
                      autoComplete: "country-name",
                      defaultValue: "Vietnam",
                    },
                  ].map((field) => (
                    <div key={field.key} className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder={field.placeholder}
                        value={
                          formData.address?.[field.key] ||
                          field.defaultValue ||
                          ""
                        }
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            address: {
                              ...formData.address,
                              [field.key]: e.target.value,
                            },
                          })
                        }
                        className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 placeholder-gray-400 text-gray-700 text-sm"
                        autoComplete={field.autoComplete}
                        required={field.required}
                      />
                      {field.required && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full"></span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex justify-end gap-3 p-6 bg-gray-50 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-3 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4" />
                    Add User
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
