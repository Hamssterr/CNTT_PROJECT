import React from "react";
import { X } from "lucide-react";

const CourseRegisterForm = ({
  registerData,
  handleChange,
  handleSubmit,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-transparent flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <X />
        </button>
        <h2 className="text-xl font-semibold mb-4 text-center">
          Register for Course
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={registerData.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full p-2 border rounded-md"
            required
          />
          <input
            type="email"
            name="email"
            value={registerData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-2 border rounded-md"
            required
          />
          <input
            type="tel"
            name="phoneNumber"
            value={registerData.phoneNumber}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full p-2 border rounded-md"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
          >
            Submit Registration
          </button>
        </form>
      </div>
    </div>
  );
};

export default CourseRegisterForm;
