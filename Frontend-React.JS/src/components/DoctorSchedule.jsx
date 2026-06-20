import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Button, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Calendar, Hand } from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/vi.js';
import api from '../services/api.js';
import BookingModal from './BookingModal.jsx';

const DoctorSchedule = ({ doctorId, doctorData }) => {
  const { t, i18n } = useTranslation();
  const [allDays, setAllDays] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Capitalize first letter helper (for Vietnamese days)
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Generate 7 days array
  const generateDays = (lang) => {
    const days = [];
    dayjs.locale(lang);

    for (let i = 0; i < 7; i++) {
      const dayObj = {};
      const currentDay = dayjs().add(i, 'day');
      
      // We set the date format as start of day timestamp in milliseconds (same as old code)
      dayObj.value = currentDay.startOf('day').valueOf();

      if (lang === 'vi') {
        if (i === 0) {
          dayObj.label = `Hôm nay - ${currentDay.format('DD/MM')}`;
        } else {
          dayObj.label = capitalizeFirstLetter(currentDay.format('dddd - DD/MM'));
        }
      } else {
        if (i === 0) {
          dayObj.label = `Today - ${currentDay.format('DD/MM')}`;
        } else {
          dayObj.label = currentDay.format('ddd - DD/MM');
        }
      }
      days.push(dayObj);
    }
    return days;
  };

  // Build days when language changes
  useEffect(() => {
    const days = generateDays(i18n.language);
    setAllDays(days);
    if (days.length > 0 && !selectedDate) {
      setSelectedDate(String(days[0].value));
    }
  }, [i18n.language]);

  // Fetch schedule times
  useEffect(() => {
    const fetchSchedule = async () => {
      if (!doctorId || !selectedDate) return;
      setLoading(true);
      try {
        const res = await api.get(
          `/api/get-schedule-doctor-by-date?doctorId=${doctorId}&date=${selectedDate}`
        );
        if (res.data && res.data.errCode === 0) {
          setAvailableTimes(res.data.data || []);
        }
      } catch (err) {
        console.error('Error fetching doctor schedule:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, [doctorId, selectedDate]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleTimeClick = (slot) => {
    // Inject doctorData to make sure BookingModal has doctor detail (lastName, firstName)
    const slotWithDoctor = { ...slot, doctorData };
    setSelectedSlot(slotWithDoctor);
    setIsOpenModal(true);
  };

  return (
    <div className="p-3 bg-white border rounded shadow-sm">
      {/* Date Select */}
      <div className="mb-4">
        <Form.Group controlId="select-date">
          <Form.Select className="w-auto fw-semibold border border-primary text-primary py-2" value={selectedDate} onChange={handleDateChange}>
            {allDays.map((day, idx) => (
              <option key={idx} value={day.value}>
                {day.label}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </div>

      {/* Available Times Title */}
      <div className="d-flex align-items-center gap-2 mb-3 text-secondary border-bottom pb-2">
        <Calendar size={18} className="text-primary" />
        <span className="fw-bold uppercase tracking-wide">{t('patient.detail-doctor.schedule')}</span>
      </div>

      {/* Available Times Buttons */}
      <div className="time-content">
        {loading ? (
          <div className="py-3 text-center">
            <Spinner animation="border" size="sm" variant="primary" />
          </div>
        ) : availableTimes.length > 0 ? (
          <>
            <Row className="g-2 row-cols-2 row-cols-sm-3 row-cols-md-4">
              {availableTimes.map((item, idx) => {
                const timeText = i18n.language === 'vi' ? item.timeTypeData?.valueVi : item.timeTypeData?.valueEn;
                return (
                  <Col key={idx}>
                    <Button
                      variant="outline-primary"
                      className="w-100 py-2 fw-semibold"
                      onClick={() => handleTimeClick(item)}
                    >
                      {timeText}
                    </Button>
                  </Col>
                );
              })}
            </Row>
            
            <div className="book-free mt-3 text-secondary small d-flex align-items-center gap-1">
              <span>{t('patient.detail-doctor.choose')}</span>
              <Hand size={14} className="text-secondary" />
              <span>{t('patient.detail-doctor.book-free')}</span>
            </div>
          </>
        ) : (
          <div className="no-schedule text-muted py-3 small text-center bg-light rounded border">
            {t('patient.detail-doctor.no-schedule')}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {selectedSlot && (
        <BookingModal
          isOpenModal={isOpenModal}
          closeBookingModal={() => setIsOpenModal(false)}
          dataTime={selectedSlot}
        />
      )}
    </div>
  );
};

export default DoctorSchedule;
