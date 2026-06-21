import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Spinner, Table } from 'react-bootstrap';
import { CreditCard, QrCode, Building, Lock, ShieldCheck, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import api from '../services/api.js';

const MockPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve state passed from BookingModal
  const { bookingPayload, price = '300000' } = location.state || {};

  const [method, setMethod] = useState('card'); // 'card', 'qr', 'banking'
  const [processing, setProcessing] = useState(false);

  // Card Form fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  if (!bookingPayload) {
    return (
      <Container className="py-5 text-center">
        <h4 className="text-danger">Không tìm thấy thông tin hóa đơn thanh toán!</h4>
        <Button variant="primary" className="mt-3 btn-premium-main" onClick={() => navigate('/')}>
          Quay lại trang chủ
        </Button>
      </Container>
    );
  }

  const formatCurrency = (val) => {
    return Number(val).toLocaleString('vi-VN') + ' VND';
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (method === 'card') {
      if (!cardNumber || !cardHolder || !cardExpiry || !cardCvv) {
        toast.error('Vui lòng điền đầy đủ thông tin thẻ tín dụng.');
        return;
      }
    }

    setProcessing(true);

    // Simulate network delay for payment verification
    setTimeout(async () => {
      try {
        // Send the actual booking payload to backend
        const res = await api.post('/api/patient-book-appointment', bookingPayload);

        if (res.data && res.data.errCode === 0) {
          toast.success('Thanh toán và đăng ký khám thành công!');
          // Redirect to payment success page
          navigate('/payment-success', {
            state: {
              bookingDetails: bookingPayload,
              price: price,
              transactionId: 'BC' + Math.floor(10000000 + Math.random() * 90000000),
            }
          });
        } else {
          setProcessing(false);
          toast.error(res.data.errMessage || 'Đăng ký lịch khám thất bại sau thanh toán.');
        }
      } catch (err) {
        setProcessing(false);
        console.error(err);
        toast.error('Giao dịch thanh toán thất bại do lỗi kết nối.');
      }
    }, 3000);
  };

  return (
    <div className="bg-light py-5 min-vh-100 d-flex align-items-center">
      {processing ? (
        <Container className="text-center">
          <div className="p-5 glass-card shadow-lg bg-white mx-auto" style={{ maxWidth: '500px', borderRadius: '16px' }}>
            <Spinner animation="border" variant="teal" style={{ width: '4rem', height: '4rem' }} className="text-teal mb-4" />
            <h4 className="fw-bold text-dark">Đang xử lý giao dịch bảo mật...</h4>
            <p className="text-secondary small mt-2">Vui lòng không tắt trình duyệt hoặc nhấn nút quay lại để tránh trùng lặp giao dịch.</p>
            <div className="d-flex justify-content-center align-items-center gap-2 mt-4 text-success small">
              <ShieldCheck size={18} />
              <span>PCI-DSS Secured Transaction</span>
            </div>
          </div>
        </Container>
      ) : (
        <Container>
          <div className="mb-4">
            <Button variant="link" className="text-secondary text-decoration-none d-flex align-items-center gap-1 p-0" onClick={() => navigate(-1)}>
              <ArrowLeft size={16} />
              <span>Quay lại trang chi tiết bác sĩ</span>
            </Button>
          </div>

          <Row className="gy-4">
            {/* Left Column: Payment Methods Choice */}
            <Col lg={7}>
              <Card className="border-0 shadow-sm p-4 bg-white" style={{ borderRadius: '16px' }}>
                <h4 className="fw-bold text-dark mb-4">Cổng thanh toán trực tuyến BookingCare</h4>

                {/* Methods Tabs widgets */}
                <Row className="g-3 mb-4">
                  <Col xs={4}>
                    <div 
                      onClick={() => setMethod('card')}
                      className={`p-3 text-center cursor-pointer border rounded ${method === 'card' ? 'border-primary bg-primary bg-opacity-5' : ''}`}
                      style={{ borderRadius: '12px', border: '1.5px solid var(--border-color)' }}
                    >
                      <CreditCard className="mb-2 text-teal" size={24} />
                      <div className="small fw-bold">Thẻ Quốc Tế</div>
                    </div>
                  </Col>

                  <Col xs={4}>
                    <div 
                      onClick={() => setMethod('qr')}
                      className={`p-3 text-center cursor-pointer border rounded ${method === 'qr' ? 'border-primary bg-primary bg-opacity-5' : ''}`}
                      style={{ borderRadius: '12px', border: '1.5px solid var(--border-color)' }}
                    >
                      <QrCode className="mb-2 text-info" size={24} />
                      <div className="small fw-bold">Quét Mã QR</div>
                    </div>
                  </Col>

                  <Col xs={4}>
                    <div 
                      onClick={() => setMethod('banking')}
                      className={`p-3 text-center cursor-pointer border rounded ${method === 'banking' ? 'border-primary bg-primary bg-opacity-5' : ''}`}
                      style={{ borderRadius: '12px', border: '1.5px solid var(--border-color)' }}
                    >
                      <Building className="mb-2 text-danger" size={24} />
                      <div className="small fw-bold">Thẻ Nội Địa</div>
                    </div>
                  </Col>
                </Row>

                {/* Card Form */}
                {method === 'card' && (
                  <Form onSubmit={handlePaymentSubmit}>
                    <Row className="g-3">
                      <Col md={12}>
                        <Form.Group controlId="card-number">
                          <Form.Label className="small fw-semibold">Số thẻ tín dụng / Ghi nợ</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="4111 2222 3333 4444"
                            maxLength={19}
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                            required
                          />
                        </Form.Group>
                      </Col>

                      <Col md={12}>
                        <Form.Group controlId="card-holder">
                          <Form.Label className="small fw-semibold">Tên chủ thẻ (Viết hoa không dấu)</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="NGUYEN VAN A"
                            value={cardHolder}
                            onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                            required
                          />
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group controlId="card-expiry">
                          <Form.Label className="small fw-semibold">Hạn hết hạn (MM/YY)</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="12/29"
                            maxLength={5}
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            required
                          />
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group controlId="card-cvv">
                          <Form.Label className="small fw-semibold">Mã bảo mật (CVV/CVC)</Form.Label>
                          <Form.Control
                            type="password"
                            placeholder="***"
                            maxLength={3}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            required
                          />
                        </Form.Group>
                      </Col>

                      <Col md={12} className="mt-4">
                        <Button type="submit" variant="primary" className="w-100 btn-premium-main py-2.5">
                          Thanh toán an toàn {formatCurrency(price)}
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                )}

                {/* QR Scanner simulator */}
                {method === 'qr' && (
                  <div className="text-center py-4">
                    <h6 className="fw-bold mb-3">Mở ứng dụng Ngân hàng di động hoặc Ví MoMo để quét mã thanh toán</h6>
                    <div className="bg-light p-3 rounded d-inline-block border mb-3">
                      {/* Generates a clean mock QR Code image */}
                      <img 
                        src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=BookingCarePaymentSimulation" 
                        alt="QR Code Pay" 
                        style={{ width: '180px', height: '180px' }}
                      />
                    </div>
                    <p className="text-secondary small mb-4">Nội dung chuyển khoản: <strong className="text-dark">THANH TOAN LICH KHAM BC</strong></p>
                    <Button onClick={handlePaymentSubmit} variant="primary" className="btn-premium-main px-5 py-2.5 w-100">
                      Xác nhận đã quét mã và thanh toán thành công
                    </Button>
                  </div>
                )}

                {/* Domestic online banking simulator */}
                {method === 'banking' && (
                  <div>
                    <h6 className="fw-bold mb-3">Chọn ngân hàng nội địa thanh toán qua cổng Napas</h6>
                    <Row className="g-2 row-cols-3 mb-4">
                      {['Vietcombank', 'Techcombank', 'BIDV', 'VietinBank', 'ACB', 'MBBank'].map((bank) => (
                        <Col key={bank}>
                          <Card 
                            onClick={handlePaymentSubmit}
                            className="p-3 text-center cursor-pointer border hover-glow"
                            style={{ borderRadius: '10px' }}
                          >
                            <span className="small fw-bold text-secondary">{bank}</span>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                    <p className="text-muted small text-center italic">Bấm chọn logo ngân hàng của bạn để chuyển sang màn hình xác thực OTP giả lập.</p>
                  </div>
                )}
              </Card>
            </Col>

            {/* Right Column: Invoice Summary Card */}
            <Col lg={5}>
              <Card className="border-0 shadow-sm p-4 bg-white" style={{ borderRadius: '16px' }}>
                <h5 className="fw-bold text-dark mb-3">Tóm tắt đơn hàng</h5>
                <Table responsive borderless className="mb-0 small align-middle">
                  <tbody>
                    <tr className="border-bottom">
                      <td className="text-secondary py-2">👨‍⚕️ Bác sĩ điều trị</td>
                      <td className="text-dark fw-bold text-end py-2">{bookingPayload.doctorName}</td>
                    </tr>
                    <tr className="border-bottom">
                      <td className="text-secondary py-2">⏰ Lịch khám bệnh</td>
                      <td className="text-dark fw-bold text-end py-2">{bookingPayload.timeString}</td>
                    </tr>
                    <tr className="border-bottom">
                      <td className="text-secondary py-2">👤 Tên bệnh nhân</td>
                      <td className="text-dark fw-bold text-end py-2">{bookingPayload.fullName}</td>
                    </tr>
                    <tr className="border-bottom">
                      <td className="text-secondary py-2">📞 Điện thoại</td>
                      <td className="text-dark fw-bold text-end py-2">{bookingPayload.phoneNumber}</td>
                    </tr>
                    <tr className="border-bottom">
                      <td className="text-secondary py-2">🛡️ Dịch vụ bảo mật</td>
                      <td className="text-success text-end py-2 fw-semibold">Miễn phí</td>
                    </tr>
                    <tr className="fs-5">
                      <td className="text-dark fw-bold pt-3">Tổng cộng</td>
                      <td className="text-danger fw-extrabold text-end pt-3">{formatCurrency(price)}</td>
                    </tr>
                  </tbody>
                </Table>
                
                <div className="d-flex align-items-center gap-2 mt-4 text-secondary small bg-light p-2.5 rounded justify-content-center">
                  <Lock size={14} className="text-success" />
                  <span>Dữ liệu thanh toán được mã hóa 256-bit SSL</span>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      )}
    </div>
  );
};

export default MockPayment;
