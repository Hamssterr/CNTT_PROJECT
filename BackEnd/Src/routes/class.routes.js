import express from "express";
import { uploadMaterial } from "../controller/class.controller.js";
import { cloudinaryFileUploader } from "../middleware/FileUploader.js";

const router = express.Router();

router.post("/:classId/upload",cloudinaryFileUploader.single("file") ,uploadMaterial);
export default router;
