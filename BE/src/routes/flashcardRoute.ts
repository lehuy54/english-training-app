// src/routes/flashcardRoute.ts

import express, { Router } from 'express';
import {
  getFlashcardsByTopic,
  createFlashcardController,
  updateFlashcardController,
  deleteFlashcardController,
} from '../controllers/flashcardController';
import { authenticateToken, ensureAdmin } from '../middleware/authJwt';

const router: Router = express.Router();

 // GET /topics/1/flashcards
router.post('/', authenticateToken, ensureAdmin, createFlashcardController); // POST /flashcards
router.put('/:id', authenticateToken, ensureAdmin, updateFlashcardController); // PUT /flashcards/1
router.delete('/:id', authenticateToken, ensureAdmin, deleteFlashcardController); // DELETE /flashcards/1

export default router;