import express from 'express'

import {createBanner, getBanner, deleteBanner, updateBanner} from '../controller/banner.controller.js'

const router = express.Router();

router.post('/createBanner', createBanner);

router.get('/getBanner', getBanner)

router.put("/updateBanner/:id", updateBanner);

router.delete("/deleteBanner/:id", deleteBanner);


export default router;