import React from "react";

import InformationSection from "../inputForm/InformationSection";

const AddEmployeeModal = ({
  show,
  onClose,
  onSubmit,
  formData,
  setFormData,
  loading,
}) => {
  // Thêm degree mới
  const addDegree = () => {
    setFormData({
      ...formData,
      degree: [
        ...formData.degree,
        { name: "", institution: "", year: "", major: "" },
      ],
    });
  };

  // Xóa degree
  const removeDegree = (index) => {
    if (formData.degree.length === 1) return; // Đảm bảo ít nhất 1 degree
    const newDegrees = formData.degree.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      degree: newDegrees,
    });
  };

  // Cập nhật degree
  const updateDegree = (index, field, value) => {
    const newDegrees = [...formData.degree];
    newDegrees[index][field] = value;
    setFormData({
      ...formData,
      degree: newDegrees,
    });
  };

  // Thêm experience mới
  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [
        ...formData.experience,
        {
          position: "",
          company: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    });
  };

  // Xóa experience
  const removeExperience = (index) => {
    if (formData.experience.length === 1) return; // Đảm bảo ít nhất 1 experience
    const newExperiences = formData.experience.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      experience: newExperiences,
    });
  };

  // Cập nhật experience
  const updateExperience = (index, field, value) => {
    const newExperiences = [...formData.experience];
    newExperiences[index][field] = value;
    setFormData({
      ...formData,
      experience: newExperiences,
    });
  };

  // Xử lý khi submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation cơ bản
    if (formData.degree.length === 0) {
      alert("Please add at least one degree.");
      return;
    }
    if (formData.experience.length === 0) {
      alert("Please add at least one experience.");
      return;
    }

    // Validation cho degree
    for (const deg of formData.degree) {
      if (!deg.name || !deg.institution || !deg.year) {
        alert("Each degree must have name, institution, and year.");
        return;
      }
      const currentYear = new Date().getFullYear();
      if (deg.year > currentYear) {
        alert("Graduation year cannot be in the future.");
        return;
      }
    }

    // Validation cho experience
    for (const exp of formData.experience) {
      if (!exp.position || !exp.company || !exp.startDate) {
        alert("Each experience must have position, company, and start date.");
        return;
      }
      const startDate = new Date(exp.startDate);
      const endDate = exp.endDate ? new Date(exp.endDate) : null;
      const currentDate = new Date();

      if (startDate > currentDate) {
        alert("Start date cannot be in the future.");
        return;
      }
      if (endDate && endDate < startDate) {
        alert("End date cannot be earlier than start date.");
        return;
      }
    }

    // Chuyển đổi định dạng startDate và endDate sang ISO 8601
    const formattedExperiences = formData.experience.map((exp) => ({
      ...exp,
      startDate: exp.startDate ? new Date(exp.startDate).toISOString() : "",
      endDate: exp.endDate ? new Date(exp.endDate).toISOString() : "",
    }));

    // Tạo dữ liệu mới bao gồm degree và experience đã được định dạng
    const updatedFormData = {
      ...formData,
      experience: formattedExperiences,
    };

    // Gọi onSubmit với dữ liệu đã cập nhật
    onSubmit(e, updatedFormData);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/30 bg-opacity-40 z-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl relative z-50 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4 text-center">
          Add New Employee
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Basic Info */}
          <InformationSection formData={formData} setFormData={setFormData} />

          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="border p-2 rounded-md w-full"
            required
          >
            <option value="">Select Role</option>
            <option value="teacher">Teacher</option>
            <option value="finance">Finance</option>
            <option value="admin">Admin</option>
            <option value="consultant">Consultant</option>
          </select>

          {/* Address */}
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
                autoComplete="address-level4"
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

          {/* Degrees */}
          <div className="border p-4 rounded-md">
            <h4 className="text-md font-semibold mb-2">Degrees</h4>
            {formData.degree.map((degree, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
              >
                <input
                  type="text"
                  placeholder="Degree Name"
                  value={degree.name}
                  onChange={(e) => updateDegree(index, "name", e.target.value)}
                  className="border p-2 rounded-md w-full"
                  required
                  autoComplete="off"
                />
                <input
                  type="text"
                  placeholder="Institution"
                  value={degree.institution}
                  onChange={(e) =>
                    updateDegree(index, "institution", e.target.value)
                  }
                  className="border p-2 rounded-md w-full"
                  required
                  autoComplete="off"
                />
                <input
                  type="number"
                  placeholder="Year"
                  value={degree.year}
                  onChange={(e) => updateDegree(index, "year", e.target.value)}
                  className="border p-2 rounded-md w-full"
                  required
                  autoComplete="off"
                />
                <input
                  type="text"
                  placeholder="Major (Optional)"
                  value={degree.major}
                  onChange={(e) => updateDegree(index, "major", e.target.value)}
                  className="border p-2 rounded-md w-full"
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={() => removeDegree(index)}
                  className="col-span-2 text-red-600 hover:text-red-800 text-sm"
                  disabled={formData.degree.length === 1}
                >
                  Remove Degree
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addDegree}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Add Another Degree
            </button>
          </div>

          {/* Experiences */}
          <div className="border p-4 rounded-md">
            <h4 className="text-md font-semibold mb-2">Experiences</h4>
            {formData.experience.map((experience, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
              >
                <input
                  type="text"
                  placeholder="Position"
                  value={experience.position}
                  onChange={(e) =>
                    updateExperience(index, "position", e.target.value)
                  }
                  className="border p-2 rounded-md w-full"
                  required
                  autoComplete="off"
                />
                <input
                  type="text"
                  placeholder="Company"
                  value={experience.company}
                  onChange={(e) =>
                    updateExperience(index, "company", e.target.value)
                  }
                  className="border p-2 rounded-md w-full"
                  required
                  autoComplete="organization"
                />
                <input
                  type="date"
                  placeholder="Start Date"
                  value={
                    experience.startDate
                      ? new Date(experience.startDate)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    updateExperience(index, "startDate", e.target.value)
                  }
                  className="border p-2 rounded-md w-full"
                  required
                  autoComplete="off"
                />
                <input
                  type="date"
                  placeholder="End Date (Optional)"
                  value={
                    experience.endDate
                      ? new Date(experience.endDate).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    updateExperience(index, "endDate", e.target.value)
                  }
                  className="border p-2 rounded-md w-full"
                  autoComplete="off"
                />
                <textarea
                  placeholder="Description (Optional)"
                  value={experience.description}
                  onChange={(e) =>
                    updateExperience(index, "description", e.target.value)
                  }
                  className="border p-2 rounded-md w-full col-span-2"
                  rows="3"
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  className="col-span-2 text-red-600 hover:text-red-800 text-sm"
                  disabled={formData.experience.length === 1}
                >
                  Remove Experience
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addExperience}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Add Another Experience
            </button>
          </div>

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

export default AddEmployeeModal;
