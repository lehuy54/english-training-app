import { useRoutes } from "react-router-dom";
// Main pages
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import About from "../pages/About";
import Courses from "../pages/Courses";

// Topics and learning
import Topics from "../pages/Topics";
import TopicFlashcards from "../pages/TopicFlashcards";
import TopicQuiz from "../pages/TopicQuiz";
import QuizResults from "../pages/QuizResults";

// Grammar lessons
import GrammarLessons from "../pages/GrammarLessons";
import GrammarLessonDetail from "../pages/GrammarLessonDetail";
import GrammarLessonQuiz from "../pages/GrammarLessonQuiz";
import GrammarLessonQuizResults from "../pages/GrammarLessonQuizResults";

// Quiz history
import QuizHistory from "../pages/QuizHistory";
import QuizAttemptDetails from "../pages/QuizAttemptDetails";

// Speaking practice with AI
import SpeakingPractice from "../pages/SpeakingPractice";
import SpeakingPracticeDetail from "../pages/SpeakingPracticeDetail";
import SpeakingPracticeHistory from "../pages/SpeakingPracticeHistory";

// Admin
import { UserManagement, ContentManagement } from "../pages/admin";
import MainLayout from "../components/layout/MainLayout";

const Router = () => {
  const routes = useRoutes([
    {
      path: "/",
      element: <MainLayout><Home /></MainLayout>,
    },
    {
      path: "/profile",
      element: <MainLayout><Profile /></MainLayout>,
    },
    {
      path: "/about",
      element: <MainLayout><About /></MainLayout>,
    },
    {
      path: "/courses",
      element: <MainLayout><Courses /></MainLayout>,
    },
    // Topic and learning routes
    {
      path: "/topics",
      element: <MainLayout><Topics /></MainLayout>,
    },
    {
      path: "/topics/:topicId/flashcards",
      element: <MainLayout><TopicFlashcards /></MainLayout>,
    },
    {
      path: "/topics/:topicId/quiz",
      element: <MainLayout><TopicQuiz /></MainLayout>,
    },
    {
      path: "/topics/:topicId/results",
      element: <MainLayout><QuizResults /></MainLayout>,
    },
    // Grammar lesson routes
    {
      path: "/grammar-lessons",
      element: <MainLayout><GrammarLessons /></MainLayout>,
    },
    {
      path: "/grammar-lessons/:id",
      element: <MainLayout><GrammarLessonDetail /></MainLayout>, 
    },
    {
      path: "/grammar-lessons/:id/quiz",
      element: <MainLayout><GrammarLessonQuiz /></MainLayout>,
    },
    {
      path: "/grammar-lessons/:id/results",
      element: <MainLayout><GrammarLessonQuizResults /></MainLayout>,
    },
    // Quiz History routes
    {
      path: "/quiz-history",
      element: <MainLayout><QuizHistory /></MainLayout>,
    },
    {
      path: "/quiz-attempts/:id/details",
      element: <MainLayout><QuizAttemptDetails /></MainLayout>,
    },
    // Admin routes
    {
      path: "/admin/users",
      element: <MainLayout><UserManagement /></MainLayout>,
    },
    {
      path: "/admin/content",
      element: <MainLayout><ContentManagement /></MainLayout>,
    },
    // Speaking practice routes
    {
      path: "/speaking-practice",
      element: <MainLayout><SpeakingPractice /></MainLayout>,
    },
    {
      path: "/speaking-practice/history",
      element: <MainLayout><SpeakingPracticeHistory /></MainLayout>,
    },
    {
      path: "/speaking-practice/:id",
      element: <MainLayout><SpeakingPracticeDetail /></MainLayout>,
    },
  ]);

  return routes;
};

export default Router;
