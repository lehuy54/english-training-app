// Question
export interface Question {
    id: number;
    content_type: string;
    content_id: number;
    content_name?: string;
    question_text: string;
    option1: string;
    option2: string;
    option3: string;
    option4: string;
    correct_answer: number;
    created_at: string; // ISO date-time
  }
  
  // QuestionInput
  export interface QuestionInput {
    content_type: string;
    content_id: number;
    content_name?: string;
    question_text: string;
    option1: string;
    option2: string;
    option3: string;
    option4: string;
    correct_answer: number;
  }