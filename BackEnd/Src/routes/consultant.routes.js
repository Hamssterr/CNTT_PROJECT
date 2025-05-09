import express from "express";

import { verifyConsultant } from "../middleware/verifyConsultant.js";
import {
  getLeadUsers,
  addNewLeadUser,
  updateLeadUser,
  deleteLeadUser,
} from "../controller/lead.controller.js";

const consultantRouter = express.Router();

consultantRouter.get("/getLeadUsers", verifyConsultant, getLeadUsers);
consultantRouter.post("/addNewLeadUser", verifyConsultant, addNewLeadUser);
consultantRouter.put("/updateLeadUser/:id", verifyConsultant, updateLeadUser);
consultantRouter.delete(
  "/deleteLeadUser/:id",
  verifyConsultant,
  deleteLeadUser
);

export default consultantRouter;
