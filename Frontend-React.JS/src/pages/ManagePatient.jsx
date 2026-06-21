import React, { useState, useEffect } from 'react';
import { Button, Form, Row, Col, Spinner, Card, Badge } from 'react-bootstrap';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { UsersRound, Play, CheckSquare, Trash2, Search, ArrowRight, Ban, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import dayjs from 'dayjs';
import api from '../services/api.js';
import useAuthStore from '../store/authStore.js';
import RemedyModal from '../components/RemedyModal.jsx';
import EhrQuickView from '../components/EhrQuickView.jsx';

const ManagePatient = () => {
  const queryClient = useQueryClient();
  const { userInfo } = useAuthStore();
  const isAdmin = userInfo?.roleId === 'R1';

  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [showRemedyModal, setShowRemedyModal] = useState(false);
  const [activeBooking, setActiveBooking] = useState(null);

  // EHR drawer states
  const [showEhr, setShowEhr] = useState(false);
  const [ehrPatientId, setEhrPatientId] = useState('');
  const [ehrPatientName, setEhrPatientName] = useState('');

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
  const { data: patients = [], isLoading: loadingPatients, refetch } = useQuery({
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

  const handleUpdateStatus = async (bookingId, nextStatus) => {
    try {
      const res = await api.put('/api/update-booking-status', {
        id: bookingId,
        statusId: nextStatus
      });

      if (res.data && res.data.errCode === 0) {
        toast.success('Cập nhật trạng thái ca khám thành công!');
        queryClient.invalidateQueries(['patientsList', selectedDoctorId, dayTimestamp]);
      } else {
        toast.error(res.data.errMessage || 'Lỗi cập nhật trạng thái!');
      }
    } catch (err) {
      console.error(err);
      toast.error('Cập nhật trạng thái ca khám thất bại.');
    }
  };

  const handleOpenRemedyModal = (booking) => {
    setActiveBooking(booking);
    setShowRemedyModal(true);
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
        toast.success('Gửi hóa đơn khám bệnh và đơn thuốc thành công! Ca khám chuyển sang trạng thái Hoàn thành.');
        queryClient.invalidateQueries(['patientsList', selectedDoctorId, dayTimestamp]);
      } else {
        toast.error(res.data.errMessage || 'Lỗi gửi hóa đơn!');
      }
    } catch (err) {
      console.error(err);
      toast.error('Gửi hóa đơn thất bại do lỗi hệ thống.');
    }
  };

  const handleOpenEhrDrawer = (patientId, patientName) => {
    setEhrPatientId(patientId);
    setEhrPatientName(patientName);
    setShowEhr(true);
  };

  // Filter columns
  const s1Bookings = patients.filter((b) => b.statusId === 'S1');
  const s2Bookings = patients.filter((b) => b.statusId === 'S2');
  const s5Bookings = patients.filter((b) => b.statusId === 'S5');
  const s34Bookings = patients.filter((b) => b.statusId === 'S3' || b.statusId === 'S4');

  return (
    <div className="bg-white rounded border shadow-sm p-4 position-relative overflow-hidden">
      <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-2">
        <div className="d-flex align-items-center gap-2">
          <UsersRound className="text-teal" size={24} />
          <h4 className="fw-bold text-dark m-0">Quản lý ca khám & Bệnh nhân (Kanban)</h4>
        </div>
        <Badge bg="teal" className="bg-main-color">{patients.length} ca khám trong ngày</Badge>
      </div>

      {/* Date and doctor filter */}
      <Row className="g-3 mb-4">
        {isAdmin ? (
          <Col md={6}>
            <Form.Group controlId="select-doctor">
              <Form.Label className="fw-semibold small">Chọn bác sĩ khám</Form.Label>
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
              <Form.Label className="fw-semibold small">Bác sĩ khám bệnh</Form.Label>
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
            <Form.Label className="fw-semibold small">Chọn ngày trực khám</Form.Label>
            <Form.Control
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>

      {/* Kanban Board Container */}
      {loadingPatients ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <div className="kanban-board">
          {/* Column 1: Chờ xác nhận (S1) */}
          <div className="kanban-column">
            <div className="column-header">
              <h6 className="text-secondary uppercase">Chờ xác nhận</h6>
              <Badge bg="secondary">{s1Bookings.length}</Badge>
            </div>
            <div className="column-cards">
              {s1Bookings.map((b) => (
                <Card key={b.id} className="p-3 border-0 bg-white shadow-sm hover-glow">
                  <div className="fw-bold text-dark text-capitalize mb-1">{b.patientData?.firstName || 'N/A'}</div>
                  <div className="text-primary small fw-semibold mb-2">⏱️ Lịch hẹn: {b.timeTypeDataPatient?.valueVi || 'N/A'}</div>
                  <p className="text-secondary small mb-3 text-truncate">Lý do: {b.reason || 'N/A'}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <Button variant="link" size="sm" className="text-teal p-0 font-weight-bold" onClick={() => handleOpenEhrDrawer(b.patientId, b.patientData?.firstName)}>Hồ sơ EHR</Button>
                    <div className="d-flex gap-2">
                      <Button variant="outline-danger" size="sm" className="p-1 rounded-circle d-flex align-items-center justify-content-center" onClick={() => handleUpdateStatus(b.id, 'S4')} title="Hủy lịch hẹn">
                        <Ban size={14} />
                      </Button>
                      <Button variant="success" size="sm" className="p-1 rounded-circle bg-success d-flex align-items-center justify-content-center border-0 text-white" onClick={() => handleUpdateStatus(b.id, 'S2')} title="Xác nhận lịch hẹn">
                        <ArrowRight size={14} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              {s1Bookings.length === 0 && <div className="text-center text-muted small py-4 opacity-50">Không có ca khám chờ duyệt.</div>}
            </div>
          </div>

          {/* Column 2: Đã duyệt / Chờ khám (S2) */}
          <div className="kanban-column" style={{ borderTop: '3px solid var(--primary-color)' }}>
            <div className="column-header">
              <h6 className="text-teal uppercase">Đã duyệt / Chờ khám</h6>
              <Badge bg="teal" className="bg-main-color">{s2Bookings.length}</Badge>
            </div>
            <div className="column-cards">
              {s2Bookings.map((b) => (
                <Card key={b.id} className="p-3 border-0 bg-white shadow-sm hover-glow">
                  <div className="fw-bold text-dark text-capitalize mb-1">{b.patientData?.firstName || 'N/A'}</div>
                  <div className="text-primary small fw-semibold mb-2">⏱️ Lịch hẹn: {b.timeTypeDataPatient?.valueVi || 'N/A'}</div>
                  <p className="text-secondary small mb-3 text-truncate">Lý do: {b.reason || 'N/A'}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <Button variant="link" size="sm" className="text-teal p-0 font-weight-bold" onClick={() => handleOpenEhrDrawer(b.patientId, b.patientData?.firstName)}>Hồ sơ EHR</Button>
                    <div className="d-flex gap-2">
                      <Button variant="outline-danger" size="sm" className="p-1 rounded-circle d-flex align-items-center justify-content-center" onClick={() => handleUpdateStatus(b.id, 'S4')} title="Hủy lịch hẹn">
                        <Ban size={14} />
                      </Button>
                      <Button variant="primary" size="sm" className="p-1 rounded-circle bg-main-color d-flex align-items-center justify-content-center border-0 text-white" onClick={() => handleUpdateStatus(b.id, 'S5')} title="Bắt đầu khám bệnh">
                        <Play size={14} fill="currentColor" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              {s2Bookings.length === 0 && <div className="text-center text-muted small py-4 opacity-50">Không có ca chờ khám.</div>}
            </div>
          </div>

          {/* Column 3: Đang khám (S5) */}
          <div className="kanban-column" style={{ borderTop: '3px solid var(--warning-color)' }}>
            <div className="column-header">
              <h6 className="text-warning uppercase">Đang khám</h6>
              <Badge bg="warning">{s5Bookings.length}</Badge>
            </div>
            <div className="column-cards">
              {s5Bookings.map((b) => (
                <Card key={b.id} className="p-3 border-0 bg-white shadow-sm hover-glow border-left-warning">
                  <div className="fw-bold text-dark text-capitalize mb-1">{b.patientData?.firstName || 'N/A'}</div>
                  <div className="text-primary small fw-semibold mb-2">⏱️ Lịch hẹn: {b.timeTypeDataPatient?.valueVi || 'N/A'}</div>
                  <p className="text-secondary small mb-3 text-truncate">Lý do: {b.reason || 'N/A'}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <Button variant="link" size="sm" className="text-teal p-0 font-weight-bold" onClick={() => handleOpenEhrDrawer(b.patientId, b.patientData?.firstName)}>Hồ sơ EHR</Button>
                    <div className="d-flex gap-2">
                      <Button variant="outline-danger" size="sm" className="p-1 rounded-circle d-flex align-items-center justify-content-center" onClick={() => handleUpdateStatus(b.id, 'S4')} title="Hủy ca khám">
                        <Ban size={14} />
                      </Button>
                      <Button 
                        variant="success" 
                        size="sm" 
                        className="px-2 py-1 rounded d-flex align-items-center justify-content-center border-0 text-white bg-success gap-1 small" 
                        onClick={() => handleOpenRemedyModal({
                          doctorId: b.doctorId,
                          patientId: b.patientId,
                          timeType: b.timeType,
                          email: b.patientData?.email,
                        })}
                        title="Hoàn thành khám và gửi hóa đơn"
                      >
                        <CheckSquare size={14} />
                        <span>Kê đơn</span>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              {s5Bookings.length === 0 && <div className="text-center text-muted small py-4 opacity-50">Không có ca nào đang khám.</div>}
            </div>
          </div>

          {/* Column 4: Lịch sử ca khám (S3/S4) */}
          <div className="kanban-column">
            <div className="column-header">
              <h6 className="text-muted uppercase">Lịch sử hôm nay</h6>
              <Badge bg="dark">{s34Bookings.length}</Badge>
            </div>
            <div className="column-cards">
              {s34Bookings.map((b) => {
                const isCompleted = b.statusId === 'S3';
                return (
                  <Card key={b.id} className="p-3 border-0 bg-white bg-opacity-70 shadow-sm hover-glow opacity-85">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <div className="fw-bold text-dark text-capitalize">{b.patientData?.firstName || 'N/A'}</div>
                      <Badge bg={isCompleted ? 'success' : 'danger'} className="small">
                        {isCompleted ? 'Hoàn thành' : 'Đã hủy'}
                      </Badge>
                    </div>
                    <div className="text-secondary small mb-2">⏱️ Lịch: {b.timeTypeDataPatient?.valueVi || 'N/A'}</div>
                    <p className="text-muted small mb-3 text-truncate">Lý do: {b.reason || 'N/A'}</p>
                    <div className="text-start">
                      <Button variant="link" size="sm" className="text-teal p-0 font-weight-bold" onClick={() => handleOpenEhrDrawer(b.patientId, b.patientData?.firstName)}>Hồ sơ EHR</Button>
                    </div>
                  </Card>
                );
              })}
              {s34Bookings.length === 0 && <div className="text-center text-muted small py-4 opacity-50">Chưa có lịch sử ca khám nào.</div>}
            </div>
          </div>
        </div>
      )}

      {/* Remedy Modal popup */}
      <RemedyModal
        isOpenModal={showRemedyModal}
        closeRemedyModal={() => setShowRemedyModal(false)}
        dataModal={activeBooking}
        onSendRemedy={handleSendRemedy}
      />

      {/* EHR Quick View sliding drawer */}
      <EhrQuickView
        isOpen={showEhr}
        onClose={() => setShowEhr(false)}
        patientId={ehrPatientId}
        patientName={ehrPatientName}
      />
    </div>
  );
};

export default ManagePatient;
