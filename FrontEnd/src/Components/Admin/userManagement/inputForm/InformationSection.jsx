import React from "react";

const InformationSection = ({ formData, setFormData }) => {
  return (
    <div className="flex flex-col gap-4">
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
        />
      </div>

      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        className="border p-2 rounded-md w-full"
        required
        autoComplete="email"
      />

      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        className="border p-2 rounded-md w-full"
        required
        autoComplete="new-password"
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
      />
      
    </div>
  );
};

export default InformationSection;
