import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../../../../context/AppContext";

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
  const [isSubmitting, setIsSubmitting] = useState(false); // Thêm trạng thái submitting

  // Kiểm tra số điện thoại parent tồn tại
  const checkParentPhoneNumber = async (phoneNumber) => {
    if (!phoneNumber) return false;
    setIsCheckingParent(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/checkParent/${phoneNumber}`);
      setIsCheckingParent(false);
      return data.exists; // API trả về { exists: true/false }
    } catch (error) {
      setIsCheckingParent(false);
      toast.error(
        error.response?.data?.message || "Error checking parent phone number"
      );
      return false;
    }
  };

  // Validation số điện thoại
  const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phoneNumber);
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Bật trạng thái submitting

    // Validation cho student
    if (formData.role === "student") {
      if (!formData.isAdultStudent) {
        // Kiểm tra parentPhoneNumber
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
        // Kiểm tra parent tồn tại
        const exists = await checkParentPhoneNumber(formData.parentPhoneNumber);
        setParentExists(exists);
        if (!exists) {
          toast.error("Parent with this phone number does not exist.");
          setIsSubmitting(false);
          return;
        }
      }
    }

    // Validation cho các trường cơ bản
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.role) {
      toast.error("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }

    // Gọi onSubmit nếu tất cả validation đều pass
    try {
      await onSubmit(e, formData); // Truyền formData vào onSubmit
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Failed to update user."
      );
    } finally {
      setIsSubmitting(false); // Tắt trạng thái submitting
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/30 bg-opacity-40 z-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl relative z-50 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4 text-center">
          {isEditMode ? "Update User" : "Add New User"}
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="First Name"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              className="border p-2 rounded-md w-full"
              required
              autoComplete="given-name"
              disabled={isSubmitting || loading}
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
              autoComplete="family-name"
              disabled={isSubmitting || loading}
            />
          </div>

          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="border p-2 rounded-md w-full"
            required
            autoComplete="email"
            disabled={isSubmitting || loading}
          />

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
            className="border p-2 rounded-md w-full"
            required={!isEditMode}
            autoComplete={isEditMode ? "current-password" : "new-password"}
            disabled={isSubmitting || loading}
          />

          <input
            type="text"
            placeholder="Phone Number (10 digits)"
            value={formData.phoneNumber || ""}
            onChange={(e) =>
              setFormData({ ...formData, phoneNumber: e.target.value })
            }
            className="border p-2 rounded-md w-full"
            autoComplete="tel"
            disabled={isSubmitting || loading}
          />

          <select
            value={formData.role}
            onChange={(e) =>
              setFormData({ ...formData, role: e.target.value })
            }
            className="border p-2 rounded-md w-full"
            required
            disabled={isSubmitting || loading}
          >
            <option value="">Select Role</option>
            <option value="parent">Parent</option>
            <option value="student">Student</option>
            <option value="consultant">Consultant</option>
          </select>

          {/* Student-specific fields */}
          {formData.role === "student" && (
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700 font-semibold">
                Adult Student:
              </label>
              <select
                value={formData.isAdultStudent ? "true" : "false"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    isAdultStudent: e.target.value === "true",
                  })
                }
                className="border p-2 rounded-md w-full"
                disabled={isSubmitting || loading}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          )}

          {/* Parent Phone Number (cho student không phải adult) */}
          {formData.role === "student" && !formData.isAdultStudent && (
            <div className="relative">
              <input
                type="text"
                placeholder="Parent Phone Number (10 digits)"
                value={formData.parentPhoneNumber || ""}
                onChange={(e) =>
                  setFormData({ ...formData, parentPhoneNumber: e.target.value })
                }
                className={`border p-2 rounded-md w-full ${
                  !parentExists && formData.parentPhoneNumber
                    ? "border-red-500"
                    : ""
                }`}
                autoComplete="tel"
                disabled={isSubmitting || loading}
              />
              {!parentExists && formData.parentPhoneNumber && (
                <p className="text-red-500 text-sm mt-1">
                  Parent with this phone number does not exist.
                </p>
              )}
              {isCheckingParent && (
                <p className="text-gray-500 text-sm mt-1">
                  Checking parent phone number...
                </p>
              )}
            </div>
          )}

          {/* Address (cho parent hoặc student là adult) */}
          {(formData.role === "parent" ||
            (formData.role === "student" && formData.isAdultStudent)) && (
            <div className="border p-4 rounded-md">
              <h4 className="text-md font-semibold mb-2">Address</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="House Number"
                  value={formData.address?.houseNumber || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, houseNumber: e.target.value },
                    })
                  }
                  className="border p-2 rounded-md w-full"
                  autoComplete="address-line1"
                  disabled={isSubmitting || loading}
                />
                <input
                  type="text"
                  placeholder="Street"
                  value={formData.address?.street || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, street: e.target.value },
                    })
                  }
                  className="border p-2 rounded-md w-full"
                  autoComplete="address-line2"
                  disabled={isSubmitting || loading}
                />
                <input
                  type="text"
                  placeholder="Ward/Commune"
                  value={formData.address?.ward || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, ward: e.target.value },
                    })
                  }
                  className="border p-2 rounded-md w-full"
                  autoComplete="address-level4"
                  disabled={isSubmitting || loading}
                />
                <input
                  type="text"
                  placeholder="District"
                  value={formData.address?.district || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, district: e.target.value },
                    })
                  }
                  className="border p-2 rounded-md w-full"
                  autoComplete="address-level3"
                  disabled={isSubmitting || loading}
                />
                <input
                  type="text"
                  placeholder="City"
                  value={formData.address?.city || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, city: e.target.value },
                    })
                  }
                  className="border p-2 rounded-md w-full"
                  autoComplete="address-level2"
                  disabled={isSubmitting || loading}
                />
                <input
                  type="text"
                  placeholder="Province"
                  value={formData.address?.province || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, province: e.target.value },
                    })
                  }
                  className="border p-2 rounded-md w-full"
                  autoComplete="address-level1"
                  disabled={isSubmitting || loading}
                />
                <input
                  type="text"
                  placeholder="Country"
                  value={formData.address?.country || "Vietnam"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, country: e.target.value },
                    })
                  }
                  className="border p-2 rounded-md w-full"
                  autoComplete="country-name"
                  disabled={isSubmitting || loading}
                />
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition"
              disabled={isSubmitting || loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-green-600 rounded-md hover:bg-green-700 transition"
              disabled={loading || isCheckingParent || isSubmitting}
            >
              {isSubmitting || loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;