// pages/About.tsx
import { Container, Row, Col, Card } from 'react-bootstrap';

const About = () => {
  return (
    <Container className="py-5">
      <h2 className="text-center mb-5">Về Chúng Tôi</h2>
      
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h3 className="card-title">Giới thiệu</h3>
          <p className="card-text">
            Chào mừng bạn đến với nền tảng học tập trực tuyến Academic Training. Chúng tôi cung cấp 
            các khóa học chất lượng cao để giúp bạn phát triển kỹ năng học thuật và chuyên môn.
          </p>
        </Card.Body>
      </Card>
      
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h3 className="card-title">Sứ mệnh</h3>
          <p className="card-text">
            Sứ mệnh của chúng tôi là cung cấp nền giáo dục chất lượng cao, 
            truy cập dễ dàng cho mọi người, mọi nơi. Chúng tôi cam kết tạo ra một môi trường 
            học tập sáng tạo và hiệu quả.
          </p>
        </Card.Body>
      </Card>
      
      <h3 className="text-center my-4">Đội Ngũ Phát Triển</h3>
      
      <Row className="mb-4">
        <Col md={6} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex flex-column align-items-center">
              <div className="text-center mb-3">
                <div className="rounded-circle bg-light d-flex align-items-center justify-content-center" style={{ width: '150px', height: '150px', margin: '0 auto' }}>
                  <span className="display-4">👨‍💻</span>
                </div>
              </div>
              <Card.Title className="text-center">Lê Gia Huy</Card.Title>
              <Card.Subtitle className="mb-3 text-muted text-center">Sinh viên</Card.Subtitle>
              <Card.Text className="text-center">
                Người thiết kế nền tảng. Là
                sinh viên năm 4 trường Đại học Khoa học Tự nhiên (HUS), Đại học Quốc gia Hà Nội.
                Ngành Khoa học dữ liệu, Khoa Toán - Cơ - Tin học.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex flex-column align-items-center">
              <div className="text-center mb-3">
                <div className="rounded-circle bg-light d-flex align-items-center justify-content-center" style={{ width: '150px', height: '150px', margin: '0 auto' }}>
                  <span className="display-4">👨‍🏫</span>
                </div>
              </div>
              <Card.Title className="text-center">Đặng Quang Dũng</Card.Title>
              <Card.Subtitle className="mb-3 text-muted text-center">Người hướng dẫn</Card.Subtitle>
              <Card.Text className="text-center">
                Người đề xuất ý tưởng đề tài. Là mentor tại công ty Smartlog.
                Chuyên gia về công nghệ thông tin với nhiều năm kinh nghiệm trong lĩnh vực phát triển phần mềm.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default About;
