import { Request, Response } from 'express';
import {
  getAllGrammarLessons,
  getGrammarLessonById,
  createGrammarLesson,
  updateGrammarLesson,
  deleteGrammarLesson,
} from '../services/grammarService';

export const getGrammarLessonsController = async (req: Request, res: Response) => {
  try {
    const lessons = await getAllGrammarLessons();
    res.json(lessons);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getGrammarLessonByIdController = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);

  try {
    const lesson = await getGrammarLessonById(id);
    if (!lesson)  res.status(404).json({ error: 'Không tìm thấy bài học' });
    res.json(lesson);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createGrammarLessonController = async (req: Request, res: Response) => {
  const { title, content, video_url } = req.body;

  try {
    const newLesson = await createGrammarLesson(title, content, video_url);
    res.status(201).json(newLesson);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateGrammarLessonController = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const { title, content, video_url } = req.body;

  try {
    const updated = await updateGrammarLesson(id, title, content, video_url);
    res.json(updated);
  } catch (error: any) {
    if (error.code === 'P2025') {
     res.status(404).json({ error: 'Bài học không tồn tại' });
    }
    res.status(500).json({ error: error.message });
  }
};

export const deleteGrammarLessonController = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);

  try {
    await deleteGrammarLesson(id);
    res.json({ message: 'Xóa bài học thành công' });
  } catch (error: any) {
    if (error.code === 'P2025') {
     res.status(404).json({ error: 'Bài học không tồn tại' });
    }
    res.status(500).json({ error: error.message });
  }
};