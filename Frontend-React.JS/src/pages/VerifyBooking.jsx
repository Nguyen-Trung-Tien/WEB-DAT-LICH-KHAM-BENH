import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Container, Card, Button, Spinner } from 'react-bootstrap';
import { CheckCircle, XCircle, CalendarDays } from 'lucide-react';
import api from '../services/api.js';

const VerifyBooking = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const doctorId = searchParams.get('doctorId');
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyBooking = async () => {
      if (!token || !doctorId) {
        setStatus('error');
        setMessage('Thông tin xác nhận lịch hẹn không hợp lệ hoặc thiếu tham số!');
        return;
      }

      try {
        const res = await api.post('/api/verify-book-appointment', {
          token,
          doctorId,
        });

        if (res.data && res.data.errCode === 0) {
          setStatus('success');
        } else {
          setStatus('error');
          setMessage(res.data.errMessage || 'Xác nhận lịch hẹn thất bại!');
        }
      } catch (err) {
        console.error('Error verifying appointment:', err);
        setStatus('error');
        setMessage('Có lỗi kết nối hệ thống xảy ra, vui lòng thử lại sau.');
      }
    };

    verifyBooking();
  }, [token, doctorId]);

  return (
    <Container className="py-5 d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
      <Card className="border shadow-sm p-4 text-center glass-card max-width-600 w-100">
        <Card.Body className="py-4">
          
          {status === 'verifying' && (
            <div className="d-flex flex-column align-items-center gap-3">
              <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
              <h4 className="fw-bold text-dark mt-2">Đang xác nhận lịch khám của bạn</h4>
              <p className="text-secondary small">Vui lòng đợi trong khi chúng tôi ghi nhận thông tin lịch khám y tế...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="d-flex flex-column align-items-center gap-3">
              <CheckCircle size={64} className="text-success animate-bounce" />
              <h4 className="fw-bold text-success mt-2">Xác nhận lịch khám thành công!</h4>
              <p className="text-secondary">
                Lịch hẹn của bạn đã được ghi nhận trên hệ thống BookingCare. Bác sĩ sẽ liên hệ khám theo đúng thời gian bạn đã chọn.
              </p>
              <div className="mt-3">
                <Button as={Link} to="/" variant="primary" className="btn-premium-main d-flex align-items-center gap-2">
                  <CalendarDays size={18} />
                  <span>Quay lại Trang chủ</span>
                </Button>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="d-flex flex-column align-items-center gap-3">
              <XCircle size={64} className="text-danger" />
              <h4 className="fw-bold text-danger mt-2">Xác nhận lịch khám thất bại!</h4>
              <p className="text-secondary small">{message}</p>
              <div className="mt-3">
                <Button as={Link} to="/" variant="outline-primary" className="px-4">
                  Trở về trang chủ
                </Button>
              </div>
            </div>
          )}

        </Card.Body>
      </Card>
    </Container>
  );
};

export default VerifyBooking;
