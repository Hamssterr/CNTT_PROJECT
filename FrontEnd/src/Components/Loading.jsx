import React from "react";
import { Loader } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center">
        <Loader className="w-12 h-12 animate-spin text-blue-500" />
        <p className="mt-2 text-gray-600">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;


