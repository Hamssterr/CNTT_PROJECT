import express from "express";

import { getClasses, addNewClass, deleteClass, updateClass } from "../controller/classFinance.controller.js";
import { getTeachers, addNewTeacher, updateTeacher } from "../controller/teacherFinance.controller.js";
import { verifyFinance } from "../middleware/verifyFinance.js";

const financeRouter = express.Router();
financeRouter.get("/getClasses", verifyFinance, getClasses);
financeRouter.post("/addNewClass", verifyFinance, addNewClass);
financeRouter.delete("/deleteClass/:id", verifyFinance, deleteClass);
financeRouter.put("/updateClass/:id", verifyFinance, updateClass);

financeRouter.get("/getTeachers", verifyFinance, getTeachers);
financeRouter.post("/addNewTeacher", verifyFinance, addNewTeacher);
financeRouter.put("/updateTeacher/:id", verifyFinance, updateTeacher);
export default financeRouter;