import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Spinner, Alert, Badge, Form, InputGroup, Pagination } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaHistory, FaEye, FaArrowLeft, FaRobot, FaSearch } from 'react-icons/fa';
import { getSpeakingPracticeHistory } from '../services/speakingService';
import type { RootState } from '../store';
import type { SpeakingPractice } from '../services/speakingService';

const SpeakingPracticeHistory: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  
  const [history, setHistory] = useState<SpeakingPractice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Kiểm tra nếu người dùng chưa đăng nhập thì chuyển hướng về trang home
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);
  
  // Lấy lịch sử luyện nói
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await getSpeakingPracticeHistory();
        setHistory(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Không thể tải lịch sử hội thoại. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchHistory();
  }, []);
  
  const truncateText = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  
  // Lọc và phân trang
  const filteredHistory = history
    .filter(item => {
      if (!searchTerm.trim()) return true;
      return (
        item.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.context?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

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
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>
          <FaHistory className="me-2" /> Lịch sử hội thoại AI
        </h1>
        <Button
          variant="outline-primary"
          onClick={() => navigate('/speaking-practice')}
        >
          <FaArrowLeft className="me-2" /> Quay lại
        </Button>
      </div>
      
      {/* Thanh tìm kiếm */}
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Form>
            <InputGroup>
              <Form.Control
                placeholder="Tìm kiếm theo nội dung hoặc ngữ cảnh..."
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
      
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Đang tải dữ liệu...</p>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : filteredHistory.length === 0 ? (
        <Card className="shadow-sm">
          <Card.Body className="text-center py-5">
            <div className="mb-3">
              <FaRobot size={48} className="text-muted" />
            </div>
            <h5>{searchTerm ? 'Không tìm thấy kết quả phù hợp' : 'Bạn chưa có đoạn hội thoại nào'}</h5>
            <p className="text-muted">
              {searchTerm 
                ? 'Thử tìm kiếm với từ khóa khác hoặc tạo hội thoại mới'
                : 'Tạo đoạn hội thoại AI đầu tiên của bạn ngay bây giờ'}
            </p>
            <Button
              variant="danger"
              onClick={() => navigate('/speaking-practice')}
            >
              <FaRobot className="me-2" /> Tạo hội thoại mới
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Card className="shadow-sm">
          <Card.Body>
            <Table responsive hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nội dung yêu cầu</th>
                  <th>Ngữ cảnh</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((practice, index) => (
                  <tr key={practice.id}>
                    <td>{indexOfFirstItem + index + 1}</td>
                    <td>{truncateText(practice.content, 50)}</td>
                    <td>
                      {practice.context ? (
                        truncateText(practice.context, 30)
                      ) : (
                        <Badge bg="secondary">Không có</Badge>
                      )}
                    </td>
                    <td>{new Date(practice.created_at).toLocaleString('vi-VN')}</td>
                    <td>
                      <Link to={`/speaking-practice/${practice.id}`}>
                        <Button variant="outline-primary" size="sm">
                          <FaEye className="me-1" /> Chi tiết
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
          
          {/* Phân trang */}
          {filteredHistory.length > itemsPerPage && (
            <Card.Body className="border-top pt-3">
              <div className="d-flex justify-content-center">
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
            </Card.Body>
          )}
          
          <Card.Footer className="bg-white">
            <Button
              variant="danger"
              onClick={() => navigate('/speaking-practice')}
            >
              <FaRobot className="me-2" /> Tạo hội thoại mới
            </Button>
          </Card.Footer>
        </Card>
      )}
    </Container>
  );
};

export default SpeakingPracticeHistory;
