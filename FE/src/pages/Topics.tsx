// pages/Topics.tsx
import { useTopics, useTopicProgressStats } from "../hooks/useTopics";
import TopicItem from "../components/ui/TopicItem";
import { Alert, Spinner, Card } from "react-bootstrap";
import ProgressBar from "../components/ui/ProgressBar";

const Topics = () => {
  const { data: topics, isLoading, error } = useTopics();
  const { data: progressStats, isLoading: loadingProgress } = useTopicProgressStats();

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Đang tải danh sách chủ đề...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="my-4">
        Có lỗi xảy ra khi tải danh sách chủ đề. Vui lòng thử lại sau.
      </Alert>
    );
  }

  if (!topics || topics.length === 0) {
    return (
      <Alert variant="info" className="my-4">
        Hiện tại chưa có chủ đề nào. Vui lòng quay lại sau.
      </Alert>
    );
  }

  return (
    <div className="topics-page">
      <h2 className="mb-4">Chủ đề từ vựng</h2>
      <p className="lead mb-4">
        Chọn một chủ đề để bắt đầu học từ vựng hoặc làm bài kiểm tra.
      </p>
      
      {/* Tiến độ tổng thể */}
      <div className="mb-4">
        <Card className="shadow-sm">
          <Card.Body>
            <Card.Title className="mb-3">Tiến độ học tập tổng quát</Card.Title>
            <ProgressBar 
              stats={progressStats || null}
              loading={loadingProgress}
            />
          </Card.Body>
        </Card>
      </div>
      
      <div className="row">
        {topics.map(topic => (
          <div key={topic.id} className="col-md-6 col-lg-4 mb-4">
            <TopicItem topic={topic} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Topics;
