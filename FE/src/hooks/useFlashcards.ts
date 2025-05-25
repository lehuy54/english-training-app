// hooks/useFlashcards.ts
import { useQuery } from "@tanstack/react-query";
import { getFlashcardsByTopicId } from "../services/flashcardService";

export const useFlashcards = (topicId: number | null) => {
  return useQuery({
    queryKey: ["flashcards", topicId],
    queryFn: () => {
      if (!topicId) return [];
      return getFlashcardsByTopicId(topicId);
    },
    enabled: !!topicId, // Only fetch when topicId is available
  });
};
