// components/ui/VocabularyTopicCard.tsx
import { Link } from "react-router-dom";
import ProgressBar from "./ProgressBar";
import { useTopicProgressStats } from "../../hooks/useTopics";

const topicImageUrl = "https://placehold.co/600x400/198754/ffffff?text=Vocabulary+Topics";

const VocabularyTopicCard = () => {
  const { data: progressStats, isLoading } = useTopicProgressStats();

  return (
    <div className="card h-100 shadow-sm">
      <img 
        src={topicImageUrl} 
        className="card-img-top" 
        alt="Học từ vựng theo chủ đề"
        style={{ height: "180px", objectFit: "cover" }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">Học từ vựng theo chủ đề</h5>
        <p className="card-text flex-grow-1">
          Khám phá và học các từ vựng tiếng Anh được phân loại theo từng chủ đề khác nhau.
          Phương pháp học hiệu quả thông qua các bài tập tương tác.
        </p>
        
        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="text-muted">Tiến độ học tập:</span>
          </div>
          
          <ProgressBar 
            stats={progressStats || null} 
            loading={isLoading} 
            className="mb-3"
          />
          
          <Link to="/topics" className="btn btn-primary w-100">
            Bắt đầu học
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VocabularyTopicCard;
