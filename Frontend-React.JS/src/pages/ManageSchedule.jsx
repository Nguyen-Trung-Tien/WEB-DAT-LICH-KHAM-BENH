import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { CalendarRange, Save } from 'lucide-react';
import { toast } from 'sonner';
import dayjs from 'dayjs';
import api from '../services/api.js';
import useAuthStore from '../store/authStore.js';

const ManageSchedule = () => {
  const { t, i18n } = useTranslation();
  const { userInfo } = useAuthStore();
  const isAdmin = userInfo?.roleId === 'R1';

  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [saving, setSaving] = useState(false);

  // Fetch doctors (only if Admin)
  const { data: doctors = [] } = useQuery({
    queryKey: ['allDoctorsSchedule'],
    queryFn: async () => {
      const res = await api.get('/api/get-all-doctors');
      return res.data.data || [];
    },
    enabled: isAdmin,
  });

  // Set default doctor if Doctor
  useEffect(() => {
    if (!isAdmin && userInfo) {
      setSelectedDoctorId(String(userInfo.id));
    }
  }, [isAdmin, userInfo]);

  // Fetch time codes (T1, T2, etc.)
  useEffect(() => {
    const fetchTimeCodes = async () => {
      try {
        const res = await api.get('/api/allCode?type=TIME');
        if (res.data && res.data.errCode === 0) {
          setTimeSlots(res.data.data || []);
        }
      } catch (err) {
        console.error('Error fetching time codes:', err);
      }
    };
    fetchTimeCodes();
  }, []);

  const handleTimeSlotToggle = (keyMap) => {
    if (selectedSlots.includes(keyMap)) {
      setSelectedSlots(selectedSlots.filter((slot) => slot !== keyMap));
    } else {
      setSelectedSlots([...selectedSlots, keyMap]);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!selectedDoctorId) {
      toast.error('Vui lòng chọn bác sĩ.');
      return;
    }
    if (!selectedDate) {
      toast.error('Vui lòng chọn ngày kế hoạch.');
      return;
    }
    if (selectedSlots.length === 0) {
      toast.error('Vui lòng chọn ít nhất một khung giờ khám.');
      return;
    }

    setSaving(true);
    try {
      // Calculate start of day timestamp in milliseconds (as expected by backend)
      const dayTimestamp = dayjs(selectedDate).startOf('day').valueOf();

      // Build bulk schedule array
      const arrSchedule = selectedSlots.map((timeType) => ({
        doctorId: Number(selectedDoctorId),
        date: String(dayTimestamp),
        timeType: timeType,
      }));

      const res = await api.post('/api/bulk-create-schedule', {
        arrSchedule,
        doctorId: Number(selectedDoctorId),
        formatDate: String(dayTimestamp),
      });

      if (res.data && res.data.errCode === 0) {
        toast.success('Lên kế hoạch khám bệnh thành công!');
        setSelectedSlots([]); // Clear selections on success
      } else {
        toast.error(res.data.errMessage || 'Lên kế hoạch thất bại!');
      }
    } catch (err) {
      console.error(err);
      toast.error('Lỗi lưu thông tin kế hoạch khám.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded border shadow-sm p-4">
      <div className="d-flex align-items-center gap-2 mb-4 border-bottom pb-2">
        <CalendarRange className="text-primary" size={22} />
        <h4 className="fw-bold text-dark m-0">Quản lý kế hoạch khám bệnh</h4>
      </div>

      <Form onSubmit={handleSave}>
        <Row className="g-3 mb-4">
          {isAdmin ? (
            <Col md={6}>
              <Form.Group controlId="select-doctor">
                <Form.Label className="fw-semibold small">Chọn bác sĩ</Form.Label>
                <Form.Select
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                >
                  <option value="">-- Chọn bác sĩ --</option>
                  {doctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.lastName} {doc.firstName}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          ) : (
            <Col md={6}>
              <Form.Group controlId="doctor-name-locked">
                <Form.Label className="fw-semibold small">Bác sĩ</Form.Label>
                <Form.Control
                  type="text"
                  readOnly
                  disabled
                  value={userInfo ? `${userInfo.lastName} ${userInfo.firstName}` : ''}
                />
              </Form.Group>
            </Col>
          )}

          <Col md={6}>
            <Form.Group controlId="select-date">
              <Form.Label className="fw-semibold small">Chọn ngày kế hoạch</Form.Label>
              <Form.Control
                type="date"
                min={dayjs().format('YYYY-MM-DD')}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <h5 className="fw-bold text-secondary mb-3 border-bottom pb-2">Chọn khung giờ khám</h5>

        <Row className="g-2 row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-6 mb-4">
          {timeSlots.map((slot) => {
            const timeText = i18n.language === 'vi' ? slot.valueVi : slot.valueEn;
            const isSelected = selectedSlots.includes(slot.keyMap);
            
            return (
              <Col key={slot.keyMap}>
                <Button
                  variant={isSelected ? 'primary' : 'outline-primary'}
                  className="w-100 py-3 fw-semibold text-truncate"
                  onClick={() => handleTimeSlotToggle(slot.keyMap)}
                >
                  {timeText}
                </Button>
              </Col>
            );
          })}
        </Row>

        <div className="d-flex justify-content-end">
          <Button
            type="submit"
            variant="primary"
            className="btn-premium-main d-flex align-items-center gap-2"
            disabled={saving}
          >
            {saving ? <Spinner size="sm" animation="border" /> : <Save size={16} />}
            <span>Lưu kế hoạch</span>
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ManageSchedule;
