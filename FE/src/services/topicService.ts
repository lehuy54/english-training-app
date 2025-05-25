import apiClient from "../utils/axiosConfig";
import type { Topic, TopicInput } from "../types";

export const getTopics = async (): Promise<Topic[]> => {
    const res = await apiClient.get("/topics");
    return res.data;
  };
  
  export const getTopicById = async (id: number): Promise<Topic> => {
    const res = await apiClient.get(`/topics/${id}`);
    return res.data;
  };
  
  export const createTopic = async (data: TopicInput): Promise<Topic> => {
    const res = await apiClient.post("/topics", data);
    return res.data;
  };
  
  export const updateTopic = async (id: number, data: TopicInput): Promise<void> => {
    await apiClient.put(`/topics/${id}`, data);
  };
  
  export const deleteTopic = async (id: number): Promise<void> => {
    await apiClient.delete(`/topics/${id}`);
  };