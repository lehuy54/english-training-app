import apiClient from '../utils/axiosConfig';

export interface SpeakingPracticeInput {
  context?: string;
  tone?: string;
  audience?: string;
  content: string;
}

export interface SpeakingPractice {
  id: number;
  user_id: number;
  context: string | null;
  tone: string | null;
  audience: string | null;
  content: string;
  ai_response: string;
  created_at: string;
}

// Gửi dữ liệu để tạo bài luyện nói mới
export const createSpeakingPractice = async (data: SpeakingPracticeInput) => {
  const response = await apiClient.post('/speaking-practice', data);
  return response.data;
};

// Lấy lịch sử luyện nói của người dùng
export const getSpeakingPracticeHistory = async () => {
  const response = await apiClient.get('/speaking-practice/history');
  return response.data;
};

// Lấy chi tiết một bài luyện nói cụ thể
export const getSpeakingPracticeById = async (id: number) => {
  const response = await apiClient.get(`/speaking-practice/${id}`);
  return response.data;
};
