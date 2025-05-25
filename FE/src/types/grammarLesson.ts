// GrammarLesson
export interface GrammarLesson {
    id: number;
    title: string;
    content: string;
    video_url: string | null;
    created_at: string; // ISO date-time
  }
  
  // GrammarLessonInput
  export interface GrammarLessonInput {
    title: string;
    content: string;
    video_url?: string | null;
  }