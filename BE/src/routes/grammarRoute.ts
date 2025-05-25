import express, { Router } from 'express';
import {
  getGrammarLessonsController,
  getGrammarLessonByIdController,
  createGrammarLessonController,
  updateGrammarLessonController,
  deleteGrammarLessonController,
} from '../controllers/grammarController';
import { authenticateToken, ensureAdmin } from '../middleware/authJwt';

const router: Router = express.Router();

router.get('/', getGrammarLessonsController); // GET /grammar-lessons - Lấy danh sách bài học ngữ pháp
router.get('/:id', getGrammarLessonByIdController); // GET /grammar-lessons/1 - Lấy bài học theo ID
router.post('/', authenticateToken, ensureAdmin, createGrammarLessonController); // POST /grammar-lessons - Tạo mới
router.put('/:id', authenticateToken, ensureAdmin, updateGrammarLessonController); // PUT /grammar-lessons/1 - Cập nhật
router.delete('/:id', authenticateToken, ensureAdmin, deleteGrammarLessonController); // DELETE /grammar-lessons/1 - Xóa

export default router;