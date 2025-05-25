import apiClient from "../utils/axiosConfig";
import type { Flashcard, FlashcardInput } from "../types";

export const getFlashcardsByTopicId = async (topicId: number): Promise<Flashcard[]> => {
    const res = await apiClient.get(`/topics/${topicId}/flashcards`);
    return res.data;
  };
  
  export const createFlashcard = async (data: FlashcardInput): Promise<Flashcard> => {
    const res = await apiClient.post("/flashcards", data);
    return res.data;
  };
  
  export const updateFlashcard = async (id: number, data: FlashcardInput): Promise<void> => {
    await apiClient.put(`/flashcards/${id}`, data);
  };
  
  export const deleteFlashcard = async (id: number): Promise<void> => {
    await apiClient.delete(`/flashcards/${id}`);
  };
