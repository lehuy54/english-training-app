// src/models/auth.model.ts
export interface RegisterInput {
  email: string;
  display_name: string;
  password: string;
  role?: 'user' | 'admin';
}

export interface LoginInput {
  email: string;
  password: string;
}