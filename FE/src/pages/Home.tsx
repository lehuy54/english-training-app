// pages/Home.tsx
import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaBook, FaGraduationCap, FaChalkboardTeacher, FaArrowRight, FaRobot } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getTopics } from '../services/topicService';
import { getGrammarLessons } from '../services/grammarLessonService';
import { useGlobalAuthModal } from '../components/layout/MainLayout';
import type { Topic } from '../types/topic';
import type { GrammarLesson } from '../types/grammarLesson';
import type { RootState } from '../store';

const Home = () => {
  const [featuredTopics, setFeaturedTopics] = useState<Topic[]>([]);
  const [featuredGrammarLessons, setFeaturedGrammarLessons] = useState<GrammarLesson[]>([]);
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const { openLoginModal } = useGlobalAuthModal();
  
  useEffect(() => {
    // Fetch featured content when component mounts
    const fetchFeaturedContent = async () => {
      try {
        // Get 4 latest topics
        const topics = await getTopics();
        setFeaturedTopics(topics.slice(0, 4));
        
        // Get 4 latest grammar lessons
        const grammarLessons = await getGrammarLessons();
        setFeaturedGrammarLessons(grammarLessons.slice(0, 4));
      } catch (error) {
        console.error('Failed to fetch featured content:', error);
      }
    };
    
    fetchFeaturedContent();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero-section py-5 bg-primary text-white">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="mb-4 mb-md-0">
              <h1 className="display-4 fw-bold">Học tiếng Anh dễ dàng</h1>
              <p className="lead my-4">
                Từ vựng, ngữ pháp và bài tập được thiết kế giúp bạn tiến bộ mỗi ngày. Bắt đầu hành trình của bạn ngay hôm nay!                
              </p>
              <div className="d-flex flex-wrap gap-2">
                <Link to="/courses" className="text-decoration-none">
                  <Button 
                    variant="light" 
                    size="lg" 
                    className="px-4 me-2 text-primary"
                  >
                    Khám phá các khóa học
                  </Button>
                </Link>
                {!user && (
                  <Button 
                    variant="outline-light" 
                    size="lg" 
                    onClick={openLoginModal}
                  >
                    Đăng ký miễn phí
                  </Button>
                )}
              </div>
            </Col>
            <Col md={6}>
              <div className="hero-image bg-white p-3 rounded shadow-lg">
                <img 
                  src="https://img.freepik.com/free-vector/english-teacher-concept-illustration_114360-7477.jpg" 
                  alt="Academic Training" 
                  className="img-fluid rounded"
                />
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features Section */}
      <Container className="py-5">
        <h2 className="text-center mb-5 fw-bold">Tại sao nên chọn chúng tôi?</h2>
        <Row>
          <Col md={3} className="mb-4">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="text-center p-4">
                <div className="feature-icon bg-primary text-white rounded-circle d-inline-flex justify-content-center align-items-center mb-3" style={{ width: '80px', height: '80px' }}>
                  <FaBook size={32} />
                </div>
                <Card.Title className="fw-bold mb-3">Học từ vựng hiệu quả</Card.Title>
                <Card.Text>
                  Các chủ đề từ vựng được tổ chức khoa học, kèm theo bài tập để tăng cường ghi nhớ.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-4">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="text-center p-4">
                <div className="feature-icon bg-success text-white rounded-circle d-inline-flex justify-content-center align-items-center mb-3" style={{ width: '80px', height: '80px' }}>
                  <FaGraduationCap size={32} />
                </div>
                <Card.Title className="fw-bold mb-3">Bài học ngữ pháp chi tiết</Card.Title>
                <Card.Text>
                  Giải thích ngữ pháp rõ ràng với ví dụ thực tế và video minh họa giúp bạn dễ dàng nắm bắt.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-4">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="text-center p-4">
                <div className="feature-icon bg-info text-white rounded-circle d-inline-flex justify-content-center align-items-center mb-3" style={{ width: '80px', height: '80px' }}>
                  <FaChalkboardTeacher size={32} />
                </div>
                <Card.Title className="fw-bold mb-3">Các bài kiểm tra tương tác</Card.Title>
                <Card.Text>
                  Thử thách bản thân với các bài kiểm tra và lưu lại tiến độ của bạn để theo dõi sự tiến bộ.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-4">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="text-center p-4">
                <div className="feature-icon bg-danger text-white rounded-circle d-inline-flex justify-content-center align-items-center mb-3" style={{ width: '80px', height: '80px' }}>
                  <FaRobot size={32} />
                </div>
                <Card.Title className="fw-bold mb-3">AI Hỗ trợ Giao tiếp</Card.Title>
                <Card.Text>
                  Tạo đoạn hội thoại tiếng Anh phù hợp với trợ lý AI thông minh, giúp bạn giao tiếp chuẩn xác trong mọi tình huống.
                </Card.Text>
                {user ? (
                  <Link to="/speaking-practice" className="text-decoration-none">
                    <Button variant="outline-danger" className="mt-2">Trò chuyện ngay</Button>
                  </Link>
                ) : (
                  <Button 
                    variant="outline-danger" 
                    className="mt-2" 
                    onClick={openLoginModal}
                  >
                    Trò chuyện ngay
                  </Button>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Featured Content */}
      <div className="bg-light py-5">
        <Container>
          <h2 className="text-center mb-4 fw-bold">Chủ đề từ vựng nổi bật</h2>
          
          {featuredTopics.length > 0 ? (
            <Row>
              {featuredTopics.map(topic => (
                <Col key={topic.id} md={6} lg={3} className="mb-4">
                  <Card className="h-100 border-0 shadow-sm transition-card">
                    <Card.Body>
                      <Card.Title className="fw-bold mb-3">{topic.name}</Card.Title>
                      <Card.Text className="text-muted">
                        {topic.description.length > 100 
                          ? `${topic.description.substring(0, 100)}...` 
                          : topic.description}
                      </Card.Text>
                    </Card.Body>
                    <Card.Footer className="bg-white border-0">
                      <Link to={`/topics/${topic.id}/flashcards`} className="text-decoration-none">
                        <Button 
                          variant="outline-primary" 
                          className="d-flex align-items-center"
                        >
                          Học từ vựng ngay <FaArrowRight className="ms-2" />
                        </Button>
                      </Link>
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <div className="text-center my-5">
              <p>Đang tải dữ liệu...</p>
            </div>
          )}

          <h2 className="text-center mb-4 mt-5 fw-bold">Bài học ngữ pháp đề xuất</h2>
          
          {featuredGrammarLessons.length > 0 ? (
            <Row>
              {featuredGrammarLessons.map(lesson => (
                <Col key={lesson.id} md={6} lg={3} className="mb-4">
                  <Card className="h-100 border-0 shadow-sm transition-card">
                    <Card.Body>
                      <Card.Title className="fw-bold mb-3">{lesson.title}</Card.Title>
                      <Card.Text className="text-muted">
                        {lesson.content.length > 100 
                          ? `${lesson.content.substring(0, 100)}...` 
                          : lesson.content}
                      </Card.Text>
                    </Card.Body>
                    <Card.Footer className="bg-white border-0">
                      <Link to={`/grammar-lessons/${lesson.id}`} className="text-decoration-none">
                        <Button 
                          variant="outline-success" 
                          className="d-flex align-items-center"
                        >
                          Xem bài học <FaArrowRight className="ms-2" />
                        </Button>
                      </Link>
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <div className="text-center my-5">
              <p>Đang tải dữ liệu...</p>
            </div>
          )}
          
          <div className="text-center mt-4">
            <Link to="/courses" className="text-decoration-none">
              <Button variant="primary" size="lg">
                Xem tất cả khóa học
              </Button>
            </Link>
          </div>
        </Container>
      </div>
      
      {/* Call to Action */}
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <Card className="border-0 shadow bg-primary text-white">
              <Card.Body className="p-5 text-center">
                <h2 className="fw-bold mb-3">Bắt đầu hành trình của bạn ngay hôm nay</h2>
                <p className="lead mb-4">
                  Hãy đăng ký tài khoản để theo dõi tiến độ học tập và lưu lại kết quả của bạn!
                </p>
                <Button 
                  variant="light" 
                  size="lg" 
                  className="px-4 text-primary"
                  onClick={user ? () => navigate('/profile') : openLoginModal}
                >
                  {user ? 'Kiểm tra tiến độ' : 'Đăng ký miễn phí'}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;