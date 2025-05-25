// src/controllers/flashcardController.ts

import { Request, Response } from 'express';
import {
  getFlashcardsByTopicId,
  createFlashcard,
  updateFlashcard,
  deleteFlashcard,
} from '../services/flashcardService';

export const getFlashcardsByTopic = async (req: Request, res: Response) => {
  const topicId = parseInt(req.params.topicId, 10);

  try {
    const flashcards = await getFlashcardsByTopicId(topicId);
    res.json(flashcards);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createFlashcardController = async (req: Request, res: Response) => {
  const { vocabulary, phonetics, vietnamese_meaning, description, example, topic_id } = req.body;

  try {
    const created = await createFlashcard(vocabulary, phonetics, vietnamese_meaning, description, example, topic_id);
    res.status(201).json(created);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateFlashcardController = async (req: Request, res: Response) => {
  const flashcardId = parseInt(req.params.id, 10);
  const { vocabulary, phonetics, vietnamese_meaning, description, example } = req.body;

  try {
    const updated = await updateFlashcard(flashcardId, vocabulary, phonetics, vietnamese_meaning, description, example);
    res.json(updated);
  } catch (error: any) {
    if (error.code === 'P2025') {
       res.status(404).json({ error: 'Flashcard không tồn tại' });
    }
    res.status(500).json({ error: error.message });
  }
};

export const deleteFlashcardController = async (req: Request, res: Response) => {
  const flashcardId = parseInt(req.params.id, 10);

  try {
    await deleteFlashcard(flashcardId);
    res.json({ message: 'Xóa flashcard thành công' });
  } catch (error: any) {
    if (error.code === 'P2025') {
       res.status(404).json({ error: 'Flashcard không tồn tại' });
    }
    res.status(500).json({ error: error.message });
  }
};