import React from "react";
import {
  X,
  Plus,
  Trash2,
  User,
  MapPin,
  GraduationCap,
  Briefcase,
  Building2,
  Calendar,
  FileText,
  Users,
} from "lucide-react";
import InformationSection from "../inputForm/InformationSection";

const AddEmployeeModal = ({
  show,
  onClose,
  onSubmit,
  formData,
  setFormData,
  loading,
}) => {
  // Role icons for select dropdown (optional, for visual enhancement)
  // const roleIcons = {
  //   teacher: Users,
  //   finance: Users, // Replace with appropriate icon if needed
  //   admin: Users,
  //   consultant: Users,
  // };

  // Add new degree
  const addDegree = () => {
    setFormData({
      ...formData,
      degree: [
        ...formData.degree,
        { name: "", institution: "", year: "", major: "" },
      ],
    });
  };

  // Remove degree
  const removeDegree = (index) => {
    if (formData.degree.length === 1) return;
    const newDegrees = formData.degree.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      degree: newDegrees,
    });
  };

  // Update degree
  const updateDegree = (index, field, value) => {
    const newDegrees = [...formData.degree];
    newDegrees[index][field] = value;
    setFormData({
      ...formData,
      degree: newDegrees,
    });
  };

  // Add new experience
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

  // Remove experience
  const removeExperience = (index) => {
    if (formData.experience.length === 1) return;
    const newExperiences = formData.experience.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      experience: newExperiences,
    });
  };

  // Update experience
  const updateExperience = (index, field, value) => {
    const newExperiences = [...formData.experience];
    newExperiences[index][field] = value;
    setFormData({
      ...formData,
      experience: newExperiences,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation for degrees
    if (formData.degree.length === 0) {
      alert("Please add at least one degree.");
      return;
    }
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

    // Validation for experiences
    if (formData.experience.length === 0) {
      alert("Please add at least one experience.");
      return;
    }
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

    // Format dates to ISO 8601
    const formattedExperiences = formData.experience.map((exp) => ({
      ...exp,
      startDate: exp.startDate ? new Date(exp.startDate).toISOString() : "",
      endDate: exp.endDate ? new Date(exp.endDate).toISOString() : "",
    }));

    const updatedFormData = {
      ...formData,
      experience: formattedExperiences,
    };

    onSubmit(e, updatedFormData);
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
              <h3 className="text-xl font-bold">Add New Employee</h3>
              <p className="text-blue-100 text-sm">Fill in employee details</p>
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
                  Role & Position
                </h4>
              </div>
              <div className="relative">
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 text-gray-700 appearance-none"
                  required
                >
                  <option value="">Select Role</option>
                  <option value="teacher">Teacher</option>
                  <option value="finance">Finance</option>
                  <option value="admin">Admin</option>
                  <option value="consultant">Consultant</option>
                </select>
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Address */}
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
                        formData.address?.[field.key] || field.defaultValue || ""
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
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Degrees */}
            <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-orange-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800">
                    Education Background
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={addDegree}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Degree
                </button>
              </div>
              <div className="space-y-6">
                {formData.degree.map((degree, index) => (
                  <div
                    key={index}
                    className="bg-white p-5 rounded-xl border-2 border-orange-100 hover:border-orange-200 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-gray-600">
                        Degree #{index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeDegree(index)}
                        disabled={formData.degree.length === 1}
                        className="flex items-center gap-1 px-3 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Degree Name"
                        value={degree.name}
                        onChange={(e) =>
                          updateDegree(index, "name", e.target.value)
                        }
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 focus:bg-white transition-all duration-200 placeholder-gray-400 text-gray-700 text-sm"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Institution"
                        value={degree.institution}
                        onChange={(e) =>
                          updateDegree(index, "institution", e.target.value)
                        }
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 focus:bg-white transition-all duration-200 placeholder-gray-400 text-gray-700 text-sm"
                        required
                      />
                      <input
                        type="number"
                        placeholder="Graduation Year"
                        value={degree.year}
                        onChange={(e) =>
                          updateDegree(index, "year", e.target.value)
                        }
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 focus:bg-white transition-all duration-200 placeholder-gray-400 text-gray-700 text-sm"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Major (Optional)"
                        value={degree.major}
                        onChange={(e) =>
                          updateDegree(index, "major", e.target.value)
                        }
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 focus:bg-white transition-all duration-200 placeholder-gray-400 text-gray-700 text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Experiences */}
            <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800">
                    Work Experience
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={addExperience}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Experience
                </button>
              </div>
              <div className="space-y-6">
                {formData.experience.map((experience, index) => (
                  <div
                    key={index}
                    className="bg-white p-5 rounded-xl border-2 border-indigo-100 hover:border-indigo-200 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-gray-600">
                        Experience #{index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeExperience(index)}
                        disabled={formData.experience.length === 1}
                        className="flex items-center gap-1 px-3 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Position"
                          value={experience.position}
                          onChange={(e) =>
                            updateExperience(index, "position", e.target.value)
                          }
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:bg-white transition-all duration-200 placeholder-gray-400 text-gray-700 text-sm"
                          required
                        />
                      </div>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Company"
                          value={experience.company}
                          onChange={(e) =>
                            updateExperience(index, "company", e.target.value)
                          }
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:bg-white transition-all duration-200 placeholder-gray-400 text-gray-700 text-sm"
                          required
                        />
                      </div>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
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
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:bg-white transition-all duration-200 text-gray-700 text-sm"
                          required
                        />
                      </div>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="date"
                          placeholder="End Date (Optional)"
                          value={
                            experience.endDate
                              ? new Date(experience.endDate)
                                  .toISOString()
                                  .split("T")[0]
                              : ""
                          }
                          onChange={(e) =>
                            updateExperience(index, "endDate", e.target.value)
                          }
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:bg-white transition-all duration-200 text-gray-700 text-sm"
                        />
                      </div>
                    </div>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <textarea
                        placeholder="Job Description (Optional)"
                        value={experience.description}
                        onChange={(e) =>
                          updateExperience(index, "description", e.target.value)
                        }
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:bg-white transition-all duration-200 placeholder-gray-400 text-gray-700 text-sm resize-vertical"
                        rows="3"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

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
                    Add Employee
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

export default AddEmployeeModal;