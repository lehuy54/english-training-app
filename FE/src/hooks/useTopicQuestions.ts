// hooks/useTopicQuestions.ts
import { useQuery } from "@tanstack/react-query";
import { getQuestions } from "../services/questionService";

export const useTopicQuestions = (topicId: number | null) => {
  return useQuery({
    queryKey: ["questions", "topic", topicId],
    queryFn: async () => {
      if (!topicId) return [];
      
      // Get all questions and filter for the current topic
      const allQuestions = await getQuestions();
      return allQuestions.filter(q => 
        q.content_type === "topic" && q.content_id === topicId
      );
    },
    enabled: !!topicId, // Only fetch when topicId is available
  });
};
