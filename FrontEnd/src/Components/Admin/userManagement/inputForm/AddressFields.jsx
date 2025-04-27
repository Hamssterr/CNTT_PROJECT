import React from 'react'

const AddressFields = ({ address, setFormData }) => {
    const handleAddressChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value,
        },
      }));
    };
  
    return (
      <div className="grid grid-cols-2 gap-4">
        {["houseNumber", "street", "ward", "district", "city", "province", "country"].map((field) => (
          <InputField
            key={field}
            label={field.charAt(0).toUpperCase() + field.slice(1)}
            name={field}
            value={address[field]}
            onChange={handleAddressChange}
          />
        ))}
      </div>
    );
  };
  
  export default AddressFields;
  
