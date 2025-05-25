import apiClient from "../utils/axiosConfig";
import type { Question, QuestionInput } from "../types";


export const getQuestions = async (): Promise<Question[]> => {
  const res = await apiClient.get("/questions");
  return res.data;
};

export const getQuestionById = async (id: number): Promise<Question> => {
  const res = await apiClient.get(`/questions/${id}`);
  return res.data;
};

export const createQuestion = async (data: QuestionInput): Promise<Question> => {
  const res = await apiClient.post("/questions", data);
  return res.data;
};

export const updateQuestion = async (id: number, data: QuestionInput): Promise<void> => {
  await apiClient.put(`/questions/${id}`, data);
};

export const deleteQuestion = async (id: number): Promise<void> => {
  await apiClient.delete(`/questions/${id}`);
};

export const getQuestionsByContentTypeAndId = async (contentType: string, contentId: number): Promise<Question[]> => {
  const res = await apiClient.get(`/questions/content`, {
    params: {
      type: contentType,
      id: contentId
    }
  });
  return res.data;
};