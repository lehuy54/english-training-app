// pages/TopicFlashcards.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useFlashcards } from "../hooks/useFlashcards";
import { useTopics } from "../hooks/useTopics";
import FlashcardItem from "../components/ui/FlashcardItem";
import { Alert, Button, Spinner, Card } from "react-bootstrap";

const TopicFlashcards = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const topicIdNumber = topicId ? parseInt(topicId) : null;
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const { data: topics } = useTopics();
  const { data: flashcards, isLoading, error } = useFlashcards(topicIdNumber);
  
  const currentTopic = topics?.find(t => t.id === topicIdNumber);
  
  // Reset index when topic changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [topicId]);
  
  const goToNext = () => {
    if (flashcards && currentIndex < flashcards.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
    }
  };
  
  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prevIndex => prevIndex - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="my-4">
        Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.
      </Alert>
    );
  }

  if (!flashcards || flashcards.length === 0) {
    return (
      <Card className="my-4 shadow-sm">
        <Card.Body className="text-center py-5">
          <h3>Không có từ vựng nào cho chủ đề này</h3>
          <p className="text-muted mb-4">Vui lòng chọn một chủ đề khác để học.</p>
          <Link to="/topics" className="btn btn-primary">
            Quay lại danh sách chủ đề
          </Link>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div className="topic-flashcards">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Chủ đề: {currentTopic?.name || "Loading..."}</h2>
        <Link to={`/topics/${topicId}/quiz`} className="btn btn-success">
          Kiểm tra kiến thức
        </Link>
      </div>
      
      <div className="flashcards-container d-flex align-items-center position-relative mb-4">
        {/* Left navigation button */}
        <div className="flashcard-nav-button left-nav position-absolute start-0">
          <Button 
            variant="light" 
            size="lg"
            className="rounded-circle shadow-sm"
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            style={{ width: '50px', height: '50px' }}
          >
            &larr;
          </Button>
        </div>
        
        {/* Centered flashcard */}
        <div className="flashcard-wrapper mx-auto" style={{ maxWidth: '600px', width: '100%' }}>
          <div className="text-center mb-3">
            <p className="small text-muted">
              Thẻ từ vựng {currentIndex + 1} / {flashcards.length}
            </p>
          </div>
          
          <Card className="shadow-sm">
            <Card.Body>
              <FlashcardItem flashcard={flashcards[currentIndex]} />
            </Card.Body>
          </Card>
          
          <div className="d-flex justify-content-center mt-3">
            <Link to="/topics" className="btn btn-outline-secondary me-2">
              Danh sách chủ đề
            </Link>
          </div>
        </div>
        
        {/* Right navigation button */}
        <div className="flashcard-nav-button right-nav position-absolute end-0">
          <Button 
            variant="light" 
            size="lg"
            className="rounded-circle shadow-sm"
            onClick={goToNext}
            disabled={currentIndex === flashcards.length - 1}
            style={{ width: '50px', height: '50px' }}
          >
            &rarr;
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TopicFlashcards;
