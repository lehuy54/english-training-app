// hooks/useGrammarLessons.ts
import { useQuery } from "@tanstack/react-query";
import { getGrammarLessons } from "../services/grammarLessonService";
import { getProgressStats } from "../services/progressService";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

export const useGrammarLessons = () => {
  return useQuery({
    queryKey: ["grammarLessons"],
    queryFn: getGrammarLessons,
  });
};

export const useGrammarProgressStats = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  
  return useQuery({
    queryKey: ["grammarProgress"],
    queryFn: async () => {
      if (!user) return null;
      return await getProgressStats(user.id, "grammar");
    },
    enabled: !!user, // Only run when user is available
  });
};
