import express, { Router } from 'express';
import {
  createQuizAttemptHandler,
  submitQuizAnswer,
  getQuizAttemptDetails,
  getQuizHistory,
  getQuizAttemptWithAnswersHandler
} from '../controllers/quizController';
import { authenticateToken } from '../middleware/authJwt';

const router: Router = express.Router();

// Tạo mới lần làm bài kiểm tra
router.post('/', authenticateToken, createQuizAttemptHandler); // POST /quiz-attempts

// Gửi câu trả lời của bài làm (tự động tính điểm sau khi gửi hết)
router.post('/:attemptId/answers', authenticateToken, submitQuizAnswer); // POST /quiz-attempts/1/answers

// 🔹 Lấy chi tiết bài làm + tên nội dung
router.get('/:id/details', authenticateToken, getQuizAttemptDetails);

// 🔸 Lấy lịch sử làm bài của người dùng
router.get('/history/users/:userId', authenticateToken, getQuizHistory);

// 🔸 Lấy chi tiết về một bài làm bao gồm câu hỏi và câu trả lời
router.get('/:id/answers', authenticateToken, getQuizAttemptWithAnswersHandler);


export default router;