export interface Flashcard {
    id: number;
    topic_id: number;
    vocabulary: string;
    phonetics: string;
    vietnamese_meaning?: string;
    description?: string;
    example: string;
  }
  
  export interface FlashcardInput {
    topic_id: number;
    vocabulary: string;
    phonetics: string;
    vietnamese_meaning?: string;
    description?: string;
    example: string;
  }