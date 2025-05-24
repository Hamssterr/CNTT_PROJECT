import express from "express";

import { verifyParent } from "../middleware/verifyParent.js";
import { getDataParent, getDataChildrenForParent } from "../controller/parent.controller.js";
import { getClassWithHaveChildren } from "../controller/class.controller.js";

const router = express.Router();

router.get("/dashboard", verifyParent, getDataParent);

router.get("/getClassWithHaveChildren", verifyParent, getClassWithHaveChildren);

router.get('/getDataChildrenForParent', verifyParent, getDataChildrenForParent);
export default router;
