import mongoose from "mongoose";

const consultantScheduleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    desc: { type: String, required: true, default: "" },
  },
  { timestamps: true }
);

const ConsultantScheduleModel = mongoose.model("ConsultantSchedule", consultantScheduleSchema);
export default ConsultantScheduleModel;
