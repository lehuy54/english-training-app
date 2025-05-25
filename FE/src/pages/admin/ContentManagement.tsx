// pages/admin/ContentManagement.tsx
import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, Tabs, Tab, Table, Button, Badge, Modal, Form, Alert, Spinner, InputGroup, Pagination } from "react-bootstrap";
import { FaEdit, FaTrash, FaSave, FaSearch, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { getTopics, createTopic, updateTopic, deleteTopic } from "../../services/topicService";
import { getGrammarLessons, createGrammarLesson, updateGrammarLesson, deleteGrammarLesson } from "../../services/grammarLessonService";
// Không cần import getQuestions vì chức năng đã chuyển sang QuestionManagement
import type { RootState } from "../../store";
import type { Topic, TopicInput } from "../../types/topic";
import type { GrammarLesson, GrammarLessonInput } from "../../types/grammarLesson";
import QuestionManagement from "./QuestionManagement";

// Define sort fields for topics and grammar lessons
type TopicSortField = "name";
type GrammarSortField = "title";
type SortDirection = "asc" | "desc";

const ContentManagement = () => {
  // Basic state
  const [activeTab, setActiveTab] = useState("topics");
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // State for Modals
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [showDeleteTopicModal, setShowDeleteTopicModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [isNewTopic, setIsNewTopic] = useState(false);
  
  const [showGrammarModal, setShowGrammarModal] = useState(false);
  const [showDeleteGrammarModal, setShowDeleteGrammarModal] = useState(false);
  const [selectedGrammar, setSelectedGrammar] = useState<GrammarLesson | null>(null);
  const [isNewGrammar, setIsNewGrammar] = useState(false);
  
  // Không còn cần state cho quản lý câu hỏi vì đã được chuyển sang component QuestionManagement
  
  // Form state
  const [topicForm, setTopicForm] = useState<TopicInput>({
    name: "",
    description: ""
  });
  
  const [grammarForm, setGrammarForm] = useState<GrammarLessonInput>({
    title: "",
    content: "",
    video_url: ""
  });
  
  // Không còn cần state questionForm vì đã được chuyển sang component QuestionManagement
  
  const [formError, setFormError] = useState("");
  
  // Search and pagination for Topics
  const [topicSearchTerm, setTopicSearchTerm] = useState("");
  const [topicCurrentPage, setTopicCurrentPage] = useState(1);
  const [topicSortField, setTopicSortField] = useState<TopicSortField>("name");
  const [topicSortDirection, setTopicSortDirection] = useState<SortDirection>("asc");
  
  // Search and pagination for Grammar Lessons
  const [grammarSearchTerm, setGrammarSearchTerm] = useState("");
  const [grammarCurrentPage, setGrammarCurrentPage] = useState(1);
  const [grammarSortField, setGrammarSortField] = useState<GrammarSortField>("title");
  const [grammarSortDirection, setGrammarSortDirection] = useState<SortDirection>("asc");
  
  // Không còn cần các state search/sort cho quản lý câu hỏi vì đã được chuyển sang component QuestionManagement
  
  // Items per page
  const itemsPerPage = 10;
  
  // Redirect if not admin
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/');
    }
  }, [currentUser, navigate]);
  
  // API Queries
  const { 
    data: topics = [], 
    isLoading: topicsLoading,
    isError: topicsError 
  } = useQuery({
    queryKey: ['topics'],
    queryFn: getTopics,
    refetchOnWindowFocus: false,
  });
  
  const { 
    data: grammarLessons = [], 
    isLoading: grammarLoading,
    isError: grammarError 
  } = useQuery({
    queryKey: ['grammarLessons'],
    queryFn: getGrammarLessons,
    refetchOnWindowFocus: false,
  });
  
  // Không cần truy vấn questions ở component này nữa vì đã chuyển sang QuestionManagement
  // Giữ lại cấu trúc để không ảnh hưởng đến code khác
  
  // Topic Mutations
  const createTopicMutation = useMutation({
    mutationFn: (data: TopicInput) => createTopic(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      setShowTopicModal(false);
      setFormError("");
      setTopicForm({ name: "", description: "" });
    },
    onError: (error: any) => {
      setFormError(error.response?.data?.error || "Có lỗi xảy ra khi tạo chủ đề mới");
    }
  });
  
  const updateTopicMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: TopicInput }) => updateTopic(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      setShowTopicModal(false);
      setFormError("");
    },
    onError: (error: any) => {
      setFormError(error.response?.data?.error || "Có lỗi xảy ra khi cập nhật chủ đề");
    }
  });
  
  const deleteTopicMutation = useMutation({
    mutationFn: (id: number) => deleteTopic(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      setShowDeleteTopicModal(false);
    },
    onError: (error: any) => {
      setFormError(error.response?.data?.error || "Có lỗi xảy ra khi xóa chủ đề");
    }
  });
  
  // Grammar Lesson Mutations
  const createGrammarMutation = useMutation({
    mutationFn: (data: GrammarLessonInput) => createGrammarLesson(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grammarLessons'] });
      setShowGrammarModal(false);
      setFormError("");
      setGrammarForm({ title: "", content: "", video_url: "" });
    },
    onError: (error: any) => {
      setFormError(error.response?.data?.error || "Có lỗi xảy ra khi tạo bài học ngữ pháp mới");
    }
  });
  
  const updateGrammarMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: GrammarLessonInput }) => updateGrammarLesson(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grammarLessons'] });
      setShowGrammarModal(false);
      setFormError("");
    },
    onError: (error: any) => {
      setFormError(error.response?.data?.error || "Có lỗi xảy ra khi cập nhật bài học ngữ pháp");
    }
  });
  
  const deleteGrammarMutation = useMutation({
    mutationFn: (id: number) => deleteGrammarLesson(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grammarLessons'] });
      setShowDeleteGrammarModal(false);
    },
    onError: (error: any) => {
      setFormError(error.response?.data?.error || "Có lỗi xảy ra khi xóa bài học ngữ pháp");
    }
  });
  
  // Question Mutations
  // Không còn cần các mutations cho quản lý câu hỏi vì đã được chuyển sang component QuestionManagement
  
  // Handler functions for Topics
  const handleAddTopicClick = () => {
    setTopicForm({ name: "", description: "" });
    setIsNewTopic(true);
    setFormError("");
    setShowTopicModal(true);
  };
  
  const handleEditTopicClick = (topic: Topic) => {
    setSelectedTopic(topic);
    setTopicForm({
      name: topic.name,
      description: topic.description
    });
    setIsNewTopic(false);
    setFormError("");
    setShowTopicModal(true);
  };
  
  const handleDeleteTopicClick = (topic: Topic) => {
    setSelectedTopic(topic);
    setShowDeleteTopicModal(true);
  };
  
  const handleTopicInputChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setTopicForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleTopicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!topicForm.name.trim()) {
      setFormError("Tên chủ đề không được để trống");
      return;
    }
    
    if (isNewTopic) {
      createTopicMutation.mutate(topicForm);
    } else if (selectedTopic) {
      updateTopicMutation.mutate({
        id: selectedTopic.id,
        data: topicForm
      });
    }
  };
  
  const handleConfirmDeleteTopic = () => {
    if (selectedTopic) {
      deleteTopicMutation.mutate(selectedTopic.id);
    }
  };
  
  // Handler functions for Grammar Lessons
  const handleAddGrammarClick = () => {
    setGrammarForm({ title: "", content: "", video_url: "" });
    setIsNewGrammar(true);
    setFormError("");
    setShowGrammarModal(true);
  };
  
  const handleEditGrammarClick = (lesson: GrammarLesson) => {
    setSelectedGrammar(lesson);
    setGrammarForm({
      title: lesson.title,
      content: lesson.content,
      video_url: lesson.video_url || ""
    });
    setIsNewGrammar(false);
    setFormError("");
    setShowGrammarModal(true);
  };
  
  const handleDeleteGrammarClick = (lesson: GrammarLesson) => {
    setSelectedGrammar(lesson);
    setShowDeleteGrammarModal(true);
  };
  
  const handleGrammarInputChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setGrammarForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleGrammarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!grammarForm.title.trim()) {
      setFormError("Tiêu đề bài học không được để trống");
      return;
    }
    
    if (!grammarForm.content.trim()) {
      setFormError("Nội dung bài học không được để trống");
      return;
    }
    
    if (isNewGrammar) {
      createGrammarMutation.mutate(grammarForm);
    } else if (selectedGrammar) {
      updateGrammarMutation.mutate({
        id: selectedGrammar.id,
        data: grammarForm
      });
    }
  };
  
  const handleConfirmDeleteGrammar = () => {
    if (selectedGrammar) {
      deleteGrammarMutation.mutate(selectedGrammar.id);
    }
  };
  
  // Sort and filter Topics
  const filteredTopics = useMemo(() => {
    if (!topics || topics.length === 0) return [];
    
    return topics
      .filter(topic => {
        const searchTermLower = topicSearchTerm.toLowerCase();
        return (
          topic.name.toLowerCase().includes(searchTermLower) ||
          topic.description.toLowerCase().includes(searchTermLower)
        );
      })
      .sort((a, b) => {
        if (topicSortField === "name") {
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();
          return topicSortDirection === "asc" 
            ? nameA.localeCompare(nameB)
            : nameB.localeCompare(nameA);
        } else {
          // Không còn sort by created_at nữa vì đã loại bỏ trường này
          return 0;
        }
      });
  }, [topics, topicSearchTerm, topicSortField, topicSortDirection]);
  
  // Sort and filter Grammar Lessons
  const filteredGrammarLessons = useMemo(() => {
    if (!grammarLessons || grammarLessons.length === 0) return [];
    
    return grammarLessons
      .filter(lesson => {
        const searchTermLower = grammarSearchTerm.toLowerCase();
        return (
          lesson.title.toLowerCase().includes(searchTermLower) ||
          lesson.content.toLowerCase().includes(searchTermLower)
        );
      })
      .sort((a, b) => {
        if (grammarSortField === "title") {
          const titleA = a.title.toLowerCase();
          const titleB = b.title.toLowerCase();
          return grammarSortDirection === "asc" 
            ? titleA.localeCompare(titleB)
            : titleB.localeCompare(titleA);
        } else {
          // Không còn sort by created_at nữa vì đã loại bỏ trường này
          return 0;
        }
      });
  }, [grammarLessons, grammarSearchTerm, grammarSortField, grammarSortDirection]);
  
  // Pagination for Topics
  const paginatedTopics = useMemo(() => {
    const startIndex = (topicCurrentPage - 1) * itemsPerPage;
    return filteredTopics.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTopics, topicCurrentPage]);
  
  // Pagination for Grammar Lessons
  const paginatedGrammarLessons = useMemo(() => {
    const startIndex = (grammarCurrentPage - 1) * itemsPerPage;
    return filteredGrammarLessons.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredGrammarLessons, grammarCurrentPage]);
  
  // Rendering pagination controls for Topics
  const renderTopicPagination = () => {
    const totalPages = Math.ceil(filteredTopics.length / itemsPerPage);
    if (totalPages <= 1) return null;

    return (
      <Pagination className="mt-3 justify-content-center">
        <Pagination.First 
          onClick={() => setTopicCurrentPage(1)} 
          disabled={topicCurrentPage === 1}
        />
        <Pagination.Prev 
          onClick={() => setTopicCurrentPage(p => Math.max(1, p - 1))} 
          disabled={topicCurrentPage === 1}
        />
        
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(page => {
            return page === 1 || 
                   page === totalPages || 
                   Math.abs(page - topicCurrentPage) <= 1;
          })
          .map((page, idx, array) => {
            // Add ellipsis
            if (idx > 0 && array[idx - 1] !== page - 1) {
              return (
                <React.Fragment key={`ellipsis-${page}`}>
                  <Pagination.Ellipsis disabled />
                  <Pagination.Item 
                    key={page} 
                    active={page === topicCurrentPage}
                    onClick={() => setTopicCurrentPage(page)}
                  >
                    {page}
                  </Pagination.Item>
                </React.Fragment>
              );
            }
            return (
              <Pagination.Item 
                key={page} 
                active={page === topicCurrentPage}
                onClick={() => setTopicCurrentPage(page)}
              >
                {page}
              </Pagination.Item>
            );
          })}
        
        <Pagination.Next 
          onClick={() => setTopicCurrentPage(p => Math.min(totalPages, p + 1))} 
          disabled={topicCurrentPage === totalPages}
        />
        <Pagination.Last 
          onClick={() => setTopicCurrentPage(totalPages)} 
          disabled={topicCurrentPage === totalPages}
        />
      </Pagination>
    );
  };
  
  // Rendering pagination controls for Grammar Lessons
  const renderGrammarPagination = () => {
    const totalPages = Math.ceil(filteredGrammarLessons.length / itemsPerPage);
    if (totalPages <= 1) return null;

    return (
      <Pagination className="mt-3 justify-content-center">
        <Pagination.First 
          onClick={() => setGrammarCurrentPage(1)} 
          disabled={grammarCurrentPage === 1}
        />
        <Pagination.Prev 
          onClick={() => setGrammarCurrentPage(p => Math.max(1, p - 1))} 
          disabled={grammarCurrentPage === 1}
        />
        
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(page => {
            return page === 1 || 
                   page === totalPages || 
                   Math.abs(page - grammarCurrentPage) <= 1;
          })
          .map((page, idx, array) => {
            // Add ellipsis
            if (idx > 0 && array[idx - 1] !== page - 1) {
              return (
                <React.Fragment key={`ellipsis-${page}`}>
                  <Pagination.Ellipsis disabled />
                  <Pagination.Item 
                    key={page} 
                    active={page === grammarCurrentPage}
                    onClick={() => setGrammarCurrentPage(page)}
                  >
                    {page}
                  </Pagination.Item>
                </React.Fragment>
              );
            }
            return (
              <Pagination.Item 
                key={page} 
                active={page === grammarCurrentPage}
                onClick={() => setGrammarCurrentPage(page)}
              >
                {page}
              </Pagination.Item>
            );
          })}
        
        <Pagination.Next 
          onClick={() => setGrammarCurrentPage(p => Math.min(totalPages, p + 1))} 
          disabled={grammarCurrentPage === totalPages}
        />
        <Pagination.Last 
          onClick={() => setGrammarCurrentPage(totalPages)} 
          disabled={grammarCurrentPage === totalPages}
        />
      </Pagination>
    );
  };
  
  // Sorting handlers
  const handleTopicSort = (field: TopicSortField) => {
    if (field === topicSortField) {
      setTopicSortDirection(topicSortDirection === "asc" ? "desc" : "asc");
    } else {
      setTopicSortField(field);
      setTopicSortDirection("asc");
    }
  };
  
  const handleGrammarSort = (field: GrammarSortField) => {
    if (field === grammarSortField) {
      setGrammarSortDirection(grammarSortDirection === "asc" ? "desc" : "asc");
    } else {
      setGrammarSortField(field);
      setGrammarSortDirection("asc");
    }
  };
  
  // Render sort icon
  const renderSortIcon = (field: string, currentField: string, direction: SortDirection) => {
    if (field !== currentField) return <FaSort className="ms-1" />;  
    return direction === "asc" ? <FaSortUp className="ms-1" /> : <FaSortDown className="ms-1" />;
  };

  return (
    <div className="admin-page">
      <h2 className="mb-4">Quản lí nội dung</h2>
      
      <Card>
        <Card.Body>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => k && setActiveTab(k)}
            className="mb-4"
          >
            <Tab eventKey="topics" title="Chủ đề từ vựng">
              {/* Search and Actions */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex">
                  <InputGroup>
                    <InputGroup.Text>
                      <FaSearch />
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="Tìm kiếm chủ đề..."
                      value={topicSearchTerm}
                      onChange={(e) => setTopicSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </div>
                <Button variant="success" size="sm" onClick={handleAddTopicClick}>
                  <FaSave className="me-1" /> Thêm chủ đề mới
                </Button>
              </div>
              
              {/* Loading & Error states */}
              {topicsLoading && (
                <div className="text-center py-4">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2">Đang tải dữ liệu...</p>
                </div>
              )}
              
              {topicsError && (
                <Alert variant="danger">
                  Có lỗi xảy ra khi tải dữ liệu chủ đề. Vui lòng thử lại sau.
                </Alert>
              )}
              
              {/* Data Table */}
              {!topicsLoading && !topicsError && (
                <>
                  <Table responsive hover>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th onClick={() => handleTopicSort("name")} style={{ cursor: "pointer" }}>
                          Tên chủ đề {renderSortIcon("name", topicSortField, topicSortDirection)}
                        </th>
                        <th>Mô tả</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedTopics.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center py-3">Không tìm thấy chủ đề nào</td>
                        </tr>
                      ) : (
                        paginatedTopics.map((topic: Topic) => (
                          <tr key={topic.id}>
                            <td>{topic.id}</td>
                            <td>{topic.name}</td>
                            <td>{topic.description.substring(0, 50)}{topic.description.length > 50 ? '...' : ''}</td>
                            <td>
                              <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEditTopicClick(topic)}>
                                <FaEdit /> Sửa
                              </Button>
                              <Button variant="outline-danger" size="sm" onClick={() => handleDeleteTopicClick(topic)}>
                                <FaTrash /> Xóa
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                  
                  {/* Pagination */}
                  {renderTopicPagination()}
                </>
              )}
            </Tab>
            
            <Tab eventKey="grammar" title="Bài học ngữ pháp">
              {/* Search and Actions */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex">
                  <InputGroup>
                    <InputGroup.Text>
                      <FaSearch />
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="Tìm kiếm bài học..."
                      value={grammarSearchTerm}
                      onChange={(e) => setGrammarSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </div>
                <Button variant="success" size="sm" onClick={handleAddGrammarClick}>
                  <FaSave className="me-1" /> Thêm bài học mới
                </Button>
              </div>
              
              {/* Loading & Error states */}
              {grammarLoading && (
                <div className="text-center py-4">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2">Đang tải dữ liệu...</p>
                </div>
              )}
              
              {grammarError && (
                <Alert variant="danger">
                  Có lỗi xảy ra khi tải dữ liệu bài học. Vui lòng thử lại sau.
                </Alert>
              )}
              
              {/* Data Table */}
              {!grammarLoading && !grammarError && (
                <>
                  <Table responsive hover>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th onClick={() => handleGrammarSort("title")} style={{ cursor: "pointer" }}>
                          Tiêu đề {renderSortIcon("title", grammarSortField, grammarSortDirection)}
                        </th>
                        <th>Nội dung</th>
                        <th>Video</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedGrammarLessons.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-3">Không tìm thấy bài học nào</td>
                        </tr>
                      ) : (
                        paginatedGrammarLessons.map((lesson: GrammarLesson) => (
                          <tr key={lesson.id}>
                            <td>{lesson.id}</td>
                            <td>{lesson.title}</td>
                            <td>{lesson.content.substring(0, 50)}...</td>
                            <td>
                              {lesson.video_url ? (
                                <Badge bg="success">Có</Badge>
                              ) : (
                                <Badge bg="secondary">Không</Badge>
                              )}
                            </td>
                            <td>
                              <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEditGrammarClick(lesson)}>
                                <FaEdit /> Sửa
                              </Button>
                              <Button variant="outline-danger" size="sm" onClick={() => handleDeleteGrammarClick(lesson)}>
                                <FaTrash /> Xóa
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                  
                  {/* Pagination */}
                  {renderGrammarPagination()}
                </>
              )}
            </Tab>
            <Tab eventKey="questions" title="Quản lý câu hỏi">
              <QuestionManagement />
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
      
      {/* Modals for Topics */}
      <Modal show={showTopicModal} onHide={() => setShowTopicModal(false)} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{isNewTopic ? 'Thêm chủ đề mới' : 'Chỉnh sửa chủ đề'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleTopicSubmit}>
          <Modal.Body>
            {formError && <Alert variant="danger">{formError}</Alert>}
            
            <Form.Group className="mb-3">
              <Form.Label>Tên chủ đề <span className="text-danger">*</span></Form.Label>
              <Form.Control 
                type="text" 
                name="name" 
                value={topicForm.name}
                onChange={handleTopicInputChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                name="description" 
                value={topicForm.description}
                onChange={handleTopicInputChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowTopicModal(false)}>
              Hủy
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              disabled={createTopicMutation.isPending || updateTopicMutation.isPending}
            >
              {(createTopicMutation.isPending || updateTopicMutation.isPending) ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Đang xử lý...
                </>
              ) : (
                <>Lưu</>  
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      
      <Modal show={showDeleteTopicModal} onHide={() => setShowDeleteTopicModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTopic && (
            <p>Bạn có chắc chắn muốn xóa chủ đề "{selectedTopic.name}"? Hành động này không thể hoàn tác.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteTopicModal(false)}>
            Hủy
          </Button>
          <Button 
            variant="danger" 
            onClick={handleConfirmDeleteTopic}
            disabled={deleteTopicMutation.isPending}
          >
            {deleteTopicMutation.isPending ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Đang xử lý...
              </>
            ) : (
              <>Xóa</>  
            )}
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Modals for Grammar Lessons */}
      <Modal show={showGrammarModal} onHide={() => setShowGrammarModal(false)} backdrop="static" size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{isNewGrammar ? 'Thêm bài học mới' : 'Chỉnh sửa bài học'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleGrammarSubmit}>
          <Modal.Body>
            {formError && <Alert variant="danger">{formError}</Alert>}
            
            <Form.Group className="mb-3">
              <Form.Label>Tiêu đề <span className="text-danger">*</span></Form.Label>
              <Form.Control 
                type="text" 
                name="title" 
                value={grammarForm.title}
                onChange={handleGrammarInputChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Nội dung <span className="text-danger">*</span></Form.Label>
              <Form.Control 
                as="textarea" 
                rows={10} 
                name="content" 
                value={grammarForm.content}
                onChange={handleGrammarInputChange}
                required
              />
              <Form.Text className="text-muted">
                Hỗ trợ HTML để định dạng nội dung bài học.
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Link video YouTube (nếu có)</Form.Label>
              <Form.Control 
                type="text" 
                name="video_url" 
                value={grammarForm.video_url || ''}
                onChange={handleGrammarInputChange}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowGrammarModal(false)}>
              Hủy
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              disabled={createGrammarMutation.isPending || updateGrammarMutation.isPending}
            >
              {(createGrammarMutation.isPending || updateGrammarMutation.isPending) ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Đang xử lý...
                </>
              ) : (
                <>Lưu</>  
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      
      <Modal show={showDeleteGrammarModal} onHide={() => setShowDeleteGrammarModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedGrammar && (
            <p>Bạn có chắc chắn muốn xóa bài học "{selectedGrammar.title}"? Hành động này không thể hoàn tác.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteGrammarModal(false)}>
            Hủy
          </Button>
          <Button 
            variant="danger" 
            onClick={handleConfirmDeleteGrammar}
            disabled={deleteGrammarMutation.isPending}
          >
            {deleteGrammarMutation.isPending ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Đang xử lý...
              </>
            ) : (
              <>Xóa</>  
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ContentManagement;
