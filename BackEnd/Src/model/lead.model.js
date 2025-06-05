import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    studentName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    course: [{ type: String }],
    registrationDate: { type: Date, default: Date.now },
    status: { type: String, default: "Pending" },
    paymentStatus: { type: String, default: "Unpaid" },
    isDiscount: { type: Boolean, default: false },
    discountEmail: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);
const leadUser = mongoose.model("Lead", leadSchema);
export default leadUser;
