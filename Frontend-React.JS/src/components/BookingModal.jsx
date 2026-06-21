import React, { useState, useEffect } from 'react';
import { Modal, Button, Row, Col, Form, Spinner, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import dayjs from 'dayjs';
import api from '../services/api.js';
import useAuthStore from '../store/authStore.js';
import { Calendar, User, FileText, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

const BookingModal = ({ isOpenModal, closeBookingModal, dataTime }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { isLoggedIn, userInfo } = useAuthStore();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [genders, setGenders] = useState([]);
  
  // Book target
  const [bookFor, setBookFor] = useState('self'); // 'self' or 'relative'

  // Form states
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [reason, setReason] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState('');
  
  // Payment state
  const [paymentMethod, setPaymentMethod] = useState('OFFLINE'); // 'OFFLINE' or 'ONLINE'

  // Fetch genders
  useEffect(() => {
    const fetchGenders = async () => {
      try {
        const res = await api.get('/api/allCode?type=GENDER');
        if (res.data && res.data.errCode === 0) {
          setGenders(res.data.data || []);
        }
      } catch (err) {
        console.error('Error fetching genders:', err);
      }
    };
    fetchGenders();
  }, []);

  // Prefill if logged in and booking for self
  useEffect(() => {
    if (bookFor === 'self' && isLoggedIn && userInfo) {
      setFullName(`${userInfo.lastName || ''} ${userInfo.firstName || ''}`.trim());
      setPhoneNumber(userInfo.phoneNumber || '');
      setEmail(userInfo.email || '');
      setAddress(userInfo.address || '');
      setGender(userInfo.gender || '');
      if (userInfo.birthday) {
        // format timestamp to YYYY-MM-DD
        setBirthday(dayjs(Number(userInfo.birthday)).format('YYYY-MM-DD'));
      }
    } else if (bookFor === 'relative') {
      setFullName('');
      setPhoneNumber('');
      setEmail('');
      setAddress('');
      setBirthday('');
      setGender('');
    }
  }, [bookFor, isLoggedIn, userInfo]);

  const buildTimeBooking = (dataTime) => {
    if (!dataTime || !dataTime.timeTypeData) return '';
    const time = i18n.language === 'vi' ? dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn;
    const date = i18n.language === 'vi'
      ? dayjs(+dataTime.date).format('dddd - DD/MM/YYYY')
      : dayjs(+dataTime.date).locale('en').format('ddd - MM/DD/YYYY');
    return `${time} - ${date}`;
  };

  const buildDoctorName = (dataTime) => {
    if (!dataTime || !dataTime.doctorData) return '';
    const { firstName, lastName } = dataTime.doctorData;
    return i18n.language === 'vi' ? `${lastName} ${firstName}` : `${firstName} ${lastName}`;
  };

  const handleConfirmBooking = async (e) => {
    if (e) e.preventDefault();
    
    if (!fullName || !phoneNumber || !email || !address || !reason || !birthday || !gender) {
      toast.error('Vui lòng điền đầy đủ các thông tin bắt buộc ở Bước 2.');
      setCurrentStep(2);
      return;
    }

    const timeString = buildTimeBooking(dataTime);
    const doctorName = buildDoctorName(dataTime);
    const birthdayTimestamp = dayjs(birthday).valueOf();

    const bookingPayload = {
      fullName,
      phoneNumber,
      email,
      address,
      reason,
      date: String(dataTime.date),
      birthday: birthdayTimestamp,
      selectedGender: gender,
      doctorId: dataTime.doctorId,
      timeType: dataTime.timeType,
      language: i18n.language,
      timeString,
      doctorName,
    };

    if (paymentMethod === 'ONLINE') {
      // Close booking modal and redirect to mock payment gateway passing state
      closeBookingModal();
      navigate('/mock-payment', { 
        state: { 
          bookingPayload,
          price: dataTime.doctorData?.Doctor_Info?.priceTypeData?.valueVi || '300000'
        } 
      });
      return;
    }

    // Process Offline booking
    setLoading(true);
    try {
      const res = await api.post('/api/patient-book-appointment', bookingPayload);

      if (res.data && res.data.errCode === 0) {
        toast.success(
          i18n.language === 'vi'
            ? 'Đặt lịch hẹn thành công! Vui lòng kiểm tra email để xác nhận lịch khám.'
            : 'Booking successful! Please check your email to verify your appointment.'
        );
        
        // Reset state
        setFullName('');
        setPhoneNumber('');
        setEmail('');
        setAddress('');
        setReason('');
        setBirthday('');
        setGender('');
        setCurrentStep(1);
        closeBookingModal();
      } else {
        toast.error(res.data.errMessage || 'Đặt lịch thất bại!');
      }
    } catch (err) {
      toast.error('Có lỗi xảy ra, vui lòng thử lại sau.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const displayTime = buildTimeBooking(dataTime);
  const displayDoctor = buildDoctorName(dataTime);

  return (
    <Modal show={isOpenModal} onHide={closeBookingModal} size="lg" centered className="glass-modal">
      <Modal.Header closeButton className="border-bottom-0 pb-0">
        <Modal.Title className="fw-bold text-main-color">
          {t('patient.booking-modal.title')}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="px-4 py-3">
        {/* Stepper Progress Bar */}
        <div className="stepper-container my-3">
          <div className="stepper-progress" style={{ width: `${((currentStep - 1) / 2) * 100}%` }}></div>
          <div className={`step-item ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
            <div className="step-circle">1</div>
            <div className="step-label">Chọn lịch</div>
          </div>
          <div className={`step-item ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
            <div className="step-circle">2</div>
            <div className="step-label">Thông tin</div>
          </div>
          <div className={`step-item ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
            <div className="step-circle">3</div>
            <div className="step-label">Xác nhận</div>
          </div>
        </div>

        {/* Step 1 Content: Appointment Summary */}
        {currentStep === 1 && (
          <div className="step-content py-3">
            <h5 className="fw-bold text-dark mb-3">Tóm tắt thông tin đặt lịch</h5>
            <Card className="p-3 border-0 bg-light rounded mb-4">
              <Row className="g-3 align-items-center">
                <Col md={3} className="text-center">
                  <div
                    className="mx-auto border border-3 border-white shadow-sm"
                    style={{
                      width: '90px',
                      height: '90px',
                      borderRadius: '50%',
                      backgroundImage: `url(${dataTime.doctorData?.image || 'https://via.placeholder.com/90'})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                </Col>
                <Col md={9}>
                  <div className="fw-bold text-dark fs-5">{displayDoctor}</div>
                  <div className="text-secondary small mb-2">Bác sĩ chuyên khoa khám bệnh</div>
                  <div className="d-flex align-items-center gap-2 text-primary fw-semibold mb-1">
                    <Calendar size={16} />
                    <span>{displayTime}</span>
                  </div>
                  <div className="small text-muted">
                    Giá khám: <span className="text-danger fw-bold">{dataTime.doctorData?.Doctor_Info?.priceTypeData?.valueVi ? Number(dataTime.doctorData.Doctor_Info.priceTypeData.valueVi).toLocaleString('vi-VN') + ' VND' : '300.000 VND'}</span>
                  </div>
                </Col>
              </Row>
            </Card>
            <div className="alert alert-info border-0 rounded small mb-0">
              📌 Lịch khám đã chọn sẽ được giữ lại khi bạn điền thông tin ở các bước tiếp theo. Vui lòng bấm <strong>Tiếp tục</strong>.
            </div>
          </div>
        )}

        {/* Step 2 Content: Patient Profile Details */}
        {currentStep === 2 && (
          <Form onSubmit={(e) => { e.preventDefault(); setCurrentStep(3); }}>
            <div className="step-content py-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold text-dark m-0">Thông tin người bệnh</h5>
                <div className="d-flex gap-3">
                  <Form.Check
                    type="radio"
                    label="Đặt cho mình"
                    name="bookFor"
                    id="book-self"
                    checked={bookFor === 'self'}
                    onChange={() => setBookFor('self')}
                    className="fw-semibold text-secondary"
                  />
                  <Form.Check
                    type="radio"
                    label="Đặt cho người thân"
                    name="bookFor"
                    id="book-relative"
                    checked={bookFor === 'relative'}
                    onChange={() => setBookFor('relative')}
                    className="fw-semibold text-secondary"
                  />
                </div>
              </div>

              <Row className="g-3">
                <Col md={6}>
                  <Form.Group controlId="fullName">
                    <Form.Label className="fw-semibold small">Họ và tên bệnh nhân <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      required
                      placeholder="Nhập họ và tên đầy đủ..."
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="phoneNumber">
                    <Form.Label className="fw-semibold small">Số điện thoại liên hệ <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      required
                      placeholder="Nhập số điện thoại di động..."
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="email">
                    <Form.Label className="fw-semibold small">Địa chỉ Email nhận lịch <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="email"
                      required
                      placeholder="example@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="address">
                    <Form.Label className="fw-semibold small">Địa chỉ liên hệ thường trú <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      required
                      placeholder="Nhập địa chỉ nhà, tỉnh thành..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="birthday">
                    <Form.Label className="fw-semibold small">Ngày tháng năm sinh <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="date"
                      required
                      value={birthday}
                      onChange={(e) => setBirthday(e.target.value)}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="gender">
                    <Form.Label className="fw-semibold small">Giới tính <span className="text-danger">*</span></Form.Label>
                    <Form.Select
                      required
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <option value="">Chọn giới tính...</option>
                      {genders.map((g) => (
                        <option key={g.keyMap} value={g.keyMap}>
                          {i18n.language === 'vi' ? g.valueVi : g.valueEn}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group controlId="reason">
                    <Form.Label className="fw-semibold small">Triệu chứng lâm sàng / Lý do khám <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      required
                      placeholder="Mô tả triệu chứng bệnh, bộ phận cơ thể đau nhức..."
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>
            {/* Hidden submit to handle native required check */}
            <button id="step2-submit-btn" type="submit" className="d-none" />
          </Form>
        )}

        {/* Step 3 Content: Confirm & Payment Method */}
        {currentStep === 3 && (
          <div className="step-content py-3">
            <h5 className="fw-bold text-dark mb-3">Xác nhận thông tin phiếu khám</h5>
            <Card className="p-3 border-0 bg-light rounded mb-4">
              <Row className="g-2 small">
                <Col md={6}>
                  <div className="text-secondary">👤 Bệnh nhân: <strong className="text-dark">{fullName}</strong></div>
                  <div className="text-secondary mt-1">📞 Điện thoại: <strong className="text-dark">{phoneNumber}</strong></div>
                  <div className="text-secondary mt-1">📧 Email: <strong className="text-dark">{email}</strong></div>
                </Col>
                <Col md={6}>
                  <div className="text-secondary">👨‍⚕️ Bác sĩ: <strong className="text-dark">{displayDoctor}</strong></div>
                  <div className="text-secondary mt-1">⏰ Thời gian: <strong className="text-dark">{displayTime}</strong></div>
                  <div className="text-secondary mt-1">📝 Lý do: <strong className="text-dark">{reason}</strong></div>
                </Col>
              </Row>
            </Card>

            <h5 className="fw-bold text-dark mb-3">Lựa chọn phương thức thanh toán</h5>
            <Row className="g-3">
              <Col md={6}>
                <Card 
                  onClick={() => setPaymentMethod('OFFLINE')}
                  className={`p-3 cursor-pointer h-100 ${paymentMethod === 'OFFLINE' ? 'border-primary bg-primary bg-opacity-5' : ''}`}
                  style={{ border: '2px solid var(--border-color)', borderRadius: '12px' }}
                >
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <CheckCircle2 className={paymentMethod === 'OFFLINE' ? 'text-teal' : 'text-muted'} size={20} />
                    <strong className="text-dark">Thanh toán sau tại phòng khám</strong>
                  </div>
                  <p className="text-secondary small m-0">Trả tiền mặt hoặc quẹt thẻ trực tiếp tại quầy tiếp đón bệnh viện khi đến khám.</p>
                </Card>
              </Col>

              <Col md={6}>
                <Card 
                  onClick={() => setPaymentMethod('ONLINE')}
                  className={`p-3 cursor-pointer h-100 ${paymentMethod === 'ONLINE' ? 'border-primary bg-primary bg-opacity-5' : ''}`}
                  style={{ border: '2px solid var(--border-color)', borderRadius: '12px' }}
                >
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <CheckCircle2 className={paymentMethod === 'ONLINE' ? 'text-teal' : 'text-muted'} size={20} />
                    <strong className="text-dark">Thanh toán trực tuyến (Thẻ/QR)</strong>
                  </div>
                  <p className="text-secondary small m-0">Thanh toán ngay bằng Thẻ ATM nội địa, Thẻ tín dụng hoặc Ví điện tử qua cổng thanh toán bảo mật.</p>
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="px-4 border-top-0 pt-0">
        {/* Left Side Buttons */}
        {currentStep === 1 && (
          <Button variant="outline-secondary" onClick={closeBookingModal}>
            Hủy bỏ
          </Button>
        )}
        {currentStep > 1 && (
          <Button 
            variant="outline-secondary" 
            onClick={() => setCurrentStep(currentStep - 1)} 
            disabled={loading}
            className="d-flex align-items-center gap-1"
          >
            <ArrowLeft size={16} />
            <span>Quay lại</span>
          </Button>
        )}

        {/* Right Side Buttons */}
        {currentStep < 3 ? (
          <Button 
            variant="primary" 
            className="btn-premium-main d-flex align-items-center gap-1"
            onClick={() => {
              if (currentStep === 1) {
                setCurrentStep(2);
              } else if (currentStep === 2) {
                // Trigger form validation in step 2
                document.getElementById('step2-submit-btn').click();
              }
            }}
          >
            <span>Tiếp tục</span>
            <ArrowRight size={16} />
          </Button>
        ) : (
          <Button 
            variant="primary" 
            onClick={() => handleConfirmBooking()} 
            className="btn-premium-main d-flex align-items-center gap-2" 
            disabled={loading}
          >
            {loading && <Spinner size="sm" animation="border" />}
            <span>{paymentMethod === 'ONLINE' ? 'Thanh toán & Đặt lịch' : 'Xác nhận & Đặt lịch'}</span>
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default BookingModal;
