import mongoose from "mongoose";

const RegisterCourseSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  parentName: { type: String, required: true },
  studentName: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  registeredAt: {
    type: Date,
    default: Date.now,
  },
});

const RegisterCourse = mongoose.model("RegisterCourse", RegisterCourseSchema);
export default RegisterCourse;
