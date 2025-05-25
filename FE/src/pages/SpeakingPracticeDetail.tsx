import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaArrowLeft, FaHistory, FaRobot } from 'react-icons/fa';
import { getSpeakingPracticeById } from '../services/speakingService';
import type { RootState } from '../store';
import type { SpeakingPractice } from '../services/speakingService';

const SpeakingPracticeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  
  const [practice, setPractice] = useState<SpeakingPractice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Kiểm tra nếu người dùng chưa đăng nhập thì chuyển hướng về trang home
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate, id]);
  
  // Lấy chi tiết đoạn hội thoại
  useEffect(() => {
    const fetchPracticeDetail = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await getSpeakingPracticeById(parseInt(id));
        setPractice(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Không thể tải đoạn hội thoại. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPracticeDetail();
  }, [id]);
  
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Đang tải dữ liệu...</p>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
        <Button
          variant="outline-primary"
          onClick={() => navigate('/speaking-practice')}
        >
          <FaArrowLeft className="me-2" /> Quay lại
        </Button>
      </Container>
    );
  }
  
  if (!practice) {
    return (
      <Container className="py-5">
        <Alert variant="warning">Không tìm thấy đoạn hội thoại</Alert>
        <Button
          variant="outline-primary"
          onClick={() => navigate('/speaking-practice')}
        >
          <FaArrowLeft className="me-2" /> Quay lại
        </Button>
      </Container>
    );
  }
  
  const formattedDate = new Date(practice.created_at).toLocaleString('vi-VN');
  
  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>
          <FaRobot className="text-danger me-2" /> Chi tiết phản hồi tình huống
        </h1>
        <div>
          <Button
            variant="outline-secondary"
            className="me-2"
            onClick={() => navigate('/speaking-practice')}
          >
            <FaArrowLeft className="me-2" /> Quay lại
          </Button>
          <Button
            variant="outline-primary"
            onClick={() => navigate('/speaking-practice/history')}
          >
            <FaHistory className="me-2" /> Xem lịch sử
          </Button>
        </div>
      </div>
      
      <Row>
        <Col md={4}>
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-light">
              <h5 className="mb-0">Thông tin chi tiết</h5>
            </Card.Header>
            <Card.Body>
              <p><strong>Thời gian tạo:</strong> {formattedDate}</p>
              
              {practice.context && (
                <div className="mb-3">
                  <strong>Ngữ cảnh/Tình huống:</strong>
                  <p className="mt-1">{practice.context}</p>
                </div>
              )}
              
              {practice.tone && (
                <div className="mb-3">
                  <strong>Giọng điệu:</strong>
                  <p className="mt-1">{practice.tone}</p>
                </div>
              )}
              
              {practice.audience && (
                <div className="mb-3">
                  <strong>Đối tượng:</strong>
                  <p className="mt-1">{practice.audience}</p>
                </div>
              )}
              
              <div>
                <strong>Nội dung yêu cầu:</strong>
                <p className="mt-1">{practice.content}</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0">Nội dung AI tạo ra</h5>
            </Card.Header>
            <Card.Body>
              <div className="ai-response" style={{ whiteSpace: 'pre-line' }}>
                {practice.ai_response}
              </div>
            </Card.Body>
            <Card.Footer className="bg-white">
              <Button
                variant="danger"
                onClick={() => navigate('/speaking-practice')}
              >
                <FaRobot className="me-2" /> Tạo hội thoại mới
              </Button>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SpeakingPracticeDetail;
