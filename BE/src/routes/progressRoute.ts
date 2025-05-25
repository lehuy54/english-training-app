import express, { Router } from 'express';
import { fetchUserProgressStats } from '../controllers/progressController';
import { authenticateToken } from '../middleware/authJwt';

const router: Router = express.Router();

// Lấy tiến độ học theo content_type (topic, grammar, v.v.)
router.get('/users/:userId/stats/:contentType', authenticateToken, fetchUserProgressStats); // GET /progress/users/1/stats/topic

export default router;