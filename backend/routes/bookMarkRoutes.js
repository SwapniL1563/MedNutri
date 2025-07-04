import express from 'express';
import { addBookmark, getBookmarks, removeBookmark } from '../controller/bookMarkController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';


const router = express.Router();

router.post("/:id",authMiddleware,addBookmark);
router.delete("/:id",authMiddleware,removeBookmark);
router.get("/",authMiddleware,getBookmarks);

export default router;
