// components/ui/GrammarLessonCard.tsx
import { Link } from "react-router-dom";
import ProgressBar from "./ProgressBar";
import { useGrammarProgressStats } from "../../hooks/useGrammarLessons";

const grammarImageUrl = "https://placehold.co/600x400/0275d8/ffffff?text=English+Grammar";

const GrammarLessonCard = () => {
  const { data: progressStats, isLoading } = useGrammarProgressStats();

  return (
    <div className="card h-100 shadow-sm">
      <img 
        src={grammarImageUrl} 
        className="card-img-top" 
        alt="Học ngữ pháp Tiếng Anh"
        style={{ height: "180px", objectFit: "cover" }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">Học ngữ pháp Tiếng Anh</h5>
        <p className="card-text flex-grow-1">
          Nắm vững các quy tắc ngữ pháp tiếng Anh thông qua các bài học trực quan và ví dụ cụ thể.
          Từ cơ bản đến nâng cao giúp bạn giao tiếp tự tin và chính xác.
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
          
          <Link to="/grammar-lessons" className="btn btn-primary w-100">
            Bắt đầu học
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GrammarLessonCard;
