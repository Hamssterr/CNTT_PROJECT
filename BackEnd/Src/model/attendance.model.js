import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  date: { type: String, required: true }, // Ngày điểm danh (YYYY-MM-DD)
  attendanceData: { type: Map, of: String, required: true }, // Dữ liệu điểm danh (studentId -> "present"/"absent")
});

export default mongoose.model("Attendance", AttendanceSchema);
