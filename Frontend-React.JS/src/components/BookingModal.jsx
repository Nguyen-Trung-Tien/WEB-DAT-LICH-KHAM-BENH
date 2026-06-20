import React, { useState, useEffect } from 'react';
import { Modal, Button, Row, Col, Form, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import dayjs from 'dayjs';
import api from '../services/api.js';

const BookingModal = ({ isOpenModal, closeBookingModal, dataTime }) => {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [genders, setGenders] = useState([]);
  
  // Form states
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [reason, setReason] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState('');

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
    e.preventDefault();
    if (!fullName || !phoneNumber || !email || !address || !reason || !birthday || !gender) {
      toast.error('Vui lòng điền đầy đủ các thông tin bắt buộc.');
      return;
    }

    setLoading(true);
    try {
      const timeString = buildTimeBooking(dataTime);
      const doctorName = buildDoctorName(dataTime);
      const birthdayTimestamp = dayjs(birthday).valueOf();

      const res = await api.post('/api/patient-book-appointment', {
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
      });

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
    <Modal show={isOpenModal} onHide={closeBookingModal} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold text-main-color">
          {t('patient.booking-modal.title')}
        </Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleConfirmBooking}>
        <Modal.Body className="px-4 py-3">
          {/* Summary Banner */}
          <div className="bg-light p-3 rounded mb-4 border d-flex flex-column gap-1">
            <div className="d-flex align-items-center gap-1 text-secondary">
              <strong>👨‍⚕️ Bác sĩ:</strong>
              <span>{displayDoctor}</span>
            </div>
            <div className="d-flex align-items-center gap-1 text-secondary mt-1">
              <strong>⏰ Thời gian:</strong>
              <span>{displayTime}</span>
            </div>
          </div>

          <Row className="g-3">
            <Col md={6}>
              <Form.Group controlId="fullName">
                <Form.Label className="fw-semibold small">{t('patient.booking-modal.fullName')} <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  required
                  placeholder="Nhập họ và tên..."
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="phoneNumber">
                <Form.Label className="fw-semibold small">{t('patient.booking-modal.phoneNumber')} <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  required
                  placeholder="Nhập số điện thoại..."
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="email">
                <Form.Label className="fw-semibold small">{t('patient.booking-modal.email')} <span className="text-danger">*</span></Form.Label>
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
                <Form.Label className="fw-semibold small">{t('patient.booking-modal.address')} <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  required
                  placeholder="Nhập địa chỉ của bạn..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group controlId="reason">
                <Form.Label className="fw-semibold small">{t('patient.booking-modal.reason')} <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  required
                  placeholder="Lý do khám bệnh, triệu chứng..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="birthday">
                <Form.Label className="fw-semibold small">{t('patient.booking-modal.birthday')} <span className="text-danger">*</span></Form.Label>
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
                <Form.Label className="fw-semibold small">{t('patient.booking-modal.gender')} <span className="text-danger">*</span></Form.Label>
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
          </Row>
        </Modal.Body>

        <Modal.Footer className="px-4">
          <Button variant="outline-secondary" onClick={closeBookingModal} disabled={loading}>
            {t('patient.booking-modal.btn-cancel')}
          </Button>
          <Button variant="primary" type="submit" className="btn-premium-main d-flex align-items-center gap-2" disabled={loading}>
            {loading && <Spinner size="sm" animation="border" />}
            <span>{t('patient.booking-modal.btn-confirm')}</span>
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default BookingModal;
