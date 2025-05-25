import React, { useState } from 'react';
import { Container, Card, Form, Button, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaPaperPlane, FaHistory, FaRobot } from 'react-icons/fa';
import { createSpeakingPractice } from '../services/speakingService';
import type { RootState } from '../store';

const SpeakingPractice: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  
  const [context, setContext] = useState('');
  const [tone, setTone] = useState('');
  const [audience, setAudience] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Kiểm tra nếu người dùng chưa đăng nhập thì chuyển hướng về trang home
  React.useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Vui lòng nhập nội dung bạn muốn tạo đoạn hội thoại.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await createSpeakingPractice({
        context,
        tone,
        audience,
        content
      });
      
      setSuccess(true);
      navigate(`/speaking-practice/${response.data.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const viewHistory = () => {
    navigate('/speaking-practice/history');
  };
  
  return (
    <Container className="py-5">
      <h1 className="text-center mb-4">AI Hỗ trợ Giao tiếp Tiếng Anh</h1>
      
      <p className="text-center text-muted mb-4 fst-italic">
        AI sẽ giúp bạn tạo nội dung tiếng Anh phù hợp với tình huống,
        giọng điệu và đối tượng bạn chọn. Bạn có thể luyện cách giao tiếp
        hoặc nhắn tin, trò chuyện với bạn bè nhiều hơn để cải thiện kỹ năng 
        tiếng Anh của mình.
      </p>
      
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="mb-4 d-flex align-items-center">
                <FaRobot className="text-danger me-2" /> Tạo Đoạn Hội Thoại Mới
              </Card.Title>
              
              {error && <Alert variant="danger">{error}</Alert>}
              {success && (
                <Alert variant="success">
                  Đã tạo đoạn hội thoại thành công! Đang chuyển hướng...
                </Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Ngữ cảnh/Tình huống</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Ví dụ: Phỏng vấn xin việc, Thuyết trình trước lớp..."
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Giọng điệu</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ví dụ: Trang trọng, Thân mật, Chuyên nghiệp..."
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Đối tượng</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ví dụ: Nhà tuyển dụng, Đồng nghiệp, Học sinh..."
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                  />
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label>Nội dung <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Mô tả chi tiết nội dung bạn muốn luyện nói..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                  />
                  <Form.Text className="text-muted">
                    Mô tả càng chi tiết, AI sẽ giúp bạn tạo nội dung luyện nói càng phù hợp.
                  </Form.Text>
                </Form.Group>
                
                <div className="d-flex justify-content-between">
                  <Button
                    variant="outline-secondary"
                    onClick={viewHistory}
                    disabled={isSubmitting}
                  >
                    <FaHistory className="me-2" /> Xem lịch sử luyện nói
                  </Button>
                  
                  <Button
                    variant="danger"
                    type="submit"
                    disabled={isSubmitting || !content.trim()}
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="me-2" /> Tạo bài luyện nói
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SpeakingPractice;
