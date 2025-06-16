import React, { useState } from "react";
import { Eye, EyeOff, User, Mail, Phone, Lock } from "lucide-react";

const InformationSection = ({ formData, setFormData }) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputFields = [
    {
      name: "lastName",
      placeholder: "Last Name",
      type: "text",
      icon: User,
      required: true,
      autoComplete: "family-name",
      gridCols: "md:col-span-1"
    },
    {
      name: "firstName", 
      placeholder: "First Name",
      type: "text",
      icon: User,
      required: true,
      autoComplete: "given-name",
      gridCols: "md:col-span-1"
    },
    {
      name: "email",
      placeholder: "Email Address",
      type: "email", 
      icon: Mail,
      required: true,
      autoComplete: "email",
      gridCols: "md:col-span-2"
    },
    {
      name: "password",
      placeholder: "Password",
      type: showPassword ? "text" : "password",
      icon: Lock,
      autoComplete: "new-password",
      gridCols: "md:col-span-2",
      hasToggle: true
    },
    {
      name: "phoneNumber",
      placeholder: "Phone Number (10 digits)",
      type: "tel",
      icon: Phone,
      required: false,
      autoComplete: "tel",
      gridCols: "md:col-span-2"
    }
  ];

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="w-full max-w-4xl  p-6 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Personal Information</h2>
        <p className="text-gray-600 text-sm">Please fill in all the information below</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {inputFields.map((field) => (
          <div key={field.name} className={`relative ${field.gridCols}`}>
            <div className="relative group">
              {/* Icon */}
              <field.icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
              
              {/* Input */}
              <input
                type={field.type}
                placeholder={field.placeholder}
                value={formData[field.name] || ""}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-white border-2 border-gray-200 rounded-xl 
                         focus:border-blue-500 focus:ring-4 focus:ring-blue-100 
                         transition-all duration-200 ease-in-out
                         placeholder-gray-400 text-gray-700
                         hover:border-gray-300
                         text-base md:text-sm"
                required={field.required}
                autoComplete={field.autoComplete}
              />

              {/* Password Toggle */}
              {field.hasToggle && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 
                           w-5 h-5 text-gray-400 hover:text-gray-600 
                           transition-colors duration-200 focus:outline-none"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              )}

              {/* Required indicator
              {field.required && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full"></span>
              )} */}
            </div>

            {/* Field validation feedback */}
            {field.required && formData[field.name] && formData[field.name].length > 0 && (
              <div className="mt-1 flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                <span className="text-xs text-green-600">Valid</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Form tips */}
      <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
        <div className="flex items-start">
          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">
            <span className="text-white text-xs font-bold">i</span>
          </div>
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">Important Notes:</p>
            <ul className="text-xs space-y-1 text-blue-600">
              <li>• Password should be at least 8 characters long</li>
              <li>• Phone number is optional but helps secure your account</li>
              <li>• Your information will be kept completely confidential</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};


export default InformationSection;