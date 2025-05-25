// pages/GrammarLessonDetail.tsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getGrammarLessonById } from "../services/grammarLessonService";
import { Alert, Spinner, Card, Button } from "react-bootstrap";
import { FaArrowLeft, FaClipboardCheck } from "react-icons/fa";

const GrammarLessonDetail = () => {
  const { id } = useParams<{ id: string }>();
  const lessonId = parseInt(id || "0", 10);
  
  const { data: lesson, isLoading, error } = useQuery({
    queryKey: ["grammarLesson", lessonId],
    queryFn: () => getGrammarLessonById(lessonId),
    enabled: !!lessonId,
  });
  
  // State for embedded YouTube video
  const [videoId, setVideoId] = useState<string | null>(null);
  
  // Extract YouTube video ID when lesson loads
  useEffect(() => {
    if (lesson?.video_url) {
      // Simple regex to extract YouTube video ID
      const match = lesson.video_url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
      setVideoId(match ? match[1] : null);
    } else {
      setVideoId(null);
    }
  }, [lesson]);
  
  if (isLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Đang tải bài học...</p>
      </div>
    );
  }
  
  if (error || !lesson) {
    return (
      <Alert variant="danger" className="my-4">
        Có lỗi xảy ra khi tải bài học. Vui lòng thử lại sau.
      </Alert>
    );
  }
  
  return (
    <div className="grammar-lesson-detail-page py-4">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>{lesson.title}</h2>
          <div>
            <Link to="/grammar-lessons" className="me-2">
              <Button variant="outline-secondary" size="sm">
                <FaArrowLeft className="me-1" /> Quay lại
              </Button>
            </Link>
            
            <Link to={`/grammar-lessons/${lessonId}/quiz`}>
              <Button variant="outline-success" size="sm">
                <FaClipboardCheck className="me-1" /> Làm bài trắc nghiệm
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Combined content and video section */}
        <Card className="shadow-sm mb-4">
          <Card.Body>
            {/* Video section */}
            {videoId && (
              <div className="mb-4 d-flex justify-content-center">
                <div className="grammar-video-container" style={{ maxWidth: '700px', width: '100%' }}>
                  <div className="ratio ratio-16x9">
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title={lesson.title}
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    ></iframe>
                  </div>
                </div>
              </div>
            )}
            
            {/* Content section */}
            <div className="grammar-content" style={{ whiteSpace: 'pre-line' }}>
              {lesson.content}
            </div>
          </Card.Body>
        </Card>
        
        {/* Navigation buttons */}
        <div className="d-flex justify-content-between">
          <Link to="/grammar-lessons">
            <Button variant="secondary">
              <FaArrowLeft className="me-1" /> Quay lại danh sách
            </Button>
          </Link>
          
          <Link to={`/grammar-lessons/${lessonId}/quiz`}>
            <Button variant="primary">
              <FaClipboardCheck className="me-1" /> Làm bài trắc nghiệm
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GrammarLessonDetail;
