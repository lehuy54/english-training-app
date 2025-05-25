import { UserRole } from "./auth";

// User (tương tự UserInfo nhưng có thể khác về ngữ nghĩa)
export interface User {
    id: number;
    email: string;
    display_name: string;
    role: string;
    registered_at: string; // ISO date-time
  }
  
  // UserUpdateInput
  export interface UserUpdateInput {
    email?: string;
    display_name?: string;
    role?: UserRole;
  }