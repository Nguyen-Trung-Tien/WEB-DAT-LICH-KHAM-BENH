import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Row, Col, Card, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { CalendarRange, Users, Stethoscope, Building, DollarSign, TrendingUp, Bookmark, Briefcase, PieChart as PieIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../services/api.js';
import useAuthStore from '../store/authStore.js';

const ManageDashboard = () => {
  const { t } = useTranslation();
  const { userInfo } = useAuthStore();
  const isDoctor = userInfo?.roleId === 'R2';

  // Fetch stats from API
  const { data: statsPayload, isLoading } = useQuery({
    queryKey: ['dashboardStats', userInfo?.id, isDoctor],
    queryFn: async () => {
      const url = isDoctor 
        ? `/api/get-dashboard-stats?doctorId=${userInfo.id}`
        : '/api/get-dashboard-stats';
      const res = await api.get(url);
      return res.data;
    },
    enabled: !!userInfo,
  });

  const data = statsPayload?.data || {};
  const trends = data.trends || [];
  const statusDistribution = data.statusDistribution || [];

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="text-secondary mt-3">Đang tải số liệu thống kê hệ thống...</p>
      </div>
    );
  }

  // Calculate mock revenue: Completed bookings * 300,000 VND
  const completedCount = data.statusS3Count || 0;
  const mockRevenue = completedCount * 300000;

  return (
    <div>
      <div className="d-flex align-items-center gap-2 mb-4 border-bottom pb-2">
        <TrendingUp className="text-primary" size={24} />
        <h4 className="fw-bold text-dark m-0">Báo cáo & Thống kê phân tích</h4>
      </div>

      {/* KPI Stats widgets grid */}
      <Row className="g-3 mb-4">
        <Col xs={12} sm={6} md={3}>
          <Card className="border-0 shadow-sm p-3 bg-white h-100 hover-glow">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small fw-bold">TỔNG LỊCH HẸN</span>
                <h3 className="fw-bold text-dark mt-1 mb-0">{data.totalBookings || 0}</h3>
              </div>
              <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary">
                <CalendarRange size={24} />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={12} sm={6} md={3}>
          <Card className="border-0 shadow-sm p-3 bg-white h-100 hover-glow">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small fw-bold">SỐ BỆNH NHÂN</span>
                <h3 className="fw-bold text-dark mt-1 mb-0">{data.totalPatients || 0}</h3>
              </div>
              <div className="bg-info bg-opacity-10 p-3 rounded-circle text-info">
                <Users size={24} />
              </div>
            </div>
          </Card>
        </Col>

        {isDoctor ? (
          <Col xs={12} sm={6} md={3}>
            <Card className="border-0 shadow-sm p-3 bg-white h-100 hover-glow">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-muted small fw-bold">KHÁM HOÀN THÀNH</span>
                  <h3 className="fw-bold text-success mt-1 mb-0">{data.statusS3Count || 0}</h3>
                </div>
                <div className="bg-success bg-opacity-10 p-3 rounded-circle text-success">
                  <Stethoscope size={24} />
                </div>
              </div>
            </Card>
          </Col>
        ) : (
          <Col xs={12} sm={6} md={3}>
            <Card className="border-0 shadow-sm p-3 bg-white h-100 hover-glow">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-muted small fw-bold">BÁC SĨ HỆ THỐNG</span>
                  <h3 className="fw-bold text-dark mt-1 mb-0">{data.totalDoctors || 0}</h3>
                </div>
                <div className="bg-success bg-opacity-10 p-3 rounded-circle text-success">
                  <Stethoscope size={24} />
                </div>
              </div>
            </Card>
          </Col>
        )}

        <Col xs={12} sm={6} md={3}>
          <Card className="border-0 shadow-sm p-3 bg-white h-100 hover-glow">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small fw-bold">{isDoctor ? 'DOANH THU LÂM SÀNG' : 'TỔNG DOANH THU'}</span>
                <h3 className="fw-bold text-danger mt-1 mb-0">{mockRevenue.toLocaleString('vi-VN')} đ</h3>
              </div>
              <div className="bg-danger bg-opacity-10 p-3 rounded-circle text-danger">
                <DollarSign size={24} />
              </div>
            </div>
          </Card>
        </Col>
      </Row>
 
      {/* Admin Extra KPI cards */}
      {!isDoctor && (
        <Row className="g-3 mb-4">
          <Col xs={12} sm={4}>
            <Card className="border-0 shadow-sm p-3 bg-white h-100 hover-glow">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-muted small fw-bold">CHUYÊN KHOA</span>
                  <h3 className="fw-bold text-dark mt-1 mb-0">{data.totalSpecialties || 0}</h3>
                </div>
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary">
                  <Bookmark size={24} />
                </div>
              </div>
            </Card>
          </Col>
 
          <Col xs={12} sm={4}>
            <Card className="border-0 shadow-sm p-3 bg-white h-100 hover-glow">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-muted small fw-bold">CƠ SỞ Y TẾ</span>
                  <h3 className="fw-bold text-dark mt-1 mb-0">{data.totalClinics || 0}</h3>
                </div>
                <div className="bg-info bg-opacity-10 p-3 rounded-circle text-info">
                  <Building size={24} />
                </div>
              </div>
            </Card>
          </Col>
 
          <Col xs={12} sm={4}>
            <Card className="border-0 shadow-sm p-3 bg-white h-100 hover-glow">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-muted small fw-bold">GÓI KHÁM SỨC KHỎE</span>
                  <h3 className="fw-bold text-dark mt-1 mb-0">{data.totalPackages || 0}</h3>
                </div>
                <div className="bg-warning bg-opacity-10 p-3 rounded-circle text-warning">
                  <Briefcase size={24} />
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      )}

      {/* Charts section */}
      <Row className="g-4">
        {/* Line Chart: booking volumes */}
        <Col lg={8}>
          <Card className="border-0 shadow-sm p-4 bg-white" style={{ borderRadius: '16px' }}>
            <h5 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
              <TrendingUp size={20} className="text-teal" />
              <span>Biểu đồ xu hướng đặt lịch hẹn (30 ngày gần nhất)</span>
            </h5>
            <div style={{ width: '100%', height: '320px' }}>
              <ResponsiveContainer>
                <LineChart data={trends} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" name="Tổng số ca" dataKey="total" stroke="#0d9488" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" name="Khám xong" dataKey="completed" stroke="#1e3a8a" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" name="Đã hủy" dataKey="cancelled" stroke="#d97706" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Pie Chart: status distribution */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm p-4 bg-white" style={{ borderRadius: '16px' }}>
            <h5 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
              <PieIcon size={20} className="text-teal" />
              <span>Phân bố trạng thái đặt lịch</span>
            </h5>
            <div style={{ width: '100%', height: '240px' }} className="d-flex justify-content-center">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Status Legend List */}
            <div className="mt-3">
              <Row className="g-2 small">
                {statusDistribution.map((item, idx) => (
                  <Col xs={6} key={idx} className="d-flex align-items-center gap-2">
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: item.color }} />
                    <span className="text-secondary text-truncate">{item.name}: <strong>{item.value}</strong></span>
                  </Col>
                ))}
              </Row>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ManageDashboard;
