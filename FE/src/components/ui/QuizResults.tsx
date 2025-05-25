// components/ui/QuizResults.tsx
import { Card, ProgressBar } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  topicId?: number;
  contentId?: number;
  contentType?: 'topic' | 'grammar';
}

const QuizResults = ({ 
  totalQuestions, 
  correctAnswers,
  topicId,
  contentId,
  contentType = 'topic'
}: QuizResultsProps) => {
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  
  let variant = 'success';
  let message = 'Xuất sắc! Bạn đã nắm vững chủ đề này.';
  
  if (percentage < 70) {
    variant = 'danger';
    message = 'Bạn cần ôn tập thêm về chủ đề này.';
  } else if (percentage < 90) {
    variant = 'warning';
    message = 'Tốt! Hãy tiếp tục cải thiện.';
  }

  return (
    <Card className="quiz-results shadow">
      <Card.Header as="h5" className="text-center bg-primary text-white">
        Kết quả bài kiểm tra
      </Card.Header>
      <Card.Body className="text-center">
        <div className="mb-4">
          <h1 className="display-1 fw-bold mb-0">{percentage}%</h1>
          <p className="text-muted">Điểm số của bạn</p>
        </div>
        
        <div className="mb-4">
          <ProgressBar 
            variant={variant} 
            now={percentage} 
            label={`${percentage}%`} 
            className="mb-3"
          />
          
          <div className="d-flex justify-content-between small text-muted mb-2">
            <span>Câu trả lời đúng:</span>
            <span>{correctAnswers} / {totalQuestions}</span>
          </div>
          
          <div className={`alert alert-${variant} mt-3`}>
            {message}
          </div>
        </div>
        
        <div className="d-flex gap-3 justify-content-center">
          {contentType === 'topic' ? (
            // Nút cho bài kiểm tra chủ đề
            <>
              <Link 
                to={`/topics/${topicId}/quiz`} 
                className="btn btn-outline-primary"
              >
                Làm lại
              </Link>
              <Link 
                to={`/topics/${topicId}/flashcards`} 
                className="btn btn-primary"
              >
                Ôn tập từ vựng
              </Link>
              <Link 
                to="/topics" 
                className="btn btn-outline-secondary"
              >
                Quay lại danh sách chủ đề
              </Link>
            </>
          ) : (
            // Nút cho bài kiểm tra ngữ pháp
            <>
              <Link 
                to={`/grammar-lessons/${contentId}/quiz`} 
                className="btn btn-outline-primary"
              >
                Làm lại
              </Link>
              <Link 
                to={`/grammar-lessons/${contentId}`} 
                className="btn btn-primary"
              >
                Quay lại bài học
              </Link>
              <Link 
                to="/grammar-lessons" 
                className="btn btn-outline-secondary"
              >
                Quay lại danh sách bài học
              </Link>
            </>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default QuizResults;
