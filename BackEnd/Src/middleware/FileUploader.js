import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Sử dụng HTTPS
});

// Cấu hình multer với Cloudinary
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: "class_materials", // Thư mục lưu trữ trên Cloudinary
//     resource_type: "raw", // Tự động nhận diện loại file
//     allowed_formats: ["pdf"], // Restrict to PDF
//     public_id: (req, file) => {
//       const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//       return `${file.originalname}-${uniqueSuffix}`;
//     },
//   },
// });

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "class_materials",
    resource_type: "image",
    public_id: (req, file) => {
      const timestamp = Date.now();
      const originalName = file.originalname.replace(/\.[^/.]+$/, "");
      return `${originalName}_${timestamp}`;
    },
  },
});

export const cloudinaryFileUploader = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
  },
});
