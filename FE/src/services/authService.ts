// services/authService.ts
import apiClient from "../utils/axiosConfig";
import type { LoginInput, RegisterInput, UserInfo } from "../types";

export const login = async (data: LoginInput): Promise<{ message: string; token: string }> => {
  const res = await apiClient.post("/auth/login", data);
  return res.data;
};

export const register = async (data: RegisterInput): Promise<UserInfo> => {
  const res = await apiClient.post("/auth/register", data);
  return res.data;
};