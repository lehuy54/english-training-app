// pages/QuizResults.tsx
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Alert, Card, Button } from "react-bootstrap";
import QuizResultsComponent from "../components/ui/QuizResults";
import type { RootState } from "../store";
import { useGlobalAuthModal } from "../components/layout/MainLayout";

const QuizResults = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const topicIdNumber = topicId ? parseInt(topicId) : 0;
  const navigate = useNavigate();
  const { openLoginModal } = useGlobalAuthModal();
  
  const quizResult = useSelector((state: RootState) => state.quiz.quizResult);
  const user = useSelector((state: RootState) => state.auth.user);
  
  // Redirect if there's no quiz result
  useEffect(() => {
    if (!quizResult) {
      navigate(`/topics/${topicId}/quiz`);
    }
  }, [quizResult, navigate, topicId]);
  
  if (!quizResult) {
    return (
      <Card className="text-center p-5">
        <Alert variant="info">
          Không có kết quả bài kiểm tra. Đang chuyển hướng...
        </Alert>
      </Card>
    );
  }

  return (
    <div className="quiz-results-page">
      <QuizResultsComponent 
        score={quizResult.score}
        totalQuestions={quizResult.totalQuestions}
        correctAnswers={quizResult.correctAnswers}
        topicId={topicIdNumber}
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
    </div>
  );
};

export default QuizResults;
