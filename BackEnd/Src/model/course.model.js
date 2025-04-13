import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
  title: String,
  description: String,
  instructor: { id: String, name: String },
  category: String,
  level: String,
  duration: {
    totalHours: Number,
    startDate: Date,
    endDate: Date,
  },
  price: Number,
  currency: String,
  status: String,
  thumbnail: String,
  content: [
    {
      sectionId: String,
      title: String,
      lessons: [
        {
          lessonId: String,
          title: String,
          videoUrl: String,
          durationMinutes: Number,
        },
      ],
    },
  ],
  enrolledUsers: [
    {
      userId: String,
      enrolledDate: Date,
      progress: { type: Number, default: 0 },
    },
  ],
  maxEnrollment: Number,
  schedule: {
    daysOfWeek: [String],
    shift: String,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Course = mongoose.model("Course", CourseSchema);
export default Course;