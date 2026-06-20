import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import api from '../services/api.js';
import DoctorSchedule from '../components/DoctorSchedule.jsx';
import DoctorExtraInfo from '../components/DoctorExtraInfo.jsx';
import { Star } from 'lucide-react';

const DoctorDetail = () => {
  const { id } = useParams();
  const { i18n } = useTranslation();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctorDetail = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/get-detail-doctor-by-id?id=${id}`);
        if (res.data && res.data.errCode === 0) {
          setDoctor(res.data.data);
          
          // Dynamic SEO Page Title
          const nameVi = `${res.data.data.positionData?.valueVi || 'Bác sĩ'}, ${res.data.data.lastName} ${res.data.data.firstName}`;
          const nameEn = `${res.data.data.positionData?.valueEn || 'Doctor'}, ${res.data.data.firstName} ${res.data.data.lastName}`;
          const name = i18n.language === 'vi' ? nameVi : nameEn;
          document.title = `${name} - BookingCare`;
        }
      } catch (err) {
        console.error('Error fetching doctor detail:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctorDetail();
  }, [id, i18n.language]);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="text-secondary mt-3">Đang tải thông tin bác sĩ...</p>
      </Container>
    );
  }

  if (!doctor) {
    return (
      <Container className="text-center py-5">
        <h4 className="text-danger">Không tìm thấy thông tin bác sĩ!</h4>
      </Container>
    );
  }

  const nameVi = `${doctor.positionData?.valueVi || 'Bác sĩ'}, ${doctor.lastName} ${doctor.firstName}`;
  const nameEn = `${doctor.positionData?.valueEn || 'Doctor'}, ${doctor.firstName} ${doctor.lastName}`;
  const displayName = i18n.language === 'vi' ? nameVi : nameEn;

  return (
    <Container className="py-5">
      {/* Intro section */}
      <Row className="mb-5 align-items-center bg-white p-4 rounded border shadow-sm g-4">
        <Col md={3} className="text-center">
          <div
            className="mx-auto"
            style={{
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              backgroundImage: `url(${doctor.image || 'https://via.placeholder.com/180'})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              border: '4px solid #e2e8f0',
            }}
          />
        </Col>
        
        <Col md={9}>
          <div className="d-flex align-items-center gap-2 mb-2 text-warning">
            <Star size={16} fill="currentColor" />
            <Star size={16} fill="currentColor" />
            <Star size={16} fill="currentColor" />
            <Star size={16} fill="currentColor" />
            <Star size={16} fill="currentColor" />
            <span className="text-secondary small ms-2">(Đánh giá tích cực)</span>
          </div>
          <h2 className="fw-bold text-dark mb-3">{displayName}</h2>
          <p className="text-secondary leading-relaxed m-0">
            {doctor.Markdown?.description || 'Thông tin bác sĩ đang được cập nhật.'}
          </p>
        </Col>
      </Row>

      {/* Booking Calendar & Pricing Cards */}
      <Row className="gy-4 mb-5">
        {/* Calendar Picker column */}
        <Col lg={7}>
          <DoctorSchedule doctorId={id} doctorData={doctor} />
        </Col>

        {/* Pricing / Clinic Details column */}
        <Col lg={5}>
          <DoctorExtraInfo doctorId={id} />
        </Col>
      </Row>

      {/* Rich content HTML description */}
      {doctor.Markdown?.contentHTML && (
        <section className="bg-white p-4 rounded border shadow-sm mt-4">
          <h4 className="section-title mb-4">Giới thiệu chi tiết</h4>
          <div
            className="rich-html-content"
            dangerouslySetInnerHTML={{ __html: doctor.Markdown.contentHTML }}
          />
        </section>
      )}
    </Container>
  );
};

export default DoctorDetail;
