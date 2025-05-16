import express from "express";

import { verifyConsultant } from "../middleware/verifyConsultant.js";
import {
  getLeadUsers,
  addNewLeadUser,
  updateLeadUser,
  deleteLeadUser,
} from "../controller/lead.controller.js";

import {getSchedules, addSchedule, updateSchedule, deleteSchedule} from "../controller/consultantSchedule.controller.js";

const consultantRouter = express.Router();

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
