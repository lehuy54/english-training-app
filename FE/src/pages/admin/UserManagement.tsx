// pages/admin/UserManagement.tsx
import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, Table, Button, Badge, Modal, Form, Alert, Spinner, InputGroup, Pagination } from "react-bootstrap";
import { FaEdit, FaTrash, FaSave, FaSearch, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { getUsers, updateUser, deleteUser } from "../../services/userService";
import type { UserInfo, UserRole } from "../../types/auth";
import type { RootState } from "../../store";
import type { UserUpdateInput } from "../../types";

// Define sort fields for users
type SortField = "display_name" | "registered_at";
type SortDirection = "asc" | "desc";

const UserManagement = () => {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // State for managing modals and forms
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);
  const [editForm, setEditForm] = useState({
    display_name: "",
    email: "",
    role: ""
  });
  const [error, setError] = useState("");
  
  // Search and pagination state
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("display_name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const usersPerPage = 10;
  
  // Fetch users with React Query
  const { data: users = [], isLoading, isError } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    refetchOnWindowFocus: false,
  });
  
  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UserUpdateInput }) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setShowEditModal(false);
      setError("");
    },
    onError: (error: any) => {
      setError(error.response?.data?.error || "Có lỗi xảy ra khi cập nhật người dùng");
    }
  });
  
  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setShowDeleteModal(false);
    },
    onError: (error: any) => {
      setError(error.response?.data?.error || "Có lỗi xảy ra khi xóa người dùng");
    }
  });
  
  // Redirect if not admin
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/');
    }
  }, [currentUser, navigate]);
  
  // Handle opening edit modal
  const handleEditClick = async (user: UserInfo) => {
    setSelectedUser(user);
    setEditForm({
      display_name: user.display_name,
      email: user.email,
      role: user.role
    });
    setShowEditModal(true);
  };
  
  // Handle opening delete confirmation modal
  const handleDeleteClick = (user: UserInfo) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    
    if (!editForm.display_name.trim()) {
      setError("Tên hiển thị không được để trống");
      return;
    }
    
    updateUserMutation.mutate({
      id: selectedUser.id,
      data: {
        display_name: editForm.display_name,
        email: editForm.email,
        role: editForm.role as UserRole
      }
    });
  };
  
  // Handle user deletion
  const handleConfirmDelete = () => {
    if (!selectedUser) return;
    deleteUserMutation.mutate(selectedUser.id);
  };
  
  // Filter and sort users
  const filteredUsers = useMemo(() => {
    if (!users || users.length === 0) return [];
    
    return users.filter(user => {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        user.display_name.toLowerCase().includes(searchTermLower) ||
        user.email.toLowerCase().includes(searchTermLower)
      );
    }).sort((a, b) => {
      // Sort by selected field
      if (sortField === "display_name") {
        const nameA = a.display_name.toLowerCase();
        const nameB = b.display_name.toLowerCase();
        return sortDirection === "asc" 
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      } else { // Sort by registration date
        const dateA = new Date(a.registered_at).getTime();
        const dateB = new Date(b.registered_at).getTime();
        return sortDirection === "asc" 
          ? dateA - dateB
          : dateB - dateA;
      }
    });
  }, [users, searchTerm, sortField, sortDirection]);
  
  // Calculate pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  
  // Generate pagination items
  const paginationItems = [];
  for (let number = 1; number <= totalPages; number++) {
    paginationItems.push(
      <Pagination.Item 
        key={number} 
        active={number === currentPage}
        onClick={() => setCurrentPage(number)}
      >
        {number}
      </Pagination.Item>
    );
  }
  
  // Handle sort change
  const handleSortChange = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // New field, default to ascending
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  // Get sort icon for column
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <FaSort />;
    return sortDirection === "asc" ? <FaSortUp /> : <FaSortDown />;
  };
  
  // If loading, show spinner
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </Spinner>
      </div>
    );
  }
  
  // If error fetching users
  if (isError) {
    return (
      <Alert variant="danger">
        Có lỗi khi tải danh sách người dùng. Vui lòng thử lại sau.
      </Alert>
    );
  }

  return (
    <div className="admin-page p-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Quản lý người dùng</h2>
        
        {/* Search bar */}
        <div className="d-flex" style={{ width: '350px' }}>
          <InputGroup>
            <Form.Control
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
            />
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
          </InputGroup>
        </div>
      </div>
      
      <Card className="shadow-sm mb-3">
        <Card.Body>
          <Table responsive hover striped>
            <thead>
              <tr>
                <th style={{ width: '50px' }}>STT</th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSortChange("display_name")}>
                  Tên hiển thị {getSortIcon("display_name")}
                </th>
                <th>Email</th>
                <th>Vai trò</th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSortChange("registered_at")}>
                  Ngày đăng ký {getSortIcon("registered_at")}
                </th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user, index) => (
                <tr key={user.id}>
                  <td>{indexOfFirstUser + index + 1}</td>
                  <td>{user.display_name}</td>
                  <td>{user.email}</td>
                  <td>
                    <Badge bg={user.role === 'admin' ? 'danger' : 'primary'}>
                      {user.role}
                    </Badge>
                  </td>
                  <td>{new Date(user.registered_at).toLocaleDateString()}</td>
                  <td>
                    <Button 
                      variant="outline-info" 
                      size="sm" 
                      className="me-2"
                      onClick={() => handleEditClick(user)}
                    >
                      <FaEdit /> Sửa
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleDeleteClick(user)}
                      disabled={user.id === currentUser?.id}
                    >
                      <FaTrash /> Xóa
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-4">
              <p className="text-muted">Không tìm thấy người dùng nào.</p>
            </div>
          )}
          
          {/* Show table info and pagination */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>
              Hiển thị {filteredUsers.length > 0 ? indexOfFirstUser + 1 : 0} - {Math.min(indexOfLastUser, filteredUsers.length)} của {filteredUsers.length} người dùng
            </div>
            
            <Pagination className="mb-0">
              <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
              <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
              {paginationItems}
              <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} />
              <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages || totalPages === 0} />
            </Pagination>
          </div>
        </Card.Body>
      </Card>
      
      {/* Edit User Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa người dùng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Tên hiển thị</Form.Label>
              <Form.Control 
                type="text" 
                name="display_name" 
                value={editForm.display_name} 
                onChange={handleInputChange} 
                required 
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type="email" 
                name="email" 
                value={editForm.email} 
                onChange={handleInputChange} 
                disabled
              />
              <Form.Text className="text-muted">
                Email không thể thay đổi.
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Vai trò</Form.Label>
              <Form.Select 
                name="role" 
                value={editForm.role} 
                onChange={handleInputChange}
                disabled={selectedUser?.id === currentUser?.id} // Can't change your own role
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </Form.Select>
              {selectedUser?.id === currentUser?.id && (
                <Form.Text className="text-muted">
                  Bạn không thể thay đổi vai trò của chính mình.
                </Form.Text>
              )}
            </Form.Group>
            
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                Hủy
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                disabled={updateUserMutation.isPending}
              >
                {updateUserMutation.isPending ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <FaSave className="me-1" /> Lưu thay đổi
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa người dùng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <p>Bạn có chắc chắn muốn xóa người dùng <strong>{selectedUser?.display_name}</strong>?</p>
          <p className="text-danger">Hành động này không thể hoàn tác!</p>
          
          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Hủy
            </Button>
            <Button 
              variant="danger" 
              onClick={handleConfirmDelete}
              disabled={deleteUserMutation.isPending}
            >
              {deleteUserMutation.isPending ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Đang xử lý...
                </>
              ) : "Xác nhận xóa"}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UserManagement;
