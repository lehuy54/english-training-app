// components/layout/Header.tsx
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store";
import { Link, useNavigate } from "react-router-dom";
import { Dropdown, Navbar, Nav, Container } from "react-bootstrap";
import { logout } from "../../store/slices/authSlice";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useGlobalAuthModal } from "./MainLayout";
import { useState } from "react";
import { FaBars } from "react-icons/fa";
import LogoImage from "../../assets/images/English-Learning.svg";

const Header = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const { openLoginModal } = useGlobalAuthModal();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  
  const handleLogout = () => {
    dispatch(logout());
    // Navigate to home page and then reload the page
    navigate('/');
    // Use setTimeout to ensure navigation completes before reload
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const closeNavbar = () => setExpanded(false);

  return (
    <Navbar 
      expanded={expanded} 
      onToggle={setExpanded} 
      expand="md" 
      fixed="top" 
      bg="white" 
      className="shadow-sm py-2"
    >
      <Container fluid className="px-md-4">
        {/* Left section - Logo */}
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img 
            src={LogoImage} 
            alt="English Learning" 
            height="40" 
            className="d-inline-block align-top"
          />
        </Navbar.Brand>

        {/* Toggle button for mobile */}
        <Navbar.Toggle 
          aria-controls="main-navbar-nav" 
          className="border-0"
        >
          <FaBars />
        </Navbar.Toggle>

        <Navbar.Collapse id="main-navbar-nav">
          {/* Navigation links - always centered */}
          <Nav className="mx-auto text-center d-flex align-items-center">
            <Nav.Link as={Link} to="/" onClick={closeNavbar} className="fw-medium">Trang chủ</Nav.Link>
            <div className="nav-divider d-none d-md-block">|</div>
            <Nav.Link as={Link} to="/topics" onClick={closeNavbar} className="fw-medium">Từ vựng</Nav.Link>
            <div className="nav-divider d-none d-md-block">|</div>
            <Nav.Link as={Link} to="/grammar-lessons" onClick={closeNavbar} className="fw-medium">Ngữ pháp</Nav.Link>
            <div className="nav-divider d-none d-md-block">|</div>
            <Nav.Link as={Link} to="/courses" onClick={closeNavbar} className="fw-medium">Khóa học</Nav.Link>
            <div className="nav-divider d-none d-md-block">|</div>
            <Nav.Link as={Link} to="/about" onClick={closeNavbar} className="fw-medium">Giới thiệu</Nav.Link>
          </Nav>
          
          {/* Right section - Auth */}
          <Nav className="ms-md-auto">
            {user ? (
              <Dropdown align="end">
                <Dropdown.Toggle variant="outline-primary" id="user-dropdown">
                  Hello, {user.display_name}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/profile" onClick={closeNavbar}>
                    Hồ sơ cá nhân
                  </Dropdown.Item>
                  
                  <Dropdown.Item as={Link} to="/quiz-history" onClick={closeNavbar}>
                    Lịch sử làm bài
                  </Dropdown.Item>
                  
                  {/* Admin-only menu items */}
                  {user.role === 'admin' && (
                    <>
                      <Dropdown.Item as={Link} to="/admin/users" onClick={closeNavbar}>
                        Quản lí người dùng
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to="/admin/content" onClick={closeNavbar}>
                        Quản lí nội dung
                      </Dropdown.Item>
                    </>
                  )}
                  
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>
                    Đăng xuất
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <button className="btn btn-primary" onClick={openLoginModal}>Login</button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
