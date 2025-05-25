import apiClient from "../utils/axiosConfig";
import type { 
  CreateQuizAttemptInput, 
  SubmitQuizAnswersInput, 
  QuizAttemptResult,
  QuizHistory,
  QuizAttemptDetails,
  QuizAttemptWithAnswers
} from "../types/quiz";

// QuizAttemptResult đã được định nghĩa trong types/quiz.ts

export const createQuizAttempt = async (data: CreateQuizAttemptInput): Promise<void> => {
  await apiClient.post("/quiz-attempts", data);
};

export const submitQuizAnswers = async (attemptId: number, data: SubmitQuizAnswersInput): Promise<void> => {
  await apiClient.post(`/quiz-attempts/${attemptId}/answers`, data);
};

export const getQuizAttemptDetails = async (attemptId: number): Promise<QuizAttemptDetails> => {
  const res = await apiClient.get(`/quiz-attempts/${attemptId}/details`);
  return res.data;
};

export const getQuizHistoryByUserId = async (userId: number): Promise<QuizHistory[]> => {
  const res = await apiClient.get(`/quiz-attempts/history/users/${userId}`);
  return res.data;
};

export const getQuizAttemptWithAnswers = async (attemptId: number): Promise<QuizAttemptWithAnswers> => {
  const res = await apiClient.get(`/quiz-attempts/${attemptId}/answers`);
  return res.data;
};

export const submitQuizAttempt = async (data: { 
  userId: number; 
  contentType: string; 
  contentId: number; 
  answers: { questionId: number; selectedOption: number }[] 
}): Promise<QuizAttemptResult> => {
  try {
    // Bước 1: Tạo một quiz attempt mới
    const createAttemptData = {
      user_id: data.userId,
      content_type: data.contentType,
      content_id: data.contentId
    };
    
    const createRes = await apiClient.post('/quiz-attempts', createAttemptData);
    const attemptId = createRes.data.id;
    
    // Bước 2: Gửi câu trả lời cho attempt vừa tạo
    const answersData = {
      answers: data.answers.map(answer => ({
        question_id: answer.questionId,
        selected_option: answer.selectedOption
      }))
    };
    
    const submitRes = await apiClient.post(`/quiz-attempts/${attemptId}/answers`, answersData);
    
    // Trả về kết quả
    return {
      id: attemptId,
      user_id: data.userId,
      content_type: data.contentType,
      content_id: data.contentId,
      score: submitRes.data.score || 0,
      correct_answers: submitRes.data.correct_answers || data.answers.filter(a => a.selectedOption > 0).length,
      total_questions: submitRes.data.total_questions || data.answers.length,
      completed_at: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error submitting quiz attempt:', error);
    throw error;
  }
};