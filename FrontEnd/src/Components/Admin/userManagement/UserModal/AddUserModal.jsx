import React from "react";
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
    <div className="fixed inset-0 bg-black/30 bg-opacity-40 z-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl relative z-50 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4 text-center">Add New User</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Basic Info */}

          <InformationSection formData={formData} setFormData={setFormData} />

          <select
            value={formData.role}
            onChange={handleRoleChange}
            className="border p-2 rounded-md w-full"
            required
          >
            <option value="">Select Role</option>
            <option value="parent">Parent</option>
            <option value="student">Student</option>
          </select>

          {/* Checkbox cho adult student */}
          {formData.role === "student" && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isAdultStudent || false}
                onChange={handleAdultStudentChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label className="text-sm text-gray-700">
                This student is an adult
              </label>
            </div>
          )}

          {/* Trường nhập số điện thoại của parent (chỉ hiển thị nếu không phải adult student) */}
          {formData.role === "student" && !formData.isAdultStudent && (
            <div className="flex flex-col gap-1">
              <input
                type="text"
                placeholder="Parent's Phone Number (optional)"
                value={formData.parentPhoneNumber || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    parentPhoneNumber: e.target.value,
                  })
                }
                className="border p-2 rounded-md w-full"
                autoComplete="tel"
              />
              <span className="text-sm text-gray-500">
                Leave blank if the student does not need to be linked to a
                parent.
              </span>
            </div>
          )}

          {/* Address (hiển thị khi role là parent hoặc student là adult) */}
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
                      address: {
                        ...formData.address,
                        houseNumber: e.target.value,
                      },
                    })
                  }
                  className="border p-2 rounded-md w-full"
                  autoComplete="address-line1"
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
                  required // Bắt buộc cho cả parent và adult student
                  autoComplete="address-level4"
                />
                <input
                  type="text"
                  placeholder="District"
                  value={formData.address?.district || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: {
                        ...formData.address,
                        district: e.target.value,
                      },
                    })
                  }
                  className="border p-2 rounded-md w-full"
                  autoComplete="address-level3"
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
                  required // Bắt buộc cho cả parent và adult student
                  autoComplete="address-level2"
                />
                <input
                  type="text"
                  placeholder="Province"
                  value={formData.address?.province || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: {
                        ...formData.address,
                        province: e.target.value,
                      },
                    })
                  }
                  className="border p-2 rounded-md w-full"
                  autoComplete="address-level1"
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
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-green-600 rounded-md hover:bg-green-700 transition"
              disabled={loading}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
