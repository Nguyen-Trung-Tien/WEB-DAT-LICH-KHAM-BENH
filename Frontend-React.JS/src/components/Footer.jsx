import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { HeartPulse, Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-5 mt-5">
      <Container>
        <Row className="gy-4">
          <Col lg={4} md={6}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <HeartPulse size={28} className="text-danger" />
              <h4 className="m-0 fw-bold text-white">BookingCare</h4>
            </div>
            <p className="text-secondary small">
              Nền tảng y tế chăm sóc sức khỏe toàn diện hàng đầu Việt Nam. Kết nối người bệnh với bác sĩ chuyên khoa giỏi và cơ sở y tế uy tín một cách nhanh chóng, tin cậy.
            </p>
            <div className="d-flex flex-column gap-2 small text-secondary">
              <span className="d-flex align-items-center gap-2">
                <MapPin size={16} className="text-secondary" />
                <span>Quận Hoàn Kiếm, Hà Nội, Việt Nam</span>
              </span>
              <span className="d-flex align-items-center gap-2">
                <Phone size={16} className="text-secondary" />
                <span>Hotline: 1900-1544</span>
              </span>
              <span className="d-flex align-items-center gap-2">
                <Mail size={16} className="text-secondary" />
                <span>support@bookingcare.vn</span>
              </span>
            </div>
          </Col>

          <Col lg={3} md={6}>
            <h5 className="text-white fw-bold mb-3">Liên kết nhanh</h5>
            <ul className="list-unstyled d-flex flex-column gap-2 small text-secondary">
              <li><Link to="/" className="text-secondary text-decoration-none hover-glow">Chuyên khoa nổi bật</Link></li>
              <li><Link to="/" className="text-secondary text-decoration-none hover-glow">Phòng khám cơ sở</Link></li>
              <li><Link to="/" className="text-secondary text-decoration-none hover-glow">Bác sĩ hàng đầu</Link></li>
              <li><Link to="/" className="text-secondary text-decoration-none hover-glow">Cẩm nang sức khỏe</Link></li>
            </ul>
          </Col>

          <Col lg={2} md={6}>
            <h5 className="text-white fw-bold mb-3">Đối tác</h5>
            <ul className="list-unstyled d-flex flex-column gap-2 small text-secondary">
              <li>Bệnh viện Hữu nghị Việt Đức</li>
              <li>Bệnh viện Bạch Mai</li>
              <li>Bệnh viện Ung bướu Hưng Việt</li>
              <li>Phòng khám đa khoa y khoa</li>
            </ul>
          </Col>

          <Col lg={3} md={6}>
            <h5 className="text-white fw-bold mb-3">Tải ứng dụng</h5>
            <p className="text-secondary small">
              Tải ứng dụng BookingCare trên các hệ điều hành iOS và Android để đặt lịch khám nhanh chóng và tiện lợi.
            </p>
            <div className="d-flex gap-2">
              <div className="bg-secondary p-2 rounded text-center text-white small cursor-pointer flex-grow-1">App Store</div>
              <div className="bg-secondary p-2 rounded text-center text-white small cursor-pointer flex-grow-1">Google Play</div>
            </div>
          </Col>
        </Row>

        <hr className="border-secondary my-4" />

        <Row className="align-items-center justify-content-between text-secondary small">
          <Col md={6} className="text-center text-md-start">
            &copy; {new Date().getFullYear()} BookingCare. Phát triển bởi Nguyễn Trung Tiến. All Rights Reserved.
          </Col>
          <Col md={6} className="text-center text-md-end mt-2 mt-md-0">
            <span className="me-3">Điều khoản sử dụng</span>
            <span>Chính sách bảo mật</span>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
