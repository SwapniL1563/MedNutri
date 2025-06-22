import express from 'express';
import { createMealPlan, deleteMealPlan, exportToPdf, fetchMealPlan } from '../controller/mealPlanController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post("/create", authMiddleware, createMealPlan);
router.get("/fetch", authMiddleware, fetchMealPlan);
router.delete("/delete/:id",authMiddleware,deleteMealPlan);
router.get("/:id/pdf",authMiddleware,exportToPdf);

export default router;