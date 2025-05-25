export interface Topic {
    id: number;
    name: string;
    description: string;
    created_at: string;
  }
  
  export interface TopicInput {
    name: string;
    description: string;
  }