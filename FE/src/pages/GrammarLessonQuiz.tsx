// pages/GrammarLessonQuiz.tsx
import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { getGrammarLessonById } from "../services/grammarLessonService";
import { getQuestionsByContentTypeAndId } from "../services/questionService";
import { submitQuizAttempt } from "../services/quizService";
import { Alert, Button, Card, Spinner, Form } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";
import { setQuizResult } from "../store/slices/quizSlice";
import type { RootState } from "../store";
import type { Question } from "../types/question";

interface SelectedAnswer {
  questionId: number;
  selectedOption: number;
}

const GrammarLessonQuiz = () => {
  const { id } = useParams<{ id: string }>();
  const lessonId = parseInt(id || "0", 10);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  
  // States for quiz
  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswer[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch lesson
  const { data: lesson, isLoading: loadingLesson } = useQuery({
    queryKey: ["grammarLesson", lessonId],
    queryFn: () => getGrammarLessonById(lessonId),
    enabled: !!lessonId,
  });
  
  // Fetch questions
  const { 
    data: questions, 
    isLoading: loadingQuestions, 
    error: questionsError 
  } = useQuery({
    queryKey: ["grammarQuestions", lessonId],
    queryFn: () => getQuestionsByContentTypeAndId("grammar", lessonId),
    enabled: !!lessonId,
  });

  // Kiểm tra xem đã chọn câu trả lời cho tất cả câu hỏi chưa
  const allQuestionsAnswered = questions && questions.length > 0 && 
    selectedAnswers.length === questions.length;
  
  // Handle option selection
  const handleOptionSelect = (questionId: number, optionNumber: number) => {
    if (isSubmitting) return; // Prevent changes after submission
    
    const updatedAnswers = [...selectedAnswers];
    const existingAnswerIndex = updatedAnswers.findIndex(a => a.questionId === questionId);
    
    if (existingAnswerIndex >= 0) {
      updatedAnswers[existingAnswerIndex].selectedOption = optionNumber;
    } else {
      updatedAnswers.push({ questionId, selectedOption: optionNumber });
    }
    
    setSelectedAnswers(updatedAnswers);
  };
  
  // Submit quiz
  const handleSubmit = async () => {
    if (!questions || questions.length === 0) return;
    
    setIsSubmitting(true);
    
    try {
      // Tính điểm cho Redux bất kể trường hợp nào
      let correctCount = 0;
      const totalQuestions = questions.length;
      
      selectedAnswers.forEach(answer => {
        const question = questions.find(q => q.id === answer.questionId);
        if (question && question.correct_answer === answer.selectedOption) {
          correctCount++;
        }
      });
      
      const score = Math.round((correctCount / totalQuestions) * 100);
      
      // Lưu kết quả vào Redux
      dispatch(setQuizResult({
        score,
        totalQuestions,
        correctAnswers: correctCount
      }));
      
      // Nếu đã đăng nhập, gọi API để lưu tiến độ
      if (user) {
        await submitQuizAttempt({
          userId: user.id,
          contentType: 'grammar',
          contentId: lessonId,
          answers: selectedAnswers
        });
        
        // Cập nhật các query liên quan
        queryClient.invalidateQueries({ queryKey: ["grammarProgress"] });
        queryClient.invalidateQueries({ queryKey: ["progressStats"] });
      }
      
      // Chuyển hướng đến trang kết quả
      navigate(`/grammar-lessons/${lessonId}/results`);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      setIsSubmitting(false);
    }
  };
  
  // Check if an option is selected
  const isOptionSelected = (questionId: number, optionNumber: number): boolean => {
    const answer = selectedAnswers.find(a => a.questionId === questionId);
    return answer ? answer.selectedOption === optionNumber : false;
  };
  
  if (loadingLesson || loadingQuestions) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Đang tải bài kiểm tra...</p>
      </div>
    );
  }
  
  // Display different messages for error and empty questions
  if (questionsError) {
    return (
      <Alert variant="danger" className="my-4">
        Có lỗi xảy ra khi tải câu hỏi. Vui lòng thử lại sau.
      </Alert>
    );
  }
  
  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-5">
        <Alert variant="info" className="my-4">
          <div className="d-flex flex-column align-items-center">
            <h4>Hiện tại chưa có bài trắc nghiệm cho nội dung này</h4>
            <p className="mt-2">Vui lòng quay lại sau hoặc chọn bài học khác</p>
            <Link to={`/grammar-lessons/${lessonId}`} className="mt-3">
              <Button variant="primary">
                <FaArrowLeft className="me-1" /> Quay lại bài học
              </Button>
            </Link>
          </div>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="grammar-quiz-page py-4">
      <div className="container">
        {/* Header with title and navigation */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>{lesson?.title || "Bài trắc nghiệm"}</h2>
          <div>
            <Link to={`/grammar-lessons/${lessonId}`}>
              <Button variant="outline-secondary">
                <FaArrowLeft className="me-1" /> Quay lại bài học
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Questions */}
        <div className="questions-list">
          {questions.map((question: Question, index: number) => {
            // Determine option keys based on the structure of your API response
            const optionKeys = ["option1", "option2", "option3", "option4"];
            
            return (
              <Card key={question.id} className="mb-3 shadow-sm">
                <Card.Body>
                  <Card.Title>
                    <strong>Câu {index + 1}:</strong> {question.question_text}
                  </Card.Title>
                  <div className="mt-3">
                    {optionKeys.map((optionKey, optionIndex) => {
                      const optionNumber = optionIndex + 1;
                      const optionSelected = isOptionSelected(question.id, optionNumber);
                      
                      return (
                        <div key={optionNumber} className="mb-2">
                          <Form.Check
                            type="radio"
                            id={`q${question.id}-option${optionNumber}`}
                            label={question[optionKey as keyof Question] as string}
                            name={`question-${question.id}`}
                            checked={optionSelected}
                            onChange={() => handleOptionSelect(question.id, optionNumber)}
                            disabled={isSubmitting}
                          />
                        </div>
                      );
                    })}
                  </div>
                </Card.Body>
              </Card>
            );
          })}
        </div>
        
        {/* Navigation buttons */}
        <div className="d-flex justify-content-between mt-4">
          <Link to={`/grammar-lessons/${lessonId}`}>
            <Button variant="outline-secondary">
              <FaArrowLeft className="me-1" /> Quay lại bài học
            </Button>
          </Link>
          
          <Button 
            variant="success" 
            onClick={handleSubmit}
            disabled={!allQuestionsAnswered || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Đang xử lý...
              </>
            ) : (
              <>Nộp bài</>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GrammarLessonQuiz;
