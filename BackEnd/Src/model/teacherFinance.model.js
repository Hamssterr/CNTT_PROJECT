import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  specialization: { type: String, required: true },
  experience: { type: Number, required: true },
});

const teacherModel = mongoose.model("TeacherMangement", teacherSchema);
export default teacherModel;
