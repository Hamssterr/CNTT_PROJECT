import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader } from "lucide-react";

const UploadProgress = ({ file, progress, status }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {status === "completed" && (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}
            {status === "error" && <XCircle className="w-5 h-5 text-red-500" />}
            {status === "uploading" && (
              <Loader className="w-5 h-5 text-blue-500 animate-spin" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {file.name}
            </p>
            <p className="text-xs text-gray-500">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
        <div className="text-sm font-medium text-gray-900">{progress}%</div>
      </div>

      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="absolute left-0 top-0 h-full bg-blue-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
};

export default UploadProgress;
