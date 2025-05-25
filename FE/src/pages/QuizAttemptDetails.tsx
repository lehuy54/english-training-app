// pages/QuizAttemptDetails.tsx
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Card, Badge, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { FaArrowLeft, FaCheck, FaTimes, FaTrophy } from 'react-icons/fa';
import { getQuizAttemptDetails } from '../services/quizService';
import type { QuizAttemptDetails } from '../types/quiz';

const QuizAttemptDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const attemptId = id ? parseInt(id) : 0;
  const navigate = useNavigate();
  
  const [attempt, setAttempt] = useState<QuizAttemptDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchAttemptDetails = async () => {
      try {
        setLoading(true);
        const details = await getQuizAttemptDetails(attemptId);
        setAttempt(details);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch attempt details:', err);
        setError('Không thể tải chi tiết bài làm. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    
    if (attemptId > 0) {
      fetchAttemptDetails();
    } else {
      setError('ID bài làm không hợp lệ');
      setLoading(false);
    }
  }, [attemptId]);
  
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Đang tải chi tiết bài làm...</p>
      </Container>
    );
  }
  
  if (error || !attempt) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          {error || 'Không tìm thấy thông tin bài làm'}
        </Alert>
        <Button variant="primary" onClick={() => navigate('/quiz-history')}>
          <FaArrowLeft className="me-2" /> Quay lại lịch sử làm bài
        </Button>
      </Container>
    );
  }
  
  // Tính điểm phần trăm
  const scorePercent = Math.round((attempt.correct_answers / attempt.total_questions) * 100);
  
  // Xác định màu sắc cho badge điểm
  let scoreVariant = 'danger';
  if (scorePercent >= 80) {
    scoreVariant = 'success';
  } else if (scorePercent >= 60) {
    scoreVariant = 'warning';
  } else if (scorePercent >= 40) {
    scoreVariant = 'info';
  }
  
  // Format thời gian hoàn thành
  const formattedDate = new Date(attempt.completed_at).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  return (
    <div className="quiz-attempt-details-page py-4">
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Chi tiết bài làm</h1>
          <Link to="/quiz-history" className="text-decoration-none">
            <Button variant="outline-primary">
              <FaArrowLeft className="me-2" /> Quay lại lịch sử
            </Button>
          </Link>
        </div>
        
        {/* Tổng quan */}
        <Card className="border-0 shadow-sm mb-4">
          <Card.Body>
            <Row>
              <Col md={8}>
                <h5 className="fw-bold mb-3">{attempt.content_name}</h5>
                <p className="mb-2">
                  <strong>Loại bài kiểm tra:</strong> {' '}
                  <Badge bg={attempt.content_type === 'topic' ? 'primary' : 'success'}>
                    {attempt.content_type === 'topic' ? 'Từ vựng' : 'Ngữ pháp'}
                  </Badge>
                </p>
                <p className="mb-2">
                  <strong>Thời gian hoàn thành:</strong> {formattedDate}
                </p>
                <p className="mb-2">
                  <strong>Kết quả:</strong> {' '}
                  <Badge bg={scoreVariant}>
                    {attempt.correct_answers}/{attempt.total_questions} câu đúng ({scorePercent}%)
                  </Badge>
                </p>
              </Col>
              <Col md={4} className="text-center">
                <div 
                  className={`score-circle bg-${scoreVariant} text-white rounded-circle d-flex align-items-center justify-content-center mx-auto`}
                  style={{ width: '120px', height: '120px' }}
                >
                  <div>
                    <FaTrophy size={30} />
                    <h2 className="mb-0 mt-2">{scorePercent}%</h2>
                  </div>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        
        {/* Chi tiết các câu hỏi và câu trả lời */}
        <Card className="border-0 shadow-sm">
          <Card.Body>
            <h5 className="fw-bold mb-3">Chi tiết câu trả lời</h5>
            
            {attempt.answers.map((answer, index) => (
              <Card 
                key={answer.question_id}
                className={`mb-3 ${answer.is_correct ? 'border-success' : 'border-danger'}`}
              >
                <Card.Body>
                  <div className="d-flex align-items-start">
                    <div 
                      className={`answer-indicator rounded-circle d-flex align-items-center justify-content-center me-3 ${answer.is_correct ? 'bg-success' : 'bg-danger'} text-white`}
                      style={{ minWidth: '34px', height: '34px', marginTop: '3px' }}
                    >
                      {answer.is_correct ? <FaCheck /> : <FaTimes />}
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-3 fw-bold">Câu {index + 1}: {answer.question_text}</h6>
                      
                      <div className="ps-2">
                        {answer.options.map((option, optionIndex) => {
                          const isSelected = optionIndex + 1 === answer.selected_option;
                          const isCorrect = optionIndex + 1 === answer.correct_option;
                          
                          let optionClass = '';
                          let icon = null;
                          
                          if (isSelected && isCorrect) {
                            optionClass = 'text-success fw-bold';
                            icon = <FaCheck className="text-success" />;
                          } else if (isSelected && !isCorrect) {
                            optionClass = 'text-danger fw-bold';
                            icon = <FaTimes className="text-danger" />;
                          } else if (!isSelected && isCorrect) {
                            optionClass = 'text-success';
                            icon = <FaCheck className="text-success" />;
                          }
                          
                          return (
                            <div key={optionIndex} className="mb-2 d-flex align-items-center">
                              <span className={`me-2 ${optionClass}`}>
                                {String.fromCharCode(65 + optionIndex)}. {option}
                              </span>
                              {icon}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))}
            
            <div className="d-flex justify-content-between mt-4">
              <Link to="/quiz-history" className="text-decoration-none">
                <Button variant="outline-primary">
                  <FaArrowLeft className="me-2" /> Quay lại lịch sử
                </Button>
              </Link>
              
              {attempt.content_type === 'topic' ? (
                <Link to={`/topics/${attempt.content_id}`} className="text-decoration-none">
                  <Button variant="primary">
                    Quay lại chủ đề
                  </Button>
                </Link>
              ) : (
                <Link to={`/grammar-lessons/${attempt.content_id}`} className="text-decoration-none">
                  <Button variant="success">
                    Quay lại bài học
                  </Button>
                </Link>
              )}
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default QuizAttemptDetailsPage;
