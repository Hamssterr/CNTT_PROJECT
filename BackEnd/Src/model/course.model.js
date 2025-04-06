import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CourseSchema = new Schema(
    {
        courseImage:{
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        instructor: {
            type: String, 
            required: true
        },
    },
    { timestamps: true }
);

const Course = mongoose.model("Course", CourseSchema);
export default Course;
