import { Request, Response } from 'express';
import {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestionsByContentTypeAndId
} from '../services/questionService';

export const getQuestionsController = async (req: Request, res: Response) => {
  try {
    const questions = await getAllQuestions();
    res.json(questions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getQuestionByIdController = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);

  try {
    const question = await getQuestionById(id);
    if (!question)  res.status(404).json({ error: 'Không tìm thấy câu hỏi' });
    res.json(question);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createQuestionController = async (req: Request, res: Response) => {
  const {
    content_type,
    content_id,
    content_name,
    question_text,
    option1,
    option2,
    option3,
    option4,
    correct_answer
  } = req.body;

  try {
    const newQuestion = await createQuestion(
      content_type,
      content_id,
      content_name,
      question_text,
      option1,
      option2,
      option3,
      option4,
      correct_answer
    );
    res.status(201).json(newQuestion);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateQuestionController = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const {
    content_name,
    question_text,
    option1,
    option2,
    option3,
    option4,
    correct_answer
  } = req.body;

  try {
    const updated = await updateQuestion(
      id,
      content_name,
      question_text,
      option1,
      option2,
      option3,
      option4,
      correct_answer
    );
    res.json(updated);
  } catch (error: any) {
    if (error.code === 'P2025') {
       res.status(404).json({ error: 'Câu hỏi không tồn tại' });
    }
    res.status(500).json({ error: error.message });
  }
};

export const deleteQuestionController = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);

  try {
    await deleteQuestion(id);
    res.json({ message: 'Xóa câu hỏi thành công' });
  } catch (error: any) {
    if (error.code === 'P2025') {
       res.status(404).json({ error: 'Câu hỏi không tồn tại' });
    }
    res.status(500).json({ error: error.message });
  }
};

export const getQuestionsByContentController = async (req: Request, res: Response) => {
  const contentType = req.query.type as string;
  const contentId = parseInt(req.query.id as string, 10);

  if (!contentType || isNaN(contentId)) {
    res.status(400).json({ error: 'Thiếu tham số type hoặc id' });
    return;
  }

  try {
    const questions = await getQuestionsByContentTypeAndId(contentType, contentId);
    res.json(questions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};