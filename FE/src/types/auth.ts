// Enum Role
export enum UserRole {
    USER = "user",
    ADMIN = "admin",
  }
  
  // RegisterInput
  export interface RegisterInput {
    email: string;
    display_name: string;
    password: string;
    role?: UserRole;
  }
  
  // LoginInput
  export interface LoginInput {
    email: string;
    password: string;
  }
  
  // UserInfo
  export interface UserInfo {
    id: number;
    email: string;
    display_name: string;
    role: string;
    registered_at: string; // ISO date-time
  }