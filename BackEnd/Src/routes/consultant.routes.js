import express from "express";

import { verifyConsultant } from "../middleware/verifyConsultant.js";
import {
  getLeadUsers,
  addNewLeadUser,
  updateLeadUser,
  deleteLeadUser,
} from "../controller/lead.controller.js";

import {getSchedules, addSchedule, updateSchedule, deleteSchedule} from "../controller/consultantSchedule.controller.js";

import {getPersonalData, updateUserProfile} from "../controller/auth.controller.js"

import { cloudinaryFileUploader } from "../middleware/FileUploader.js";

const consultantRouter = express.Router();

// Personal Data 
consultantRouter.get("/profile", verifyConsultant ,getPersonalData);

consultantRouter.put("/profile", verifyConsultant, cloudinaryFileUploader.single("profileImage"), updateUserProfile)

consultantRouter.get("/getLeadUsers", getLeadUsers);
consultantRouter.post("/addNewLeadUser", addNewLeadUser);
consultantRouter.put("/updateLeadUser/:id", verifyConsultant, updateLeadUser);
consultantRouter.delete(
  "/deleteLeadUser/:id",
  verifyConsultant,
  deleteLeadUser
);
consultantRouter.get("/getSchedules", verifyConsultant, getSchedules);
consultantRouter.post("/addSchedule", verifyConsultant, addSchedule);
consultantRouter.put(
  "/updateSchedule/:id",
  verifyConsultant,
  updateSchedule
);
consultantRouter.delete(
  "/deleteSchedule/:id",
  verifyConsultant,
  deleteSchedule
);

export default consultantRouter;
