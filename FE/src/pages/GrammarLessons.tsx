// pages/GrammarLessons.tsx
import { useGrammarLessons, useGrammarProgressStats } from "../hooks/useGrammarLessons";
import { Alert, Spinner, Card, Accordion, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import ProgressBar from "../components/ui/ProgressBar";
import { FaBook, FaClipboardCheck } from "react-icons/fa";

const GrammarLessons = () => {
  const { data: lessons, isLoading, error } = useGrammarLessons();
  const { data: progressStats, isLoading: loadingProgress } = useGrammarProgressStats();

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Đang tải danh sách bài học ngữ pháp...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="my-4">
        Có lỗi xảy ra khi tải danh sách bài học ngữ pháp. Vui lòng thử lại sau.
      </Alert>
    );
  }

  if (!lessons || lessons.length === 0) {
    return (
      <Alert variant="info" className="my-4">
        Hiện tại chưa có bài học ngữ pháp nào. Vui lòng quay lại sau.
      </Alert>
    );
  }

  return (
    <div className="grammar-lessons-page py-4">
      <div className="container">
        <h2 className="mb-4">Bài học ngữ pháp</h2>
        
        <div className="grammar-progress mb-4">
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="mb-3">Tiến độ tổng quan</Card.Title>
              <ProgressBar 
                stats={progressStats || null}
                loading={loadingProgress}
              />
            </Card.Body>
          </Card>
        </div>
        
        <div className="grammar-lessons-list">
          <Accordion className="shadow-sm">
            {lessons.map((lesson, index) => (
              <Accordion.Item key={lesson.id} eventKey={lesson.id.toString()}>
                <Accordion.Header>
                  <span className="me-2 fw-bold">#{index + 1}.</span> {lesson.title}
                </Accordion.Header>
                <Accordion.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex flex-column gap-2 w-100">
                      <Link 
                        to={`/grammar-lessons/${lesson.id}`} 
                        className="text-decoration-none"
                      >
                        <Button variant="outline-primary" className="w-100">
                          <FaBook className="me-2" /> Nội dung bài học
                        </Button>
                      </Link>
                      
                      <Link 
                        to={`/grammar-lessons/${lesson.id}/quiz`} 
                        className="text-decoration-none"
                      >
                        <Button variant="outline-success" className="w-100">
                          <FaClipboardCheck className="me-2" /> Bài trắc nghiệm
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default GrammarLessons;
