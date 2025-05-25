// pages/admin/QuestionManagement.tsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, Button, Badge, Modal, Form, Alert, Spinner, InputGroup, Pagination, Dropdown } from 'react-bootstrap';
import { FaEdit, FaTrash, FaSave, FaSearch, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { getQuestions, createQuestion, updateQuestion, deleteQuestion } from '../../services/questionService';
import { getTopics } from '../../services/topicService';
import { getGrammarLessons } from '../../services/grammarLessonService';
import type { Question, QuestionInput } from '../../types/question';

type QuestionSortField = 'question_text' | 'content_type' | 'created_at';
type SortDirection = 'asc' | 'desc';
type ContentTypeFilter = 'all' | 'topic' | 'grammar';

const QuestionManagement: React.FC = () => {
  const queryClient = useQueryClient();
  
  // State for Modals
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [isNewQuestion, setIsNewQuestion] = useState(false);
  const [contentOptions, setContentOptions] = useState<{id: number, name: string}[]>([]);
  const [selectedContentType, setSelectedContentType] = useState<'topic' | 'grammar'>('topic');
  
  // Form state
  const [questionForm, setQuestionForm] = useState<QuestionInput>({
    content_type: 'topic',
    content_id: 0,
    content_name: '',
    question_text: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    correct_answer: 1
  });
  
  const [formError, setFormError] = useState('');
  
  // Search and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<QuestionSortField>('question_text');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [contentTypeFilter, setContentTypeFilter] = useState<ContentTypeFilter>('all');
  
  // Items per page
  const itemsPerPage = 10;

  // API Queries
  const { 
    data: questions = [], 
    isLoading: questionsLoading,
    isError: questionsError 
  } = useQuery({
    queryKey: ['questions'],
    queryFn: getQuestions,
    refetchOnWindowFocus: false,
  });
  
  const { 
    data: topics = [],
    isLoading: topicsLoading
  } = useQuery({
    queryKey: ['topics'],
    queryFn: getTopics,
    refetchOnWindowFocus: false,
  });
  
  const { 
    data: grammarLessons = [],
    isLoading: grammarLoading
  } = useQuery({
    queryKey: ['grammarLessons'],
    queryFn: getGrammarLessons,
    refetchOnWindowFocus: false,
  });

  // Mutations
  const createQuestionMutation = useMutation({
    mutationFn: (data: QuestionInput) => createQuestion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      setShowQuestionModal(false);
      setFormError('');
      resetForm();
    },
    onError: (error: any) => {
      setFormError(error.response?.data?.error || 'Có lỗi xảy ra khi tạo câu hỏi mới');
    }
  });
  
  const updateQuestionMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: QuestionInput }) => updateQuestion(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      setShowQuestionModal(false);
      setFormError('');
    },
    onError: (error: any) => {
      setFormError(error.response?.data?.error || 'Có lỗi xảy ra khi cập nhật câu hỏi');
    }
  });
  
  const deleteQuestionMutation = useMutation({
    mutationFn: (id: number) => deleteQuestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      setShowDeleteModal(false);
    },
    onError: (error: any) => {
      setFormError(error.response?.data?.error || 'Có lỗi xảy ra khi xóa câu hỏi');
    }
  });

  // Reset form
  const resetForm = () => {
    setQuestionForm({
      content_type: 'topic',
      content_id: 0,
      content_name: '',
      question_text: '',
      option1: '',
      option2: '',
      option3: '',
      option4: '',
      correct_answer: 1
    });
  };

  // Handler functions
  const handleAddClick = () => {
    resetForm();
    setIsNewQuestion(true);
    setFormError('');
    updateContentOptions('topic');
    setSelectedContentType('topic');
    setShowQuestionModal(true);
  };
  
  const handleEditClick = (question: Question) => {
    setSelectedQuestion(question);
    setQuestionForm({
      content_type: question.content_type,
      content_id: question.content_id,
      content_name: question.content_name || '',
      question_text: question.question_text,
      option1: question.option1,
      option2: question.option2,
      option3: question.option3,
      option4: question.option4,
      correct_answer: question.correct_answer
    });
    setIsNewQuestion(false);
    setFormError('');
    updateContentOptions(question.content_type);
    setSelectedContentType(question.content_type as 'topic' | 'grammar');
    setShowQuestionModal(true);
  };
  
  const handleDeleteClick = (question: Question) => {
    setSelectedQuestion(question);
    setShowDeleteModal(true);
  };
  
  const handleInputChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setQuestionForm(prev => ({
      ...prev,
      [name]: name === 'correct_answer' || name === 'content_id' ? parseInt(value) : value
    }));
  };
  
  const handleContentTypeChange = (type: 'topic' | 'grammar') => {
    setSelectedContentType(type);
    updateContentOptions(type);
    setQuestionForm(prev => ({
      ...prev,
      content_type: type,
      content_id: 0,
      content_name: ''
    }));
  };
  
  const handleContentSelect = (id: number, name: string) => {
    setQuestionForm(prev => ({
      ...prev,
      content_id: id,
      content_name: name
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!questionForm.question_text.trim()) {
      setFormError('Nội dung câu hỏi không được để trống');
      return;
    }
    
    if (!questionForm.option1.trim() || !questionForm.option2.trim()) {
      setFormError('Ít nhất phải có 2 phương án trả lời');
      return;
    }
    
    if (questionForm.content_id === 0) {
      setFormError('Vui lòng chọn nội dung liên quan');
      return;
    }
    
    if (isNewQuestion) {
      createQuestionMutation.mutate(questionForm);
    } else if (selectedQuestion) {
      updateQuestionMutation.mutate({
        id: selectedQuestion.id,
        data: questionForm
      });
    }
  };
  
  const handleDelete = () => {
    if (selectedQuestion) {
      deleteQuestionMutation.mutate(selectedQuestion.id);
    }
  };
  
  const updateContentOptions = (type: string) => {
    if (type === 'topic') {
      setContentOptions(topics.map(topic => ({ id: topic.id, name: topic.name })));
    } else {
      setContentOptions(grammarLessons.map(lesson => ({ id: lesson.id, name: lesson.title })));
    }
  };
  
  // Sort and filter questions
  const filteredQuestions = questions.filter(question => {
    // Content type filter
    if (contentTypeFilter !== 'all' && question.content_type !== contentTypeFilter) {
      // Log ra để kiểm tra vấn đề filter
      console.log(`Filtering out: content_type=${question.content_type}, filter=${contentTypeFilter}`);
      return false;
    }
    
    // Search term filter
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      return (
        question.question_text.toLowerCase().includes(term) ||
        question.content_name?.toLowerCase().includes(term) ||
        String(question.content_id).includes(term)
      );
    }
    
    return true;
  })
  .sort((a, b) => {
    // Sorting
    let comparison = 0;
    if (sortField === 'question_text') {
      comparison = a.question_text.localeCompare(b.question_text);
    } else if (sortField === 'content_type') {
      comparison = a.content_type.localeCompare(b.content_type);
    } else if (sortField === 'created_at') {
      comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });
  
  // Pagination
  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Handle sorting
  const handleSort = (field: QuestionSortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Render sort icon
  const renderSortIcon = (field: string, currentField: string, direction: SortDirection) => {
    if (field !== currentField) return <FaSort className="ms-1" />;  
    return direction === 'asc' ? <FaSortUp className="ms-1" /> : <FaSortDown className="ms-1" />;
  };
  
  // Pagination component
  const renderPagination = () => {
    const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
    if (totalPages <= 1) return null;

    return (
      <Pagination className="mt-3 justify-content-center">
        <Pagination.First 
          onClick={() => setCurrentPage(1)} 
          disabled={currentPage === 1}
        />
        <Pagination.Prev 
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
          disabled={currentPage === 1}
        />
        
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(page => {
            return page === 1 || 
                   page === totalPages || 
                   Math.abs(page - currentPage) <= 1;
          })
          .map((page, idx, array) => {
            // Add ellipsis
            if (idx > 0 && array[idx - 1] !== page - 1) {
              return (
                <React.Fragment key={`ellipsis-${page}`}>
                  <Pagination.Ellipsis disabled />
                  <Pagination.Item 
                    key={page} 
                    active={page === currentPage}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Pagination.Item>
                </React.Fragment>
              );
            }
            return (
              <Pagination.Item 
                key={page} 
                active={page === currentPage}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Pagination.Item>
            );
          })}
        
        <Pagination.Next 
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
          disabled={currentPage === totalPages}
        />
        <Pagination.Last 
          onClick={() => setCurrentPage(totalPages)} 
          disabled={currentPage === totalPages}
        />
      </Pagination>
    );
  };

  // Get content name helper
  const getContentName = (question: Question) => {
    if (question.content_name) {
      return question.content_name;
    }
    
    if (question.content_type === 'topic') {
      const topic = topics.find(t => t.id === question.content_id);
      return topic ? topic.name : `Chủ đề ID: ${question.content_id}`;
    } else {
      const lesson = grammarLessons.find(l => l.id === question.content_id);
      return lesson ? lesson.title : `Bài ngữ pháp ID: ${question.content_id}`;
    }
  };

  return (
    <div className="question-management">
      {/* Search and Actions */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex">
          <InputGroup>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Tìm kiếm câu hỏi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
          <Dropdown className="ms-2">
            <Dropdown.Toggle variant="outline-secondary" id="dropdown-content-type">
              {contentTypeFilter === 'all' 
                ? 'Tất cả loại nội dung' 
                : contentTypeFilter === 'topic' 
                  ? 'Chủ đề từ vựng' 
                  : 'Bài ngữ pháp'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setContentTypeFilter('all')}>
                Tất cả loại nội dung
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setContentTypeFilter('topic')}>
                Chủ đề từ vựng
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setContentTypeFilter('grammar')}>
                Bài ngữ pháp
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <Button variant="success" size="sm" onClick={handleAddClick}>
          <FaSave className="me-1" /> Thêm câu hỏi mới
        </Button>
      </div>
      
      {/* Loading & Error states */}
      {questionsLoading && (
        <div className="text-center py-4">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Đang tải dữ liệu...</p>
        </div>
      )}
      
      {questionsError && (
        <Alert variant="danger">
          Có lỗi xảy ra khi tải dữ liệu câu hỏi. Vui lòng thử lại sau.
        </Alert>
      )}
      
      {/* Data Table */}
      {!questionsLoading && !questionsError && (
        <>
          {filteredQuestions.length === 0 ? (
            <Alert variant="info">Không tìm thấy câu hỏi nào phù hợp.</Alert>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th onClick={() => handleSort('question_text')} style={{ cursor: 'pointer' }}>
                    Nội dung câu hỏi {renderSortIcon('question_text', sortField, sortDirection)}
                  </th>
                  <th onClick={() => handleSort('content_type')} style={{ cursor: 'pointer' }}>
                    Loại nội dung {renderSortIcon('content_type', sortField, sortDirection)}
                  </th>
                  <th>Nội dung</th>
                  <th>Đáp án đúng</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {paginatedQuestions.map(question => (
                  <tr key={question.id}>
                    <td>{question.id}</td>
                    <td>{question.question_text}</td>
                    <td>
                      <Badge bg={question.content_type === 'topic' ? 'info' : 'primary'}>
                        {question.content_type === 'topic' ? 'Chủ đề từ vựng' : 'Bài ngữ pháp'}
                      </Badge>
                    </td>
                    <td>{getContentName(question)}</td>
                    <td>{question.correct_answer}</td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="me-1"
                        onClick={() => handleEditClick(question)}
                      >
                        <FaEdit />
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDeleteClick(question)}
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
          
          {renderPagination()}
        </>
      )}
      
      {/* Add/Edit Question Modal */}
      <Modal 
        show={showQuestionModal} 
        onHide={() => setShowQuestionModal(false)}
        backdrop="static"
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>{isNewQuestion ? 'Thêm câu hỏi mới' : 'Cập nhật câu hỏi'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formError && (
            <Alert variant="danger">{formError}</Alert>
          )}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Loại nội dung</Form.Label>
              <div>
                <Form.Check
                  inline
                  type="radio"
                  label="Chủ đề từ vựng"
                  name="content_type"
                  id="content-type-topic"
                  checked={selectedContentType === 'topic'}
                  onChange={() => handleContentTypeChange('topic')}
                />
                <Form.Check
                  inline
                  type="radio"
                  label="Bài ngữ pháp"
                  name="content_type"
                  id="content-type-grammar"
                  checked={selectedContentType === 'grammar'}
                  onChange={() => handleContentTypeChange('grammar')}
                />
              </div>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>
                {selectedContentType === 'topic' ? 'Chọn chủ đề' : 'Chọn bài học ngữ pháp'}
              </Form.Label>
              {(topicsLoading || grammarLoading) ? (
                <Spinner animation="border" size="sm" />
              ) : (
                <Form.Select
                  name="content_id"
                  value={questionForm.content_id}
                  onChange={(e) => {
                    const id = parseInt(e.target.value);
                    const option = contentOptions.find(o => o.id === id);
                    if (option) {
                      handleContentSelect(id, option.name);
                    }
                  }}
                >
                  <option value={0}>-- Chọn {selectedContentType === 'topic' ? 'chủ đề' : 'bài học'} --</option>
                  {contentOptions.map(option => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </Form.Select>
              )}
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Nội dung câu hỏi</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="question_text"
                value={questionForm.question_text}
                onChange={handleInputChange}
                placeholder="Nhập nội dung câu hỏi"
                required
              />
            </Form.Group>
            
            <div className="mb-3">
              <Form.Label>Các phương án trả lời</Form.Label>
              
              <Form.Group className="mb-2">
                <InputGroup>
                  <InputGroup.Radio
                    name="correct_answer"
                    value={1}
                    checked={questionForm.correct_answer === 1}
                    onChange={handleInputChange}
                  />
                  <Form.Control
                    name="option1"
                    value={questionForm.option1}
                    onChange={handleInputChange}
                    placeholder="Phương án 1"
                    required
                  />
                </InputGroup>
              </Form.Group>
              
              <Form.Group className="mb-2">
                <InputGroup>
                  <InputGroup.Radio
                    name="correct_answer"
                    value={2}
                    checked={questionForm.correct_answer === 2}
                    onChange={handleInputChange}
                  />
                  <Form.Control
                    name="option2"
                    value={questionForm.option2}
                    onChange={handleInputChange}
                    placeholder="Phương án 2"
                    required
                  />
                </InputGroup>
              </Form.Group>
              
              <Form.Group className="mb-2">
                <InputGroup>
                  <InputGroup.Radio
                    name="correct_answer"
                    value={3}
                    checked={questionForm.correct_answer === 3}
                    onChange={handleInputChange}
                  />
                  <Form.Control
                    name="option3"
                    value={questionForm.option3}
                    onChange={handleInputChange}
                    placeholder="Phương án 3"
                  />
                </InputGroup>
              </Form.Group>
              
              <Form.Group className="mb-2">
                <InputGroup>
                  <InputGroup.Radio
                    name="correct_answer"
                    value={4}
                    checked={questionForm.correct_answer === 4}
                    onChange={handleInputChange}
                  />
                  <Form.Control
                    name="option4"
                    value={questionForm.option4}
                    onChange={handleInputChange}
                    placeholder="Phương án 4"
                  />
                </InputGroup>
              </Form.Group>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowQuestionModal(false)}>
            Hủy bỏ
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={createQuestionMutation.isPending || updateQuestionMutation.isPending}
          >
            {(createQuestionMutation.isPending || updateQuestionMutation.isPending) ? (
              <>
                <Spinner animation="border" size="sm" className="me-1" />
                Đang xử lý...
              </>
            ) : (
              isNewQuestion ? 'Thêm câu hỏi' : 'Cập nhật'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal 
        show={showDeleteModal} 
        onHide={() => setShowDeleteModal(false)}
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedQuestion && (
            <p>
              Bạn có chắc chắn muốn xóa câu hỏi: <strong>{selectedQuestion.question_text}</strong>?
              <br />
              Hành động này không thể hoàn tác.
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Hủy bỏ
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDelete}
            disabled={deleteQuestionMutation.isPending}
          >
            {deleteQuestionMutation.isPending ? (
              <>
                <Spinner animation="border" size="sm" className="me-1" />
                Đang xử lý...
              </>
            ) : (
              'Xóa câu hỏi'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default QuestionManagement;
