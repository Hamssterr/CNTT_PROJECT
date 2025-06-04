import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["info", "success", "warning"],
      default: "info",
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    recipientRole: {
      type: String,
      enum: ["consultant", "admin", "all"],
      default: "consultant",
    },
    read: {
      type: Boolean,
      default: false,
    },
    metadata: {
      courseId: String,
      courseName: String,
      studentName: String,
      studentEmail: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ConsultantNotification", notificationSchema);
