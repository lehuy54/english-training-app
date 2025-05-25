import apiClient from "../utils/axiosConfig";
import type { GrammarLesson, GrammarLessonInput } from "../types";

export const getGrammarLessons = async (): Promise<GrammarLesson[]> => {
    const res = await apiClient.get("/grammar-lessons");
    return res.data;
  };
  
  export const getGrammarLessonById = async (id: number): Promise<GrammarLesson> => {
    const res = await apiClient.get(`/grammar-lessons/${id}`);
    return res.data;
  };
  
  export const createGrammarLesson = async (data: GrammarLessonInput): Promise<GrammarLesson> => {
    const res = await apiClient.post("/grammar-lessons", data);
    return res.data;
  };
  
  export const updateGrammarLesson = async (id: number, data: GrammarLessonInput): Promise<void> => {
    await apiClient.put(`/grammar-lessons/${id}`, data);
  };
  
  export const deleteGrammarLesson = async (id: number): Promise<void> => {
    await apiClient.delete(`/grammar-lessons/${id}`);
  };