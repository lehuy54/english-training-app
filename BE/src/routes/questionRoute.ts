import express, { Router } from 'express';
import {
  getQuestionsController,
  getQuestionByIdController,
  createQuestionController,
  updateQuestionController,
  deleteQuestionController,
  getQuestionsByContentController
} from '../controllers/questionController';
import { authenticateToken, ensureAdmin } from '../middleware/authJwt';

const router: Router = express.Router();

// Thứ tự routes rất quan trọng, routes cụ thể phải đặt trước routes có params
router.get('/content', getQuestionsByContentController); // GET /questions/content?type=topic&id=1 - Lấy câu hỏi theo loại nội dung và id
router.get('/', getQuestionsController); // GET /questions - Lấy danh sách câu hỏi
router.get('/:id', getQuestionByIdController); // GET /questions/1 - Lấy chi tiết câu hỏi
router.post('/', authenticateToken, ensureAdmin, createQuestionController); // POST /questions - Tạo câu hỏi mới
router.put('/:id', authenticateToken, ensureAdmin, updateQuestionController); // PUT /questions/1 - Cập nhật câu hỏi
router.delete('/:id', authenticateToken, ensureAdmin, deleteQuestionController); // DELETE /questions/1 - Xóa câu hỏi

export default router;