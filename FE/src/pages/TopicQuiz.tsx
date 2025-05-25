// pages/TopicQuiz.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Button, Card, Spinner, ProgressBar } from "react-bootstrap";
import { useTopicQuestions } from "../hooks/useTopicQuestions";
import { useTopics } from "../hooks/useTopics";
import QuizQuestion from "../components/ui/QuizQuestion";
import { useQueryClient } from "@tanstack/react-query";
import { submitQuizAttempt } from "../services/quizService";
import { 
  setCurrentTopicId,
  setQuestions,
  answerQuestion,
  setQuizResult,
  resetQuiz
} from "../store/slices/quizSlice";
import type { RootState } from "../store";

const TopicQuiz = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const topicIdNumber = topicId ? parseInt(topicId) : null;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const user = useSelector((state: RootState) => state.auth.user);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: topics } = useTopics();
  const { data: questions, isLoading, error } = useTopicQuestions(topicIdNumber);
  
  const userAnswers = useSelector((state: RootState) => state.quiz.userAnswers);
  const currentTopic = topics?.find(t => t.id === topicIdNumber);
  
  // Set the current topic and questions in Redux store
  useEffect(() => {
    if (topicIdNumber) {
      dispatch(setCurrentTopicId(topicIdNumber));
    }
    
    if (questions) {
      dispatch(setQuestions(questions));
    }
    
    // Reset quiz when mounting component
    dispatch(resetQuiz());
  }, [dispatch, topicIdNumber, questions]);
  
  const handleAnswerSelect = (questionId: number, selectedOption: number) => {
    dispatch(answerQuestion({ questionId, selectedOption }));
  };
  
  const getSelectedOption = (questionId: number): number | null => {
    const userAnswer = userAnswers.find(answer => answer.questionId === questionId);
    return userAnswer ? userAnswer.selectedOption : null;
  };
  
  const handleSubmit = async () => {
    if (!questions) return;
    
    setIsSubmitting(true);
    
    try {
      // Format the answers for the API
      const answers = userAnswers.map(answer => ({
        questionId: answer.questionId,
        selectedOption: answer.selectedOption
      }));
      
      // Tính điểm cho Redux bất kể trường hợp nào
      let correctCount = 0;
      userAnswers.forEach(answer => {
        const question = questions.find(q => q.id === answer.questionId);
        if (question && question.correct_answer === answer.selectedOption) {
          correctCount++;
        }
      });
      
      const score = Math.round((correctCount / questions.length) * 100);
      
      // Set quiz result in Redux
      dispatch(setQuizResult({
        score,
        totalQuestions: questions.length,
        correctAnswers: correctCount
      }));
      
      // Nếu đã đăng nhập, gọi API để lưu tiến độ
      if (user) {
        // Submit quiz to server
        await submitQuizAttempt({
          userId: user.id,
          contentType: 'topic',
          contentId: topicIdNumber || 0,
          answers: answers
        });
        
        // Invalidate progress queries to update the progress bar
        queryClient.invalidateQueries({ queryKey: ["topicProgress"] });
        queryClient.invalidateQueries({ queryKey: ["progressStats"] });
      } else {
        // Hiển thị thông báo cho người dùng biết rằng tiến độ không được lưu
        console.info('User is not logged in. Progress will not be saved.');
      }
      
      // Navigate to results page
      navigate(`/topics/${topicId}/results`);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      setIsSubmitting(false);
    }
  };
  
  // Calculate progress
  const progress = questions && questions.length > 0
    ? Math.round((userAnswers.length / questions.length) * 100)
    : 0;

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Đang tải các câu hỏi...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="my-4">
        Có lỗi xảy ra khi tải câu hỏi. Vui lòng thử lại sau.
      </Alert>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <Card className="my-4 shadow-sm">
        <Card.Body className="text-center py-5">
          <h3>Không có câu hỏi nào cho chủ đề này</h3>
          <p className="text-muted mb-4">Vui lòng chọn một chủ đề khác để học.</p>
          <Button 
            variant="primary" 
            onClick={() => navigate('/topics')}
          >
            Quay lại danh sách chủ đề
          </Button>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div className="topic-quiz">
      <Card className="mb-4 shadow-sm">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="m-0">Bài kiểm tra: {currentTopic?.name || "Loading..."}</h3>
            <span className="badge bg-primary">{questions.length} câu hỏi</span>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span>Tiến độ làm bài:</span>
              <span>{userAnswers.length}/{questions.length} câu hỏi</span>
            </div>
            <ProgressBar 
              now={progress} 
              label={`${progress}%`} 
              variant={progress < 100 ? "primary" : "success"}
            />
          </div>

          {questions.map((question, index) => (
            <QuizQuestion
              key={question.id}
              question={question}
              questionNumber={index + 1}
              selectedOption={getSelectedOption(question.id)}
              onSelectOption={handleAnswerSelect}
            />
          ))}
          
          <div className="d-flex justify-content-center mt-5">
            <Button
              variant="success"
              size="lg"
              onClick={handleSubmit}
              disabled={userAnswers.length < questions.length || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner 
                    as="span" 
                    animation="border" 
                    size="sm" 
                    role="status" 
                    aria-hidden="true" 
                  />
                  <span className="ms-2">Đang xử lý...</span>
                </>
              ) : (
                "Nộp bài"
              )}
            </Button>
          </div>
          
          {userAnswers.length < questions.length && (
            <div className="text-center mt-3">
              <Alert variant="warning">
                Vui lòng trả lời tất cả các câu hỏi trước khi nộp bài.
              </Alert>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default TopicQuiz;
