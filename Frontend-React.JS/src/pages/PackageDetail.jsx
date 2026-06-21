import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Spinner, Card, Button, Badge } from 'react-bootstrap';
import { MapPin, Briefcase, Calendar, Stethoscope, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import api from '../services/api.js';

const PackageDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pack, setPack] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackageDetail = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/get-detail-medical-package-by-id?id=${id}`);
        if (res.data && res.data.errCode === 0) {
          setPack(res.data.data || {});
          document.title = `${res.data.data?.name || 'Chi tiết gói khám'} - BookingCare`;
        } else {
          toast.error(res.data.errMessage || 'Lỗi khi tải chi tiết gói khám.');
        }
      } catch (err) {
        console.error('Error fetching package detail:', err);
        toast.error('Lỗi kết nối đến máy chủ.');
      } finally {
        setLoading(false);
      }
    };
    fetchPackageDetail();
  }, [id]);

  const handleBookNow = () => {
    toast.success('Hệ thống đang chuẩn bị mở rộng đăng ký lịch hẹn theo gói khám. Bạn vui lòng liên hệ hotline để nhận tư vấn trực tiếp!');
  };

  return (
    <Container className="py-5">
      <Button 
        variant="link" 
        onClick={() => navigate(-1)} 
        className="d-flex align-items-center gap-2 text-decoration-none text-teal mb-4 p-0"
      >
        <ArrowLeft size={16} />
        <span>Quay lại</span>
      </Button>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Row className="g-4">
          {/* Main Info Column */}
          <Col lg={8}>
            <Card className="border shadow-sm p-4 bg-white" style={{ borderRadius: '16px' }}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <Badge bg="teal" className="p-2 fs-7 fw-bold text-white bg-opacity-75">Gói khám sức khỏe</Badge>
                {pack.specialtyData && (
                  <Badge bg="secondary" className="p-2 fs-7 fw-normal text-dark bg-opacity-25">
                    {pack.specialtyData.name}
                  </Badge>
                )}
              </div>
              
              <h2 className="fw-bold text-dark mb-4">{pack.name}</h2>
              
              <div className="mb-4 text-center">
                <img 
                  src={pack.image || 'https://via.placeholder.com/600x300'} 
                  alt={pack.name} 
                  className="img-fluid rounded border" 
                  style={{ maxHeight: '400px', width: '100%', objectFit: 'cover', borderRadius: '16px' }}
                />
              </div>

              <h4 className="fw-bold text-dark mb-3 border-bottom pb-2">Thông tin chi tiết gói khám</h4>
              {pack.descriptionHTML ? (
                <div
                  className="package-description-rich-html"
                  dangerouslySetInnerHTML={{ __html: pack.descriptionHTML }}
                  style={{ lineHeight: '1.7', fontSize: '15px' }}
                />
              ) : (
                <p className="text-muted">Chưa có thông tin mô tả chi tiết cho gói khám này.</p>
              )}
            </Card>
          </Col>

          {/* Pricing & Clinic Info Column */}
          <Col lg={4}>
            <div className="d-flex flex-column gap-4 sticky-top" style={{ top: '100px' }}>
              {/* Pricing & Booking Action Card */}
              <Card className="border shadow-sm p-4 bg-white text-center" style={{ borderRadius: '16px' }}>
                <span className="text-secondary small fw-bold">GIÁ GÓI KHÁM TRỌN GÓI</span>
                <h2 className="fw-bold text-danger my-3">{pack.price || 'Liên hệ'}</h2>
                <hr className="my-3" />
                <div className="d-flex align-items-center justify-content-center gap-2 mb-3 text-secondary small">
                  <Calendar size={16} />
                  <span>Hỗ trợ đặt hẹn nhanh chóng</span>
                </div>
                <Button 
                  onClick={handleBookNow}
                  className="btn-premium-main w-100 py-2.5 fw-bold fs-6"
                >
                  Đăng ký nhận tư vấn gói khám
                </Button>
              </Card>

              {/* Clinic Provider Card */}
              {pack.clinicData && (
                <Card className="border shadow-sm p-4 bg-white" style={{ borderRadius: '16px' }}>
                  <span className="text-secondary small fw-bold mb-3 d-block">ĐỊA ĐIỂM CUNG CẤP</span>
                  <h5 className="fw-bold text-dark mb-2">{pack.clinicData.name}</h5>
                  <div className="d-flex align-items-start gap-2 text-muted small">
                    <MapPin size={16} className="text-danger flex-shrink-0 mt-1" />
                    <span>{pack.clinicData.address}</span>
                  </div>
                </Card>
              )}
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default PackageDetail;
