// src/routes/speakingRoute.ts
import express, { Router } from 'express';
import { authenticateToken } from '../middleware/authJwt';
import { 
  createSpeakingPractice, 
  getUserSpeakingHistory, 
  getSpeakingPracticeDetail 
} from '../controllers/speakingController';

const router: Router = express.Router();

// Route tạo bài luyện nói mới
router.post('/', authenticateToken, createSpeakingPractice);

// Route lấy lịch sử luyện nói của người dùng
router.get('/history', authenticateToken, getUserSpeakingHistory);

// Route lấy chi tiết một bài luyện nói cụ thể
router.get('/:id', authenticateToken, getSpeakingPracticeDetail);

export default router;
