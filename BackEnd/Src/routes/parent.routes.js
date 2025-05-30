import express from "express";

import { verifyParent } from "../middleware/verifyParent.js";
import { getDataParent, getDataChildrenForParent } from "../controller/parent.controller.js";
import { getClassWithHaveChildren } from "../controller/class.controller.js";
import {getPersonalData, updateUserProfile} from "../controller/auth.controller.js"
import { cloudinaryFileUploader } from "../middleware/FileUploader.js";

const router = express.Router();

router.get("/dashboard", verifyParent, getDataParent);

router.get("/getClassWithHaveChildren", verifyParent, getClassWithHaveChildren);

router.get('/getDataChildrenForParent', verifyParent, getDataChildrenForParent);

// Profile
router.get("/profile", verifyParent ,getPersonalData);

router.put("/profile", verifyParent, cloudinaryFileUploader.single("profileImage"), updateUserProfile)


export default router;
