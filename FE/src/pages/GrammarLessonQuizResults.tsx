// pages/GrammarLessonQuizResults.tsx
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Alert, Card, Button } from "react-bootstrap";
import QuizResultsComponent from "../components/ui/QuizResults";
import type { RootState } from "../store";
import { useGlobalAuthModal } from "../components/layout/MainLayout";

const GrammarLessonQuizResults = () => {
  const { id } = useParams<{ id: string }>();
  const lessonId = id ? parseInt(id) : 0;
  const navigate = useNavigate();
  const { openLoginModal } = useGlobalAuthModal();
  
  const quizResult = useSelector((state: RootState) => state.quiz.quizResult);
  const user = useSelector((state: RootState) => state.auth.user);
  
  // Redirect if there's no quiz result
  useEffect(() => {
    if (!quizResult) {
      navigate(`/grammar-lessons/${id}/quiz`);
    }
  }, [quizResult, navigate, id]);
  
  if (!quizResult) {
    return (
      <Card className="text-center p-5">
        <Alert variant="info">
          Không có kết quả bài kiểm tra. Đang chuyển hướng...
        </Alert>
      </Card>
    );
  }

  const handleReturnToLesson = () => {
    navigate(`/grammar-lessons/${id}`);
  };

  return (
    <div className="quiz-results-page py-4">
      <div className="container">
        <h2 className="mb-4">Kết quả bài kiểm tra ngữ pháp</h2>
        
        <QuizResultsComponent 
          score={quizResult.score}
          totalQuestions={quizResult.totalQuestions}
          correctAnswers={quizResult.correctAnswers}
          contentId={lessonId}
          contentType="grammar"
        />
        
        {!user && (
          <Card className="mt-4 text-center">
            <Card.Body>
              <Alert variant="warning">
                <Alert.Heading>Tiến độ chưa được lưu!</Alert.Heading>
                <p>Bạn chưa đăng nhập, vì vậy kết quả và tiến độ của bạn sẽ không được lưu.</p>
                <p>Hãy đăng nhập để lưu tiến độ học tập của bạn.</p>
                <Button variant="primary" onClick={openLoginModal}>Đăng nhập ngay</Button>
              </Alert>
            </Card.Body>
          </Card>
        )}
        
        <div className="text-center mt-4">
          <Button variant="primary" onClick={handleReturnToLesson}>
            Quay lại bài học
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GrammarLessonQuizResults;
