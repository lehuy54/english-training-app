// pages/Courses.tsx
import VocabularyTopicCard from "../components/ui/VocabularyTopicCard";
import GrammarLessonCard from "../components/ui/GrammarLessonCard";

const Courses = () => {
  return (
    <div className="courses-page">
      <h2 className="mb-4">Các khóa học</h2>
      
      <div className="row">
        {/* Topic Vocabulary Course Card */}
        <div className="col-md-6 mb-4">
          <VocabularyTopicCard />
        </div>
        
        {/* Grammar Course Card */}
        <div className="col-md-6 mb-4">
          <GrammarLessonCard />
        </div>
      </div>
      
      <div className="row mt-4">
        <div className="col-12">
          <div className="alert alert-info">
            <h5 className="alert-heading">Sắp ra mắt!</h5>
            <p className="mb-0">
              Chúng tôi đang phát triển thêm nhiều khóa học hấp dẫn khác. 
              Hãy đăng nhập để nhận thông báo khi có khóa học mới!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;
