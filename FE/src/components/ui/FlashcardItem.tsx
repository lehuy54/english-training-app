// components/ui/FlashcardItem.tsx
import { useState } from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { FaVolumeUp, FaEye, FaEyeSlash, FaExchangeAlt } from 'react-icons/fa';
import type { Flashcard } from '../../types';

interface FlashcardItemProps {
  flashcard: Flashcard;
}

const FlashcardItem = ({ flashcard }: FlashcardItemProps) => {
  // Các trạng thái
  const [flipped, setFlipped] = useState(false);
  const [showVietnameseMeaning, setShowVietnameseMeaning] = useState(false);
  
  // Xoay thẻ để hiển thị ví dụ và các thông tin khác
  const handleFlip = () => {
    setFlipped(!flipped);
  };
  
  // Ẩn/hiện nghĩa tiếng Việt
  const toggleVietnameseMeaning = (e: React.MouseEvent) => {
    e.stopPropagation(); // Ngăn chặn sự kiện click lan tỏa đến thẻ
    setShowVietnameseMeaning(!showVietnameseMeaning);
  };
  
  // Phát âm thanh (giả lập)
  const playAudio = (e: React.MouseEvent) => {
    e.stopPropagation(); // Ngăn chặn sự kiện click lan tỏa đến thẻ
    // Ở đây có thể sử dụng Web Speech API hoặc các API khác để phát âm
    const utterance = new SpeechSynthesisUtterance(flashcard.vocabulary);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };
  
  return (
    <Card 
      className={`flashcard-item mb-4 shadow-sm ${flipped ? 'bg-light' : 'bg-white'}`}
      style={{ transition: 'all 0.3s ease', borderRadius: '1rem', minHeight: '240px' }}
    >
      <Card.Body className="p-4">
        {!flipped ? (
          <div className="flashcard-front">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <h3 className="flashcard-vocabulary mb-1 fw-bold">{flashcard.vocabulary}</h3>
                <p className="flashcard-phonetic text-muted mb-3">{flashcard.phonetics}</p>
              </div>
              <Button 
                variant="light" 
                size="sm" 
                className="rounded-circle p-2" 
                onClick={playAudio}
                title="Phát âm"
              >
                <FaVolumeUp />
              </Button>
            </div>
            
            {/* Description/Definition - Luôn hiển thị */}
            {flashcard.description && (
              <div className="mb-3">
                <Badge bg="light" text="dark" className="mb-1">Definition</Badge>
                <p className="flashcard-description">{flashcard.description}</p>
              </div>
            )}
            
            {/* Phần nghĩa tiếng Việt - Ẩn/hiện theo yêu cầu */}
            {flashcard.vietnamese_meaning && (
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <Badge bg="light" text="dark">Nghĩa tiếng Việt</Badge>
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="p-0 text-muted" 
                    onClick={toggleVietnameseMeaning}
                  >
                    {showVietnameseMeaning ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </div>
                
                {showVietnameseMeaning ? (
                  <p className="flashcard-vietnamese">{flashcard.vietnamese_meaning}</p>
                ) : (
                  <p className="flashcard-vietnamese-hidden bg-light text-light p-2 rounded" style={{ userSelect: 'none' }}>
                    {flashcard.vietnamese_meaning}
                  </p>
                )}
              </div>
            )}
            
            <div className="text-center mt-3">
              <Button 
                variant="outline-primary" 
                size="sm" 
                onClick={handleFlip}
                className="px-3"
              >
                <FaExchangeAlt className="me-1" /> Xem ví dụ
              </Button>
            </div>
          </div>
        ) : (
          <div className="flashcard-back">
            <h4 className="flashcard-vocabulary mb-1 fw-bold text-primary">{flashcard.vocabulary}</h4>
            <p className="flashcard-phonetic text-muted small mb-3">{flashcard.phonetics}</p>
            
            <div className="mb-4">
              <Badge bg="light" text="dark" className="mb-2">Example</Badge>
              <p className="flashcard-example fst-italic p-2 border-start border-primary ps-3">
                {flashcard.example}
              </p>
            </div>
            
            {flashcard.vietnamese_meaning && (
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <Badge bg="light" text="dark">Nghĩa tiếng Việt</Badge>
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="p-0 text-muted" 
                    onClick={toggleVietnameseMeaning}
                  >
                    {showVietnameseMeaning ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </div>
                
                {showVietnameseMeaning ? (
                  <p className="flashcard-vietnamese">{flashcard.vietnamese_meaning}</p>
                ) : (
                  <p className="flashcard-vietnamese-hidden bg-light text-light p-2 rounded" style={{ userSelect: 'none' }}>
                    {flashcard.vietnamese_meaning}
                  </p>
                )}
              </div>
            )}
            
            <div className="text-center mt-3">
              <Button 
                variant="outline-secondary" 
                size="sm" 
                onClick={handleFlip}
                className="px-3"
              >
                <FaExchangeAlt className="me-1" /> Quay lại
              </Button>
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default FlashcardItem;
