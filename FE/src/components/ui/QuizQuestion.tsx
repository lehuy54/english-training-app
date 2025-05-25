// components/ui/QuizQuestion.tsx
import { Form } from 'react-bootstrap';
import type { Question } from '../../types';

interface QuizQuestionProps {
  question: Question;
  questionNumber: number;
  selectedOption: number | null;
  onSelectOption: (questionId: number, optionNumber: number) => void;
}

const QuizQuestion = ({ 
  question, 
  questionNumber, 
  selectedOption, 
  onSelectOption 
}: QuizQuestionProps) => {
  
  const handleOptionChange = (optionNumber: number) => {
    onSelectOption(question.id, optionNumber);
  };

  return (
    <div className="quiz-question mb-4 p-3 border rounded">
      <h5 className="mb-3">
        <span className="badge bg-primary me-2">{questionNumber}</span>
        {question.question_text}
      </h5>
      
      <Form>
        {[1, 2, 3, 4].map((optionNumber) => {
          const optionText = question[`option${optionNumber}` as keyof Question] as string;
          
          return (
            <Form.Check
              key={optionNumber}
              type="radio"
              id={`question-${question.id}-option-${optionNumber}`}
              label={optionText}
              name={`question-${question.id}`}
              checked={selectedOption === optionNumber}
              onChange={() => handleOptionChange(optionNumber)}
              className="mb-2 p-2"
            />
          );
        })}
      </Form>
    </div>
  );
};

export default QuizQuestion;
