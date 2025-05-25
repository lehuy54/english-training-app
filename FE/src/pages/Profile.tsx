// pages/Profile.tsx
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col, Card, Form, Button, Alert, Tabs, Tab } from "react-bootstrap";
import { FaUser, FaEnvelope, FaLock, FaEdit, FaSave } from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserProfile, changePassword } from "../services/userService";
import { setCredentials } from "../store/slices/authSlice";
import type { RootState } from "../store";

const Profile = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  
  // State for profile editing
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.display_name || "");
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState("");
  
  // State for password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  
  // Handle display name change
  const updateProfileMutation = useMutation({
    mutationFn: (data: { display_name: string }) => updateUserProfile(data),
    onSuccess: (updatedUser) => {
      // Update local Redux state
      if (user) {
        // Keep the existing token and update the user info
        dispatch(setCredentials({ 
          token: localStorage.getItem("token") || "", 
          user: { ...user, display_name: updatedUser.display_name }
        }));
      }
      
      setIsEditing(false);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
      
      // Invalidate and refetch user query
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
    onError: (error: any) => {
      setUpdateError(error.response?.data?.error || "Có lỗi xảy ra khi cập nhật thông tin");
    }
  });
  
  // Handle password change
  const changePasswordMutation = useMutation({
    mutationFn: (data: { currentPassword: string, newPassword: string }) => 
      changePassword(data),
    onSuccess: () => {
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setPasswordSuccess(true);
      setTimeout(() => setPasswordSuccess(false), 3000);
    },
    onError: (error: any) => {
      setPasswordError(error.response?.data?.error || "Có lỗi xảy ra khi đổi mật khẩu");
    }
  });
  
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      setUpdateError("Tên hiển thị không được để trống");
      return;
    }
    
    updateProfileMutation.mutate({ display_name: displayName });
  };
  
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    
    // Validate passwords
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError("Vui lòng điền đầy đủ thông tin");
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setPasswordError("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Xác nhận mật khẩu không khớp");
      return;
    }
    
    changePasswordMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    });
  };
  
  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  if (!user) return (
    <Container className="py-5">
      <Alert variant="warning">Vui lòng đăng nhập để xem trang cá nhân của bạn.</Alert>
    </Container>
  );

  return (
    <Container className="py-4">
      <h2 className="mb-4">Trang cá nhân</h2>
      
      <Tabs defaultActiveKey="profile" className="mb-4">
        <Tab eventKey="profile" title="Thông tin cá nhân">
          <Card className="shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0">Thông tin tài khoản</h4>
                {!isEditing && (
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    onClick={() => setIsEditing(true)}
                  >
                    <FaEdit /> Chỉnh sửa
                  </Button>
                )}
              </div>
              
              {updateSuccess && (
                <Alert variant="success" className="mb-3">
                  Cập nhật thông tin thành công!
                </Alert>
              )}
              
              {updateError && (
                <Alert variant="danger" className="mb-3">
                  {updateError}
                </Alert>
              )}
              
              {isEditing ? (
                <Form onSubmit={handleProfileSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tên hiển thị</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={displayName} 
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Nhập tên hiển thị"
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control 
                      type="email" 
                      value={user.email} 
                      disabled 
                      readOnly
                    />
                    <Form.Text className="text-muted">
                      Bạn không thể thay đổi email.
                    </Form.Text>
                  </Form.Group>
                  
                  <div className="d-flex gap-2">
                    <Button 
                      variant="primary" 
                      type="submit"
                      disabled={updateProfileMutation.isPending}
                    >
                      {updateProfileMutation.isPending ? (
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
                    <Button 
                      variant="secondary" 
                      onClick={() => {
                        setIsEditing(false);
                        setDisplayName(user.display_name || "");
                        setUpdateError("");
                      }}
                    >
                      Hủy
                    </Button>
                  </div>
                </Form>
              ) : (
                <Row>
                  <Col md={6}>
                    <p>
                      <strong><FaUser className="me-2" />Tên hiển thị:</strong> {user.display_name}
                    </p>
                    <p>
                      <strong><FaEnvelope className="me-2" />Email:</strong> {user.email}
                    </p>
                  </Col>
                </Row>
              )}
            </Card.Body>
          </Card>
        </Tab>
        
        <Tab eventKey="security" title="Đổi mật khẩu">
          <Card className="shadow-sm">
            <Card.Body>
              <h4 className="mb-4">Đổi mật khẩu</h4>
              
              {passwordSuccess && (
                <Alert variant="success" className="mb-3">
                  Đổi mật khẩu thành công!
                </Alert>
              )}
              
              {passwordError && (
                <Alert variant="danger" className="mb-3">
                  {passwordError}
                </Alert>
              )}
              
              <Form onSubmit={handlePasswordChange}>
                <Form.Group className="mb-3">
                  <Form.Label>Mật khẩu hiện tại</Form.Label>
                  <Form.Control 
                    type="password" 
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordInputChange}
                    placeholder="Nhập mật khẩu hiện tại"
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Mật khẩu mới</Form.Label>
                  <Form.Control 
                    type="password" 
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordInputChange}
                    placeholder="Nhập mật khẩu mới"
                  />
                  <Form.Text className="text-muted">
                    Mật khẩu phải có ít nhất 6 ký tự.
                  </Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label>Xác nhận mật khẩu mới</Form.Label>
                  <Form.Control 
                    type="password" 
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordInputChange}
                    placeholder="Nhập lại mật khẩu mới"
                  />
                </Form.Group>
                
                <Button 
                  variant="primary" 
                  type="submit"
                  disabled={changePasswordMutation.isPending}
                >
                  {changePasswordMutation.isPending ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <FaLock className="me-1" /> Đổi mật khẩu
                    </>
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default Profile;
