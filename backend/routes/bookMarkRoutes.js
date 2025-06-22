import express from 'express';
import { addBookmark, getBookmarks, removeBookmark } from '../controller/bookMarkController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';


const router = express.Router();

router.post("/bookmark/:id",authMiddleware,addBookmark);
router.delete("/bookmark/:id",authMiddleware,removeBookmark);
router.get("/bookmarks",authMiddleware,getBookmarks);

export default router;
