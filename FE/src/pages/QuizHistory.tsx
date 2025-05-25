// pages/QuizHistory.tsx
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Table, Badge, Spinner, Alert, Button, Form, InputGroup, Pagination } from 'react-bootstrap';
import { FaBook, FaLanguage, FaCalendarAlt, FaMedal, FaArrowRight, FaCheckCircle, FaClipboardList, FaSearch } from 'react-icons/fa';
import { getQuizHistoryByUserId } from '../services/quizService';
import type { RootState } from '../store';
import type { QuizHistory } from '../types/quiz';
import { useGlobalAuthModal } from '../components/layout/MainLayout';

const QuizHistoryPage = () => {
  const [quizHistory, setQuizHistory] = useState<QuizHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  const user = useSelector((state: RootState) => state.auth.user);
  const { openLoginModal } = useGlobalAuthModal();
  
  useEffect(() => {
    const fetchQuizHistory = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const history = await getQuizHistoryByUserId(user.id);
        
        // Process data to add formatted dates and percentage scores
        const processedHistory = history.map(attempt => {
          // Calculate score percentage - handle case when score might be a string or missing values
          const score = typeof attempt.score === 'string' ? parseFloat(attempt.score) : (attempt.score || 0);
          const totalQuestions = attempt.total_questions || 0;
          const correctAnswers = attempt.correct_answers || 0;
          
          // Use score directly if it's a percentage value (0-100), otherwise calculate from correct/total
          const percentageScore = score >= 0 && score <= 1 && totalQuestions > 0
            ? Math.round(score * 100)
            : totalQuestions > 0 
              ? Math.round((correctAnswers / totalQuestions) * 100)
              : 0;
          
          return {
            ...attempt,
            percentage_score: percentageScore,
            formatted_date: new Date(attempt.submitted_at).toLocaleDateString('vi-VN', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            }),
            content_type_display: attempt.content_type === 'topic' ? 'Từ vựng' : 'Ngữ pháp',
            content_url: attempt.content_type === 'topic' 
              ? `/topics/${attempt.content_id}/flashcards` 
              : `/grammar-lessons/${attempt.content_id}`
          };
        });
        
        setQuizHistory(processedHistory);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch quiz history:', err);
        setError('Không thể tải lịch sử làm bài. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuizHistory();
  }, [user]);
  
  if (!user) {
    return (
      <Container className="py-5">
        <Card>
          <Card.Body className="text-center py-5">
            <Alert variant="warning">
              <Alert.Heading>Bạn cần đăng nhập để xem lịch sử làm bài</Alert.Heading>
              <p className="mb-0">Vui lòng đăng nhập để theo dõi tiến độ và lịch sử làm bài của bạn.</p>
              <Button variant="primary" className="mt-3" onClick={openLoginModal}>
                Đăng nhập ngay
              </Button>
            </Alert>
          </Card.Body>
        </Card>
      </Container>
    );
  }
  
  // Tính toán số liệu thống kê
  const totalAttempts = quizHistory.length;
  
  // Sử dụng giá trị percentage_score đã xử lý trước đó
  const averageScore = totalAttempts > 0 
    ? Math.round(quizHistory.reduce((sum, attempt) => {
        // Sử dụng percentage_score nếu có, nếu không thì tính toán
        if (attempt.percentage_score !== undefined) {
          return sum + attempt.percentage_score;
        }
        
        // Nếu chưa có percentage_score, tính từ số câu đúng và tổng số câu
        const correctAnswers = attempt.correct_answers || 0;
        const totalQuestions = attempt.total_questions || 1; // Tránh chia cho 0
        return sum + Math.round((correctAnswers / totalQuestions) * 100);
      }, 0) / totalAttempts) 
    : 0;
    
  const topicAttempts = quizHistory.filter(item => item.content_type === 'topic').length;
  const grammarAttempts = quizHistory.filter(item => item.content_type === 'grammar').length;
  
  // Lọc và sắp xếp lịch sử theo thời gian gần nhất
  const filteredHistory = [...quizHistory]
    .filter(item => {
      if (!searchTerm.trim()) return true;
      return item.content_name?.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime());
  
  // Tính toán phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHistory.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  
  // Xử lý thay đổi trang
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  // Tạo các mục phân trang
  const renderPaginationItems = () => {
    const items = [];
    
    // Luôn hiển thị trang đầu
    items.push(
      <Pagination.Item 
        key="first"
        active={currentPage === 1}
        onClick={() => paginate(1)}
      >
        1
      </Pagination.Item>
    );
    
    // Thêm dấu chấm lửng nếu trang hiện tại > 3
    if (currentPage > 3) {
      items.push(<Pagination.Ellipsis key="ellipsis1" />);
    }
    
    // Thêm trang trước trang hiện tại nếu > 1
    if (currentPage > 2) {
      items.push(
        <Pagination.Item 
          key={currentPage - 1}
          onClick={() => paginate(currentPage - 1)}
        >
          {currentPage - 1}
        </Pagination.Item>
      );
    }
    
    // Thêm trang hiện tại nếu không phải trang đầu hoặc cuối
    if (currentPage !== 1 && currentPage !== totalPages) {
      items.push(
        <Pagination.Item 
          key={currentPage}
          active
        >
          {currentPage}
        </Pagination.Item>
      );
    }
    
    // Thêm trang sau trang hiện tại
    if (currentPage < totalPages - 1) {
      items.push(
        <Pagination.Item 
          key={currentPage + 1}
          onClick={() => paginate(currentPage + 1)}
        >
          {currentPage + 1}
        </Pagination.Item>
      );
    }
    
    // Thêm dấu chấm lửng nếu cần
    if (currentPage < totalPages - 2) {
      items.push(<Pagination.Ellipsis key="ellipsis2" />);
    }
    
    // Luôn hiển thị trang cuối nếu có nhiều hơn 1 trang
    if (totalPages > 1) {
      items.push(
        <Pagination.Item 
          key={totalPages}
          active={currentPage === totalPages}
          onClick={() => paginate(totalPages)}
        >
          {totalPages}
        </Pagination.Item>
      );
    }
    
    return items;
  };
  
  return (
    <div className="quiz-history-page py-4">
      <Container>
        <h1 className="mb-4">Lịch sử làm bài kiểm tra</h1>
        
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Đang tải lịch sử làm bài...</p>
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <>
            {/* Thanh tìm kiếm */}
            <Card className="mb-4 border-0 shadow-sm">
              <Card.Body>
                <Form>
                  <InputGroup>
                    <Form.Control
                      placeholder="Tìm kiếm theo tên bài học..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
                      }}
                    />
                    <Button variant="primary">
                      <FaSearch />
                    </Button>
                  </InputGroup>
                </Form>
              </Card.Body>
            </Card>
            
            {/* Thống kê tổng quan */}
            <Row className="mb-4">
              <Col md={3} sm={6} className="mb-3">
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="text-center p-4">
                    <div className="feature-icon bg-primary text-white rounded-circle d-inline-flex justify-content-center align-items-center mb-3" style={{ width: '60px', height: '60px' }}>
                      <FaBook size={24} />
                    </div>
                    <h3 className="fw-bold">{totalAttempts}</h3>
                    <p className="text-muted mb-0">Tổng số bài làm</p>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={3} sm={6} className="mb-3">
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="text-center p-4">
                    <div className="feature-icon bg-success text-white rounded-circle d-inline-flex justify-content-center align-items-center mb-3" style={{ width: '60px', height: '60px' }}>
                      <FaMedal size={24} />
                    </div>
                    <h3 className="fw-bold">{averageScore}%</h3>
                    <p className="text-muted mb-0">Điểm trung bình</p>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={3} sm={6} className="mb-3">
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="text-center p-4">
                    <div className="feature-icon bg-info text-white rounded-circle d-inline-flex justify-content-center align-items-center mb-3" style={{ width: '60px', height: '60px' }}>
                      <FaBook size={24} />
                    </div>
                    <h3 className="fw-bold">{topicAttempts}</h3>
                    <p className="text-muted mb-0">Bài kiểm tra từ vựng</p>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={3} sm={6} className="mb-3">
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="text-center p-4">
                    <div className="feature-icon bg-warning text-white rounded-circle d-inline-flex justify-content-center align-items-center mb-3" style={{ width: '60px', height: '60px' }}>
                      <FaLanguage size={24} />
                    </div>
                    <h3 className="fw-bold">{grammarAttempts}</h3>
                    <p className="text-muted mb-0">Bài kiểm tra ngữ pháp</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            
            {filteredHistory.length === 0 ? (
              <Card className="mb-4">
                <Card.Body className="text-center py-5">
                  <div className="mb-4">
                    <FaClipboardList size={80} className="text-secondary" />
                  </div>
                  <Alert variant="info">
                    <p className="mb-0">{searchTerm ? 'Không tìm thấy bài học nào phù hợp với từ khóa tìm kiếm.' : 'Bạn chưa làm bài kiểm tra nào. Hãy thử làm một bài kiểm tra để xem kết quả tại đây!'}</p>
                    <div className="mt-3">
                      <Link to="/courses" className="text-decoration-none me-2">
                        <Button variant="primary">
                          Xem các khóa học
                        </Button>
                      </Link>
                    </div>
                  </Alert>
                </Card.Body>
              </Card>
            ) : (
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <h5 className="mb-3 fw-bold">Chi tiết lịch sử làm bài</h5>
                  
                  <div className="table-responsive">
                    <Table hover>
                      <thead className="table-light">
                        <tr>
                          <th>#</th>
                          <th>Tên bài học</th>
                          <th>Loại bài</th>
                          <th>Kết quả</th>
                          <th>Thời gian</th>
                          <th>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentItems.map((attempt, index) => {
                          // Make sure percentage_score is treated as a number with default 0
                          const percentScore = attempt.percentage_score || 0;
                          const badgeVariant = percentScore >= 80 ? 'success' : 
                                              percentScore >= 60 ? 'warning' : 
                                              percentScore >= 40 ? 'info' : 'danger';
                          
                          // Default URL if content_url is undefined
                          const contentUrl = attempt.content_url || 
                            (attempt.content_type === 'topic' ? `/flashcards/${attempt.content_id}` : `/grammar/${attempt.content_id}`);
                          
                          return (
                            <tr key={attempt.id}>
                              <td>{indexOfFirstItem + index + 1}</td>
                              <td>{attempt.content_name}</td>
                              <td>
                                <Badge bg={attempt.content_type === 'topic' ? 'primary' : 'success'}>
                                  {attempt.content_type_display || (attempt.content_type === 'topic' ? 'Từ vựng' : 'Ngữ pháp')}
                                </Badge>
                              </td>
                              <td>
                                <Badge bg={badgeVariant}>
                                  {percentScore}% 
                                  {percentScore >= 80 && <FaCheckCircle className="ms-1" />}
                                </Badge>
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <FaCalendarAlt className="me-1 text-muted" /> {attempt.formatted_date || new Date(attempt.submitted_at).toLocaleDateString('vi-VN')}
                                </div>
                              </td>
                              <td>
                                <div className="d-flex gap-2">
                                  <Link to={contentUrl} className="text-decoration-none">
                                    <Button 
                                      variant="outline-success" 
                                      size="sm"
                                    >
                                      <FaArrowRight className="me-1" /> Học lại
                                    </Button>
                                  </Link>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>
                  
                  {/* Phân trang */}
                  {filteredHistory.length > itemsPerPage && (
                    <div className="d-flex justify-content-center mt-4">
                      <Pagination>
                        <Pagination.Prev 
                          onClick={() => paginate(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                        />
                        {renderPaginationItems()}
                        <Pagination.Next 
                          onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                        />
                      </Pagination>
                    </div>
                  )}
                </Card.Body>
              </Card>
            )}
          </>
        )}
      </Container>
    </div>
  );
};

export default QuizHistoryPage;
