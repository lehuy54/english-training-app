// store/slices/authSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserInfo } from "../../types/auth";

interface AuthState {
  token: string | null;
  user: UserInfo | null;
  isAuthenticated: boolean;
}

// Try to get stored user info from localStorage
const getUserFromStorage = (): UserInfo | null => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    try {
      return JSON.parse(storedUser);
    } catch (e) {
      // If parsing fails, return null
      return null;
    }
  }
  return null;
};

const initialState: AuthState = {
  token: localStorage.getItem("token"),
  user: getUserFromStorage(),
  isAuthenticated: !!localStorage.getItem("token") && !!getUserFromStorage(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: UserInfo }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      // Store both token and user info in localStorage
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      // Remove both token and user info from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export { authSlice };
export default authSlice.reducer;
