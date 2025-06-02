import React from "react";
import {
  Users,
  Eye,
  Pencil,
  UserPlus,
  Trash2,
  X,
} from "lucide-react";

const ResponsiveUserCard = ({
  user,
  onView,
  onEdit,
  onAddStudent,
  onDelete,
}) => (
  <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300">
    <div className="flex items-start gap-3 mb-3">
      <div className="relative flex-shrink-0">
        <img
          src={user.profileImage || "https://res.cloudinary.com/df9ibpz4g/image/upload/v1743752097/uploads/3.png"}
          alt={user.firstName + user.lastName}
          className="w-16 h-16 rounded-lg object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1 truncate">
          {user.firstName + user.lastName}
        </h3>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span>
            {new Date(user.createdAt).toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
            })}
          </span>
        </div>
      </div>
    </div>

    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
      <div className="flex gap-2">
        <button
          className="p-2 rounded-lg hover:bg-blue-100 text-gray-500 hover:text-blue-600 transition-colors"
          onClick={() => onView(user)}
        >
          <Eye size={14} />
        </button>
        <button
          className="p-2 rounded-lg hover:bg-blue-100 text-gray-500 hover:text-blue-600 transition-colors"
          onClick={() => onEdit(user)}
        >
          <Pencil size={14} />
        </button>
        <button
          className="p-2 rounded-lg hover:bg-green-100 text-gray-500 hover:text-green-600 transition-colors"
          onClick={() => onAddStudent(user)}
        >
          <UserPlus size={14} />
        </button>
        <button
          className="p-2 rounded-lg hover:bg-red-100 text-gray-500 hover:text-red-600 transition-colors"
          onClick={() => onDelete(user)}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  </div>
);

export default ResponsiveUserCard;