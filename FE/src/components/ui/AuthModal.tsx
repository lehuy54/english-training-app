// components/ui/AuthModal.tsx
import { Modal, Tab, Tabs, Form, Button, Alert, InputGroup } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useLogin, useRegister } from "../../hooks/useAuth";
import { FaUser, FaEnvelope, FaLock, FaSignInAlt, FaUserPlus } from "react-icons/fa";

interface Props {
  show: boolean;
  onHide: () => void;
  mode?: "login" | "register";
}

const AuthModal = ({ show, onHide, mode = "login" }: Props) => {
  const [tabKey, setTabKey] = useState<"login" | "register">(mode);
  
  // Cập nhật tab khi mode thay đổi
  useEffect(() => {
    if (mode) {
      setTabKey(mode);
    }
  }, [mode]);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({ email: "", password: "", display_name: "" });

  const loginMutation = useLogin(onHide);
  const registerMutation = useRegister(onHide);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginData);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(registerData);
  };

  return (
    <Modal show={show} onHide={onHide} centered className="auth-modal">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="w-100 text-center">
          {tabKey === "login" ? "Welcome Back" : "Create Account"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-2 pb-4 px-4">
        <Tabs 
          activeKey={tabKey} 
          onSelect={(k) => setTabKey(k as "login" | "register")} 
          className="mb-4 nav-fill">
          <Tab eventKey="login" title={<span><FaSignInAlt className="me-2" />Login</span>}>
            {loginMutation.error && (
              <Alert variant="danger" className="mb-3">
                Login failed. Please check your email and password.
              </Alert>
            )}
            <Form onSubmit={handleLoginSubmit}>
              <Form.Group className="mb-3">
                <InputGroup>
                  <InputGroup.Text><FaEnvelope /></InputGroup.Text>
                  <Form.Control 
                    type="email" 
                    name="email" 
                    placeholder="Email" 
                    value={loginData.email}
                    onChange={handleLoginChange}
                    required 
                  />
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-4">
                <InputGroup>
                  <InputGroup.Text><FaLock /></InputGroup.Text>
                  <Form.Control 
                    type="password" 
                    name="password" 
                    placeholder="Password" 
                    value={loginData.password}
                    onChange={handleLoginChange}
                    required 
                  />
                </InputGroup>
              </Form.Group>

              <Button 
                variant="primary" 
                type="submit" 
                className="w-100 py-2" 
                disabled={loginMutation.isPending}>
                {loginMutation.isPending ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Logging in...
                  </>
                ) : "Login"}
              </Button>
            </Form>
          </Tab>
          
          <Tab eventKey="register" title={<span><FaUserPlus className="me-2" />Register</span>}>
            {registerMutation.error && (
              <Alert variant="danger" className="mb-3">
                Registration failed. This email may already be in use.
              </Alert>
            )}
            <Form onSubmit={handleRegisterSubmit}>
              <Form.Group className="mb-3">
                <InputGroup>
                  <InputGroup.Text><FaUser /></InputGroup.Text>
                  <Form.Control 
                    type="text" 
                    name="display_name" 
                    placeholder="Full Name" 
                    value={registerData.display_name}
                    onChange={handleRegisterChange}
                    required 
                  />
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-3">
                <InputGroup>
                  <InputGroup.Text><FaEnvelope /></InputGroup.Text>
                  <Form.Control 
                    type="email" 
                    name="email" 
                    placeholder="Email" 
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    required 
                  />
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-4">
                <InputGroup>
                  <InputGroup.Text><FaLock /></InputGroup.Text>
                  <Form.Control 
                    type="password" 
                    name="password" 
                    placeholder="Password" 
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    required 
                  />
                </InputGroup>
              </Form.Group>

              <Button 
                variant="success" 
                type="submit" 
                className="w-100 py-2" 
                disabled={registerMutation.isPending}>
                {registerMutation.isPending ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creating Account...
                  </>
                ) : "Register"}
              </Button>
            </Form>
          </Tab>
        </Tabs>
        
        <div className="text-center mt-3 text-muted small">
          <p>{tabKey === "login" ? "Don't have an account yet? Use the register tab." : "Already have an account? Use the login tab."}</p>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default AuthModal;
