import mongoose from "mongoose";

const BannerSchema = new mongoose.Schema({
     title: String,
  description: String,
  buttonText: String,
  buttonColor: String,
  backgroundImage: {
  type: String,
  default: ""
},
  gradient: String,
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course', 
    required: true
  },
  number: Number,
  numberColor: String,
    createdAt: {
    type: Date,
    default: Date.now
  },
})

const Banner =  mongoose.model("Banner", BannerSchema);
export default Banner;