import express from 'express';
import { getUserData, refreshAccessToken, sigin, signup } from '../controller/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post("/signup",signup);
router.post("/signin",sigin);
router.get("/profile",authMiddleware,getUserData);
router.get("/refresh-token",refreshAccessToken)

//protected routes
router.get("/dashboard",authMiddleware,async(req,res)=> {
    res.json({
        "msg":"Welcome to dashboard"
    });
})
export default router;