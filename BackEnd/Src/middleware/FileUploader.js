import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary"; 


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "uploads",
      format: async (req, file) => {
        console.log("Uploading file:", file.originalname); // Kiểm tra file nhận được
        return "png";
      },
      public_id: (req, file) => file.originalname.split(".")[0],
    },
  });


export const cloudinaryFileUploader = multer({ storage });
