import { Request, Response } from 'express';
import {
  createQuizAttempt,
  calculateAndUpdateScore,
  getQuizAttemptDetailsWithContentName,
  getQuizHistoryByUserId,
  getQuizAttemptWithAnswers
} from '../services/quizService';
import prisma from '../prisma';

export const createQuizAttemptHandler = async (req: any, res: Response) => {
  const { content_type, content_id } = req.body;

  try {
    const attempt = await createQuizAttempt(req.user.userId, content_type, content_id);
    res.status(201).json(attempt);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const submitQuizAnswer = async (req: any, res: Response) => {
  const attemptId = parseInt(req.params.attemptId, 10);
  const { answers } = req.body;

  try {
    for (const answer of answers) {
      await prisma.quiz_attempt_answers.create({
        data: {
          attempt_id: attemptId,
          question_id: answer.question_id,
          selected_option: answer.selected_option
        }
      });
    }

    // Tự động tính điểm và cập nhật user_progress
    const { score } = await calculateAndUpdateScore(attemptId);

    res.json({ message: 'Đáp án đã được chấm', score });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Lấy thông tin chi tiết bài làm + tên nội dung
export const getQuizAttemptDetails = async (req: any, res: Response) => {
  const attemptId = parseInt(req.params.id, 10);

  try {
    const attemptWithContent = await getQuizAttemptDetailsWithContentName(attemptId);
    res.json(attemptWithContent);
  } catch (error: any) {
    res.status(404).json({ error: 'Không tìm thấy bài làm' });
  }
};

// 🔸 Lấy lịch sử bài làm của người dùng + tên nội dung
export const getQuizHistory = async (req: any, res: Response) => {
  const userId = parseInt(req.params.userId, 10);

  try {
    const history = await getQuizHistoryByUserId(userId);
    res.json(history);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// 🔸 Lấy chi tiết về một bài làm bao gồm câu hỏi và câu trả lời
export const getQuizAttemptWithAnswersHandler = async (req: any, res: Response) => {
  const attemptId = parseInt(req.params.id, 10);

  try {
    const attemptDetails = await getQuizAttemptWithAnswers(attemptId);
    res.json(attemptDetails);
  } catch (error: any) {
    res.status(404).json({ error: error.message || 'Không tìm thấy bài làm' });
  }
};
