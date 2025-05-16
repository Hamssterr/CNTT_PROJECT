import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    studentName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    course: { type: String, required: false },
    registrationDate: { type: Date, default: Date.now },
    status: { type: String, default: "Pending" },
    paymentStatus: { type: String, default: "Unpaid" },
  },
  { timestamps: true }
);
const leadUser = mongoose.model("Lead", leadSchema);
export default leadUser;