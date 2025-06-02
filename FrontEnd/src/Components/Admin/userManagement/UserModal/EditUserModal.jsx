import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../../../../context/AppContext";
import { X, User, Users, MapPin, Phone } from "lucide-react";
import InformationSection from "../inputForm/InformationSection";

const EditUserModal = ({
  show,
  onClose,
  onSubmit,
  formData,
  setFormData,
  loading,
  isEditMode = false,
}) => {
  const { backendUrl } = useContext(AppContext);
  const [parentExists, setParentExists] = useState(true);
  const [isCheckingParent, setIsCheckingParent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if parent phone number exists
  const checkParentPhoneNumber = async (phoneNumber) => {
    if (!phoneNumber) return false;
    setIsCheckingParent(true);
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/admin/checkParent/${phoneNumber}`
      );
      setIsCheckingParent(false);
      return data.exists;
    } catch (error) {
      setIsCheckingParent(false);
      toast.error(
        error.response?.data?.message || "Error checking parent phone number"
      );
      return false;
    }
  };

  // Validate phone number
  const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phoneNumber);
  };

  // Handle role change
  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setFormData({
      ...formData,
      role: newRole,
      parentPhoneNumber: newRole === "student" ? "" : undefined,
      isAdultStudent: newRole === "student" ? false : undefined,
      address:
        newRole === "parent" || (newRole === "student" && formData.isAdultStudent)
          ? formData.address
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
    setParentExists(true); // Reset parent existence status
  };

  // Handle adult student change
  const handleAdultStudentChange = (e) => {
    const isAdult = e.target.value === "true";
    setFormData({
      ...formData,
      isAdultStudent: isAdult,
      parentPhoneNumber: isAdult ? undefined : formData.parentPhoneNumber,
      address: isAdult
        ? formData.address
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
    setParentExists(true); // Reset parent existence status
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation for address
    if (
      (formData.role === "parent" ||
        (formData.role === "student" && formData.isAdultStudent)) &&
      (!formData.address?.ward || !formData.address?.city)
    ) {
      toast.error("Ward/Commune and City are required for address.");
      setIsSubmitting(false);
      return;
    }

    // Validation for student
    if (formData.role === "student" && !formData.isAdultStudent) {
      if (!formData.parentPhoneNumber) {
        toast.error("Parent phone number is required for non-adult students.");
        setIsSubmitting(false);
        return;
      }
      if (!validatePhoneNumber(formData.parentPhoneNumber)) {
        toast.error("Parent phone number must be 10 digits.");
        setIsSubmitting(false);
        return;
      }
      const exists = await checkParentPhoneNumber(formData.parentPhoneNumber);
      setParentExists(exists);
      if (!exists) {
        toast.error("Parent with this phone number does not exist.");
        setIsSubmitting(false);
        return;
      }
    }

    // Validation for basic fields
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.role
    ) {
      toast.error("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }

    // Submit form data
    try {
      await onSubmit(e, formData);
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Failed to update user."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!show) return null;

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
              <h3 className="text-xl font-bold">
                {isEditMode ? "Update User" : "Add New User"}
              </h3>
              <p className="text-blue-100 text-sm">
                {isEditMode ? "Edit user details" : "Fill in user details"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors"
            disabled={isSubmitting || loading || isCheckingParent}
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
              <InformationSection
                formData={formData}
                setFormData={setFormData}
                disabled={isSubmitting || loading || isCheckingParent}
              />
              {/* Password Field */}
              <div className="relative mt-4">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  placeholder={
                    isEditMode
                      ? "New Password (leave blank to keep current)"
                      : "Password"
                  }
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 placeholder-gray-400 text-gray-700 text-sm"
                  autoComplete={isEditMode ? "current-password" : "new-password"}
                  required={!isEditMode}
                  disabled={isSubmitting || loading || isCheckingParent}
                />
                {!isEditMode && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full"></span>
                )}
              </div>
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
                  disabled={isSubmitting || loading || isCheckingParent}
                >
                  <option value="">Select Role</option>
                  <option value="parent">Parent</option>
                  <option value="student">Student</option>
                  <option value="consultant">Consultant</option>
                </select>
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full"></span>
              </div>
            </div>

            {/* Adult Student Status */}
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
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={formData.isAdultStudent ? "true" : "false"}
                    onChange={handleAdultStudentChange}
                    className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-700 appearance-none"
                    disabled={isSubmitting || loading || isCheckingParent}
                  >
                    <option value="true">Adult Student</option>
                    <option value="false">Non-Adult Student</option>
                  </select>
                </div>
              </div>
            )}

            {/* Parent Phone Number */}
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
                    placeholder="Parent Phone Number (10 digits)"
                    value={formData.parentPhoneNumber || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        parentPhoneNumber: e.target.value,
                      })
                    }
                    className={`w-full pl-12 pr-4 py-3 bg-white border-2 ${
                      !parentExists && formData.parentPhoneNumber
                        ? "border-red-500"
                        : "border-gray-200"
                    } rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 placeholder-gray-400 text-gray-700 text-sm`}
                    autoComplete="tel"
                    disabled={isSubmitting || loading || isCheckingParent}
                  />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full"></span>
                </div>
                {!parentExists && formData.parentPhoneNumber && (
                  <p className="text-red-500 text-sm mt-2">
                    Parent with this phone number does not exist.
                  </p>
                )}
                {isCheckingParent && (
                  <p className="text-gray-500 text-sm mt-2">
                    Checking parent phone number...
                  </p>
                )}
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
                        disabled={isSubmitting || loading || isCheckingParent}
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
                disabled={isSubmitting || loading || isCheckingParent}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || isCheckingParent || isSubmitting}
                className="px-6 py-3 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading || isSubmitting || isCheckingParent ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4" />
                    {isEditMode ? "Update User" : "Add User"}
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

export default EditUserModal;