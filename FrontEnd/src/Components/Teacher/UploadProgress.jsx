import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const UploadProgress = ({ fileName, progress, status }) => {
  const getStatusColor = () => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-blue-500";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "uploading":
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
          {fileName}
        </span>
        {getStatusIcon()}
      </div>

      <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
          className={`absolute top-0 left-0 h-full rounded-full ${getStatusColor()}`}
        />
      </div>

      <div className="mt-1 flex justify-between items-center text-xs">
        <span
          className={`
          font-medium
          ${
            status === "completed"
              ? "text-green-600"
              : status === "error"
              ? "text-red-600"
              : "text-blue-600"
          }
        `}
        >
          {status === "completed"
            ? "Completed"
            : status === "error"
            ? "Failed"
            : `${progress}%`}
        </span>
        <span className="text-gray-500">
          {status === "completed" && "File uploaded successfully"}
          {status === "error" && "Upload failed"}
          {status === "uploading" && "Uploading..."}
        </span>
      </div>
    </div>
  );
};

export default UploadProgress;
