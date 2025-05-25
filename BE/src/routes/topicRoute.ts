// src/routes/topicRoute.ts
import express, { Router } from 'express';
import { authenticateToken, ensureAdmin } from '../middleware/authJwt';
import { 
    getTopicsController,
    getTopicByIdController,
    createTopicController,
    updateTopicController,
    deleteTopicController,

} from '../controllers/topicController';
import { getFlashcardsByTopic } from '../controllers/flashcardController';

const router: Router = express.Router();

router.get('/', getTopicsController); // ✅ Đúng cú pháp
router.get('/:id', getTopicByIdController);
router.post('/', authenticateToken, ensureAdmin, createTopicController);
router.put('/:id', authenticateToken, ensureAdmin, updateTopicController);
router.delete('/:id', authenticateToken, ensureAdmin, deleteTopicController);
router.get('/:topicId/flashcards', getFlashcardsByTopic);

export default router;