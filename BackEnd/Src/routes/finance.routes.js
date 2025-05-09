import express from "express";

import { getClasses, addNewClass, deleteClass, updateClass } from "../controller/classFinance.controller.js";
import { verifyFinance } from "../middleware/verifyFinance.js";

const financeRouter = express.Router();
financeRouter.get("/getClasses", verifyFinance, getClasses);
financeRouter.post("/addNewClass", verifyFinance, addNewClass);
financeRouter.delete("/deleteClass/:id", verifyFinance, deleteClass);
financeRouter.put("/updateClass/:id", verifyFinance, updateClass);
export default financeRouter;