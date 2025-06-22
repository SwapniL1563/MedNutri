import express from 'express'
import { authMiddleware } from '../middleware/authMiddleware.js';
import { createPrescription, deletePrescriptions, getPrescriptions, updatePrescriptions } from '../controller/prescriptionController.js';

const router = express.Router();

router.use(authMiddleware);
router.post("/create",createPrescription);
router.get("/get",getPrescriptions);
router.put("/update/:id",updatePrescriptions);
router.delete("/delete/:id",deletePrescriptions);

export default router;