import mongoose from "mongoose";

const ClassSchema = new mongoose.Schema({
  className: {
    type: String,
    required: [true, "Class name is required"],
    trim: true,
  },
  room: {
    type: String,
    required: [true, "Room is required"],
    trim: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: [true, "Course ID is required"],
  },
  instructor: {
    id: { type: String, required: true },
    name: { type: String, required: true },
  },
  students: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true,
      },
      lastName: String,
      firstName: String,
      email: String,
      enrolledDate: {
        type: Date,
        default: Date.now,
      },
      progress: {
        type: Number,
        default: 0, 
      },
    },
  ],
  schedule: {
    daysOfWeek: {
      type: [String],
      default: [],
    },
    shift: {
      type: String,
      trim: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  materials: [
    {
      name: { type: String, required: true }, // Tên tài liệu
      url: { type: String, required: true }, // URL của tài liệu
      uploadedAt: { type: Date, default: Date.now }, // Ngày upload
    },
  ]
});

// Middleware để cập nhật updatedAt trước khi lưu
ClassSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Class = mongoose.model("ClassAdmin", ClassSchema);
export default Class;
