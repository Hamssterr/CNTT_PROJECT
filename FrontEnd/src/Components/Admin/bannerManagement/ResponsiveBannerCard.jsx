import React from "react";
import {
  Users,
  Eye,
  Pencil,
  UserPlus,
  Trash2,
  X,
} from "lucide-react";

const ResponsiveBannerCard = ({
  banner,
  onView,
  onEdit,
  onDelete,
}) => (
  <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300">
    <div className="flex items-start gap-3 mb-3">
      <div className="relative flex-shrink-0">
        <img
          src={banner.backgroundImage}
          alt={banner.title}
          className="w-16 h-16 rounded-lg object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1 truncate">
          {banner.title}
        </h3>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span>
            {new Date(banner.createdAt).toLocaleDateString("en-US", {
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
          onClick={() => onView(banner)}
        >
          <Eye size={14} />
        </button>
        <button
          className="p-2 rounded-lg hover:bg-blue-100 text-gray-500 hover:text-blue-600 transition-colors"
          onClick={() => onEdit(banner)}
        >
          <Pencil size={14} />
        </button>
        <button
          className="p-2 rounded-lg hover:bg-red-100 text-gray-500 hover:text-red-600 transition-colors"
          onClick={() => onDelete(banner)}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  </div>
);

export default ResponsiveBannerCard;