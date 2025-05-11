import { useState } from "react";

const AddressDisplay = ({ address }) => {
  const [showDetail, setShowDetail] = useState(false);

  if (!address) {
    return (
      <div className="border p-4 rounded-md bg-gray-50">
        <h4 className="text-md font-semibold mb-2">Address</h4>
        <p className="text-gray-500 italic">No address information available</p>
      </div>
    );
  }

  return (
    <div className="border p-4 rounded-md bg-gray-50">
      <h4 className="text-md font-semibold mb-2">Address</h4>

      {!showDetail ? (
        <div>
          <p className="text-gray-700 mb-2">
            {address.houseNumber && `${address.houseNumber}, `}
            {address.street && `${address.street}, `}
            {address.ward && `${address.ward}, `}
            {address.district && `${address.district}, `}
            {address.city && `${address.city}, `}
            {address.province && `${address.province}, `}
            {address.country || "Vietnam"}
          </p>
          <button
            onClick={() => setShowDetail(true)}
            className="text-blue-600 hover:underline text-sm"
          >
            View Details
          </button>
        </div>
      ) : (
        <div className="text-gray-700 space-y-1">
          {address.houseNumber && (
            <p>
              <span className="font-medium">House No.:</span> {address.houseNumber}
            </p>
          )}
          {address.street && (
            <p>
              <span className="font-medium">Street:</span> {address.street}
            </p>
          )}
          {(address.ward || address.commune) && (
            <p>
              <span className="font-medium">Ward/Commune:</span>{" "}
              {address.ward || address.commune}
            </p>
          )}
          {address.district && (
            <p>
              <span className="font-medium">District:</span> {address.district}
            </p>
          )}
          {address.city && (
            <p>
              <span className="font-medium">City:</span> {address.city}
            </p>
          )}
          {address.province && (
            <p>
              <span className="font-medium">Province:</span> {address.province}
            </p>
          )}
          <p>
            <span className="font-medium">Country:</span> {address.country || "Vietnam"}
          </p>

          <button
            onClick={() => setShowDetail(false)}
            className="text-blue-600 hover:underline text-sm mt-2 block"
          >
            Hide Details
          </button>
        </div>
      )}
    </div>
  );
};

export default AddressDisplay;
