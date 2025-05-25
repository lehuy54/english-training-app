// store/slices/quizSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Question } from "../../types";

interface UserAnswer {
  questionId: number;
  selectedOption: number;
}

interface QuizState {
  currentTopicId: number | null;
  questions: Question[];
  userAnswers: UserAnswer[];
  currentAttemptId: number | null;
  isSubmitting: boolean;
  quizResult: {
    score: number;
    totalQuestions: number;
    correctAnswers: number;
  } | null;
}

const initialState: QuizState = {
  currentTopicId: null,
  questions: [],
  userAnswers: [],
  currentAttemptId: null,
  isSubmitting: false,
  quizResult: null,
};

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    setCurrentTopicId: (state, action: PayloadAction<number>) => {
      state.currentTopicId = action.payload;
    },
    setQuestions: (state, action: PayloadAction<Question[]>) => {
      state.questions = action.payload;
    },
    setAttemptId: (state, action: PayloadAction<number>) => {
      state.currentAttemptId = action.payload;
    },
    answerQuestion: (state, action: PayloadAction<UserAnswer>) => {
      const existingAnswerIndex = state.userAnswers.findIndex(
        a => a.questionId === action.payload.questionId
      );
      
      if (existingAnswerIndex !== -1) {
        // Replace existing answer
        state.userAnswers[existingAnswerIndex] = action.payload;
      } else {
        // Add new answer
        state.userAnswers.push(action.payload);
      }
    },
    setIsSubmitting: (state, action: PayloadAction<boolean>) => {
      state.isSubmitting = action.payload;
    },
    setQuizResult: (state, action: PayloadAction<{
      score: number;
      totalQuestions: number;
      correctAnswers: number;
    }>) => {
      state.quizResult = action.payload;
    },
    resetQuiz: (state) => {
      state.userAnswers = [];
      state.currentAttemptId = null;
      state.isSubmitting = false;
      state.quizResult = null;
    }
  },
});

export const {
  setCurrentTopicId,
  setQuestions,
  setAttemptId,
  answerQuestion,
  setIsSubmitting,
  setQuizResult,
  resetQuiz
} = quizSlice.actions;

export { quizSlice };
export default quizSlice.reducer;
