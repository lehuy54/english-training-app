import apiClient from "../utils/axiosConfig";
import type { UserInfo, UserUpdateInput } from "../types";

export const getUsers = async (): Promise<UserInfo[]> => {
  const res = await apiClient.get("/users");
  return res.data;
};

export const getUserMe = async (): Promise<UserInfo> => {
  const res = await apiClient.get("/users/me");
  return res.data;
};

export const getUserById = async (id: number): Promise<UserInfo> => {
  const res = await apiClient.get(`/users/${id}`);
  return res.data;
};

export const updateUser = async (id: number, data: UserUpdateInput): Promise<void> => {
  await apiClient.put(`/users/${id}`, data);
};

export const deleteUser = async (id: number): Promise<void> => {
  await apiClient.delete(`/users/${id}`);
};

// Update user profile (display name)
export const updateUserProfile = async (data: { display_name: string }): Promise<UserInfo> => {
  const res = await apiClient.put('/users/profile/update', data);
  return res.data;
};

// Change user password
export const changePassword = async (data: { currentPassword: string, newPassword: string }): Promise<{ message: string }> => {
  const res = await apiClient.put('/users/profile/change-password', data);
  return res.data;
};