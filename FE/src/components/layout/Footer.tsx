// components/layout/Footer.tsx
import { Link } from "react-router-dom";
import { FaFacebookSquare, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white mt-5 py-4">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-3 mb-md-0">
            <h5 className="mb-3">English Learning</h5>
            <p className="mb-0">
              Nền tảng học tập trực tuyến giúp bạn nâng cao kỹ năng và kiến thức tiếng Anh một cách hiệu quả.
            </p>
          </div>
          
          <div className="col-md-4 mb-3 mb-md-0">
            <h5 className="mb-3">Liên kết nhanh</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-white text-decoration-none">Trang chủ</Link>
              </li>
              <li className="mb-2">
                <Link to="/about" className="text-white text-decoration-none">Về chúng tôi</Link>
              </li>
              <li className="mb-2">
                <Link to="/courses" className="text-white text-decoration-none">Khóa học</Link>
              </li>
              <li>
                <Link to="/profile" className="text-white text-decoration-none">Tài khoản</Link>
              </li>
            </ul>
          </div>
          
          <div className="col-md-4">
            <h5 className="mb-3">Liên hệ</h5>
            <address className="mb-0">
              <p><FaEnvelope className="me-2" /> Email: huylg543@gmail.com</p>
              <p><FaPhone className="me-2" /> Điện thoại: 0984 588 603</p>
              <p><FaMapMarkerAlt className="me-2" /> Địa chỉ: 182 Lương Thế Vinh, Quận Thanh Xuân, Hà Nội</p>
              <p>
                <a href="https://web.facebook.com/juanhuynhe" target="_blank" rel="noopener noreferrer" className="text-white">
                  <FaFacebookSquare className="me-2" /> Facebook
                </a>
              </p>
            </address>
          </div>
        </div>
        
        <hr className="my-4" />
        
        <div className="text-center">
          <p className="mb-0">© {currentYear} English Learning. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
