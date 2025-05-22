import express from "express"

import { verifyParent } from "../middleware/verifyParent.js"
import { getDataParent } from "../controller/parent.controller.js"

const router = express.Router();

router.get("/dashboard", verifyParent, getDataParent);

export default router;