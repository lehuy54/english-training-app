// components/ui/TopicItem.tsx
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import type { Topic } from '../../types';

interface TopicItemProps {
  topic: Topic;
}

const TopicItem = ({ topic }: TopicItemProps) => {
  return (
    <Card className="topic-item mb-4 shadow-sm">
      <Card.Body>
        <Card.Title>{topic.name}</Card.Title>
        <Card.Text>{topic.description}</Card.Text>
        
        <div className="d-flex gap-2">
          <Link to={`/topics/${topic.id}/flashcards`} className="btn btn-primary flex-grow-1">
            Học từ vựng
          </Link>
          <Link to={`/topics/${topic.id}/quiz`} className="btn btn-outline-success flex-grow-1">
            Kiểm tra
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TopicItem;
