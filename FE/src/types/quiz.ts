// CreateQuizAttemptInput
export interface CreateQuizAttemptInput {
  content_type: string;
  content_id: number;
}

// SubmitQuizAnswer
export interface SubmitQuizAnswer {
  question_id: number;
  selected_option: number;
}

// SubmitQuizAnswersInput
export interface SubmitQuizAnswersInput {
  answers: SubmitQuizAnswer[];
}

// QuizAttemptResult
export interface QuizAttemptResult {
  id: number;
  user_id: number;
  content_type: string;
  content_id: number;
  score: number;
  correct_answers: number;
  total_questions: number;
  completed_at: string;
}

// QuizHistory - Lịch sử làm bài kiểm tra
export interface QuizHistory {
  id: number;
  user_id: number;
  content_type: string; // 'topic' hoặc 'grammar'
  content_type_display?: string; // Hiển thị mực đích ('Từ vựng', 'Ngữ pháp')
  content_id: number;
  content_name: string; // Tên của chủ đề/bài học
  content_url?: string; // URL để quay lại nội dung
  content_image?: string; // Ảnh đại diện (nếu có)
  score: number;
  percentage_score?: number; // Tỷ lệ phần trăm
  correct_answers?: number;
  total_questions?: number;
  answer_count?: number;
  submitted_at: string;
  formatted_date?: string; // Ngày đã được định dạng
  created_at?: string;
}

// QuizAttemptDetails - Chi tiết một lần làm bài
export interface QuizAttemptDetails {
  id: number;
  user_id: number;
  content_type: string;
  content_id: number;
  content_name: string;
  score: number;
  correct_answers: number;
  total_questions: number;
  completed_at: string;
  created_at: string;
  answers: {
    question_id: number;
    question_text: string;
    selected_option: number;
    correct_option: number;
    options: string[];
    is_correct: boolean;
  }[];
}

// QuestionAnswer - Chi tiết câu hỏi và câu trả lời
export interface QuestionAnswer {
  question_id: number;
  question_text: string;
  selected_option: number;
  correct_answer: number;
  is_correct: boolean;
  options: {
    option1: string;
    option2: string;
    option3: string;
    option4: string;
  };
}

// QuizAttemptWithAnswers - Chi tiết lần làm bài kiểm tra với câu hỏi và câu trả lời đầy đủ
export interface QuizAttemptWithAnswers {
  id: number;
  user_id: number;
  content_type: string;
  content_type_display: string;
  content_id: number;
  content_name: string;
  content_url: string;
  score: number;
  percentage_score: number;
  total_questions: number;
  correct_answers: number;
  submitted_at: string;
  formatted_date: string;
  answers: QuestionAnswer[];
}