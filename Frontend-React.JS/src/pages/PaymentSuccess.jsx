import React, { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Table, Row, Col } from 'react-bootstrap';
import { CheckCircle2, Home, Printer, Calendar } from 'lucide-react';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const printAreaRef = useRef(null);

  // Retrieve state passed from MockPayment
  const { bookingDetails, price = '300000', transactionId = 'BC00000000' } = location.state || {};

  if (!bookingDetails) {
    return (
      <Container className="py-5 text-center">
        <h4 className="text-danger">Không tìm thấy thông tin xác nhận đặt lịch!</h4>
        <Button variant="primary" className="mt-3 btn-premium-main" onClick={() => navigate('/')}>
          Quay lại trang chủ
        </Button>
      </Container>
    );
  }

  const formatCurrency = (val) => {
    return Number(val).toLocaleString('vi-VN') + ' VND';
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <Container className="py-5 d-flex flex-column align-items-center min-vh-100 justify-content-center">
      <div className="text-center mb-4">
        <CheckCircle2 size={72} className="text-success mb-3 animate-bounce" />
        <h2 className="fw-bold text-dark">Đặt lịch khám bệnh thành công!</h2>
        <p className="text-secondary">Một email hướng dẫn xác nhận chi tiết đã được gửi đến <strong className="text-dark">{bookingDetails.email}</strong>. Vui lòng kiểm tra hộp thư.</p>
      </div>

      {/* Printable Receipt Card */}
      <Card ref={printAreaRef} className="border-0 shadow-sm p-4 bg-white mb-4 w-100" style={{ maxWidth: '650px', borderRadius: '16px' }}>
        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
          <div>
            <h4 className="fw-extrabold text-teal m-0">BookingCare</h4>
            <span className="text-muted small">Phiếu đăng ký khám bệnh điện tử</span>
          </div>
          <div className="text-end">
            <div className="text-dark fw-bold small">Mã hóa đơn</div>
            <div className="text-teal fw-bold fs-6">{transactionId}</div>
          </div>
        </div>

        <h5 className="fw-bold text-dark mb-3">Thông tin chi tiết lịch khám</h5>
        <Table responsive borderless className="small mb-4 align-middle">
          <tbody>
            <tr className="border-bottom">
              <td className="text-secondary py-2">👨‍⚕️ Bác sĩ khám</td>
              <td className="text-dark fw-bold text-end py-2">{bookingDetails.doctorName}</td>
            </tr>
            <tr className="border-bottom">
              <td className="text-secondary py-2">⏰ Thời gian hẹn</td>
              <td className="text-dark fw-bold text-end py-2">{bookingDetails.timeString}</td>
            </tr>
            <tr className="border-bottom">
              <td className="text-secondary py-2">👤 Họ tên bệnh nhân</td>
              <td className="text-dark fw-bold text-end py-2">{bookingDetails.fullName}</td>
            </tr>
            <tr className="border-bottom">
              <td className="text-secondary py-2">📞 Điện thoại liên lạc</td>
              <td className="text-dark fw-bold text-end py-2">{bookingDetails.phoneNumber}</td>
            </tr>
            <tr className="border-bottom">
              <td className="text-secondary py-2">🏠 Địa chỉ</td>
              <td className="text-dark fw-bold text-end py-2">{bookingDetails.address}</td>
            </tr>
            <tr className="border-bottom">
              <td className="text-secondary py-2">📝 Lý do khám</td>
              <td className="text-dark fw-bold text-end py-2">{bookingDetails.reason}</td>
            </tr>
            <tr className="fs-5">
              <td className="text-dark fw-bold pt-3">Số tiền đã trả</td>
              <td className="text-danger fw-extrabold text-end pt-3">{formatCurrency(price)}</td>
            </tr>
          </tbody>
        </Table>

        <div className="bg-light p-3 rounded text-center small text-secondary">
          ⚠️ <strong>Lưu ý quan trọng:</strong> Vui lòng có mặt tại phòng khám trước giờ hẹn 10 - 15 phút, xuất trình mã hóa đơn này hoặc thông tin số điện thoại tại quầy lễ tân để làm thủ tục check-in khám bệnh.
        </div>
      </Card>

      {/* Buttons */}
      <div className="d-flex gap-3 justify-content-center w-100" style={{ maxWidth: '650px' }}>
        <Button variant="outline-primary" onClick={handlePrintReceipt} className="flex-grow-1 py-2.5 d-flex align-items-center justify-content-center gap-2 border-teal text-teal">
          <Printer size={18} />
          <span>In phiếu khám</span>
        </Button>
        <Button variant="primary" onClick={() => navigate('/')} className="btn-premium-main flex-grow-1 py-2.5 d-flex align-items-center justify-content-center gap-2">
          <Home size={18} />
          <span>Quay lại trang chủ</span>
        </Button>
      </div>
    </Container>
  );
};

export default PaymentSuccess;
