// hooks/useTopics.ts
import { useQuery } from "@tanstack/react-query";
import { getTopics } from "../services/topicService";
import { getProgressStats } from "../services/progressService";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

export const useTopics = () => {
  return useQuery({
    queryKey: ["topics"],
    queryFn: getTopics,
  });
};

export const useTopicProgressStats = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  
  return useQuery({
    queryKey: ["topicProgress"],
    queryFn: async () => {
      if (!user) return null;
      return await getProgressStats(user.id, "topic");
    },
    enabled: !!user, // Only run when user is available
  });
};
