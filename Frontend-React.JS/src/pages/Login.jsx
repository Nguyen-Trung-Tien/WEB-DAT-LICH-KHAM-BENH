import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { HeartPulse, Key, Mail } from 'lucide-react';
import useAuthStore from '../store/authStore.js';
import { toast } from 'sonner';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoggedIn, userInfo, error: authError, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn && userInfo) {
      if (userInfo.roleId === 'R1' || userInfo.roleId === 'R2') {
        navigate('/system');
      } else {
        navigate('/');
      }
    }
  }, [isLoggedIn, userInfo, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (!email || !password) {
      setLocalError('Vui lòng điền đầy đủ email và mật khẩu.');
      return;
    }

    const result = await login(email, password);
    if (result.success) {
      toast.success('Đăng nhập thành công!');
    } else {
      toast.error(result.message || 'Đăng nhập thất bại.');
    }
  };

  return (
    <Container className="py-5 d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <Card className="border shadow-sm p-4 w-100 max-width-450 glass-card">
        <Card.Body>
          {/* Logo / Header */}
          <div className="text-center mb-4">
            <Link to="/" className="d-inline-flex align-items-center gap-2 fw-bold text-main-color text-decoration-none">
              <HeartPulse size={32} className="text-danger animate-pulse" />
              <span className="fs-3">BookingCare</span>
            </Link>
            <h5 className="text-secondary mt-2 fw-semibold">Đăng nhập cổng quản trị</h5>
          </div>

          {(localError || authError) && (
            <Alert variant="danger" className="py-2 small">
              {localError || authError}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="login-email">
              <Form.Label className="small fw-semibold">Email quản trị</Form.Label>
              <div className="position-relative">
                <Form.Control
                  type="email"
                  required
                  placeholder="admin@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="ps-4"
                />
                <Mail size={16} className="text-secondary position-absolute top-50 translate-middle-y ms-2" />
              </div>
            </Form.Group>

            <Form.Group className="mb-4" controlId="login-password">
              <Form.Label className="small fw-semibold">Mật khẩu</Form.Label>
              <div className="position-relative">
                <Form.Control
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="ps-4"
                />
                <Key size={16} className="text-secondary position-absolute top-50 translate-middle-y ms-2" />
              </div>
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 py-2 btn-premium-main d-flex align-items-center justify-content-center gap-2" disabled={isLoading}>
              {isLoading && <Spinner size="sm" animation="border" />}
              <span>Đăng nhập</span>
            </Button>
          </Form>

          <div className="text-center mt-3 small text-secondary">
            <span>Quay lại </span>
            <Link to="/" className="text-primary text-decoration-none fw-semibold">Trang chủ đặt lịch</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;
