import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Row, Col, Spinner } from 'react-bootstrap';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { UsersRound, Send } from 'lucide-react';
import { toast } from 'sonner';
import dayjs from 'dayjs';
import api from '../services/api.js';
import useAuthStore from '../store/authStore.js';
import RemedyModal from '../components/RemedyModal.jsx';

const ManagePatient = () => {
  const queryClient = useQueryClient();
  const { userInfo } = useAuthStore();
  const isAdmin = userInfo?.roleId === 'R1';

  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [showModal, setShowModal] = useState(false);
  const [activeBooking, setActiveBooking] = useState(null);

  // Fetch doctors (only if Admin)
  const { data: doctors = [] } = useQuery({
    queryKey: ['allDoctorsPatient'],
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

  // Fetch Patients List
  const dayTimestamp = dayjs(selectedDate).startOf('day').valueOf();
  const { data: patients = [], isLoading: loadingPatients } = useQuery({
    queryKey: ['patientsList', selectedDoctorId, dayTimestamp],
    queryFn: async () => {
      if (!selectedDoctorId) return [];
      const res = await api.get(
        `/api/get-list-patient-for-doctor?doctorId=${selectedDoctorId}&date=${dayTimestamp}`
      );
      return res.data.data || [];
    },
    enabled: !!selectedDoctorId,
  });

  const handleOpenRemedyModal = (booking) => {
    setActiveBooking(booking);
    setShowModal(true);
  };

  const handleSendRemedy = async (remedyData) => {
    if (!activeBooking) return;
    try {
      const res = await api.post('/api/send-remedy', {
        email: remedyData.email,
        doctorId: activeBooking.doctorId,
        patientId: activeBooking.patientId,
        timeType: activeBooking.timeType,
        imageBase64: remedyData.imgBase64,
      });

      if (res.data && res.data.errCode === 0) {
        toast.success('Gửi hóa đơn khám bệnh và đơn thuốc thành công!');
        queryClient.invalidateQueries(['patientsList', selectedDoctorId, dayTimestamp]);
      } else {
        toast.error(res.data.errMessage || 'Lỗi gửi hóa đơn!');
      }
    } catch (err) {
      console.error(err);
      toast.error('Gửi hóa đơn thất bại do lỗi hệ thống.');
    }
  };

  return (
    <div className="bg-white rounded border shadow-sm p-4">
      <div className="d-flex align-items-center gap-2 mb-4 border-bottom pb-2">
        <UsersRound className="text-primary" size={22} />
        <h4 className="fw-bold text-dark m-0">Quản lý bệnh nhân khám bệnh</h4>
      </div>

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
            <Form.Label className="fw-semibold small">Chọn ngày khám</Form.Label>
            <Form.Control
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>

      {loadingPatients ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Table responsive striped bordered hover className="align-middle">
          <thead className="table-light">
            <tr>
              <th>STT</th>
              <th>Thời gian</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Giới tính</th>
              <th>Địa chỉ</th>
              <th className="text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((item, idx) => (
              <tr key={item.id}>
                <td>{idx + 1}</td>
                <td className="fw-semibold text-primary">
                  {item.timeTypeDataPatient?.valueVi || 'N/A'}
                </td>
                <td>{item.patientData?.firstName || 'N/A'}</td>
                <td>{item.patientData?.email || 'N/A'}</td>
                <td>
                  {item.patientData?.genderData?.valueVi || 'N/A'}
                </td>
                <td>{item.patientData?.address || 'N/A'}</td>
                <td className="text-center">
                  <Button
                    variant="success"
                    size="sm"
                    className="d-inline-flex align-items-center gap-1"
                    onClick={() => handleOpenRemedyModal({
                      doctorId: item.doctorId,
                      patientId: item.patientId,
                      timeType: item.timeType,
                      email: item.patientData?.email,
                    })}
                  >
                    <Send size={14} />
                    <span>Xác nhận khám xong</span>
                  </Button>
                </td>
              </tr>
            ))}
            {patients.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-muted py-4">Chưa có bệnh nhân nào đặt lịch khám vào ngày này.</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      {/* Remedy Modal popup */}
      <RemedyModal
        isOpenModal={showModal}
        closeRemedyModal={() => setShowModal(false)}
        dataModal={activeBooking}
        onSendRemedy={handleSendRemedy}
      />
    </div>
  );
};

export default ManagePatient;
