import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
  className: { type: String, required: true },
  teacher: { type: String, required: true },
  startDate: { type: Number, required: true },
  classTime: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
});

const ClassModel = mongoose.model("Class", classSchema);
export default ClassModel;
