import { configureStore } from "@reduxjs/toolkit";
import authReducer, { authSlice } from "./slices/authSlice";
import quizReducer, { quizSlice } from "./slices/quizSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    quiz: quizReducer,
  },
});

// Tự động infer RootState và AppDispatch từ store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export slices for use in other components
export { authSlice, quizSlice };
