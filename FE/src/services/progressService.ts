import apiClient from "../utils/axiosConfig";
import type { ProgressStats } from "../types";

export const getProgressStats = async (userId: number, contentType: string): Promise<ProgressStats> => {
    const res = await apiClient.get(`/progress/users/${userId}/stats/${contentType}`);
    return res.data;
  };