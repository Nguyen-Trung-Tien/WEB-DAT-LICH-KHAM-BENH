import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Spinner, Card } from 'react-bootstrap';
import api from '../services/api.js';
import ProfileDoctor from '../components/ProfileDoctor.jsx';
import DoctorSchedule from '../components/DoctorSchedule.jsx';
import DoctorExtraInfo from '../components/DoctorExtraInfo.jsx';
import { MapPin } from 'lucide-react';

const ClinicDetail = () => {
  const { id } = useParams();
  const [clinic, setClinic] = useState({});
  const [doctorIds, setDoctorIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClinicDetail = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/get-detail-clinic-by-id?id=${id}`);
        if (res.data && res.data.errCode === 0) {
          setClinic(res.data.data || {});
          
          // Collect doctor IDs
          const list = res.data.data?.doctorClinic || [];
          setDoctorIds(list.map((item) => item.doctorId));
          
          document.title = `${res.data.data?.name || 'Phòng khám'} - BookingCare`;
        }
      } catch (err) {
        console.error('Error fetching clinic detail:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchClinicDetail();
  }, [id]);

  return (
    <Container className="py-5">
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          {/* Clinic Banner Info */}
          <Card className="border shadow-sm p-4 mb-5 bg-white">
            <h2 className="fw-bold text-main-color mb-2">{clinic.name}</h2>
            <div className="d-flex align-items-center gap-2 text-secondary mb-4">
              <MapPin size={18} className="text-danger" />
              <span>{clinic.address}</span>
            </div>
            <hr className="my-3" />
            {clinic.descriptionHTML && (
              <div
                className="clinic-description-rich-html"
                dangerouslySetInnerHTML={{ __html: clinic.descriptionHTML }}
              />
            )}
          </Card>

          {/* Doctors List */}
          <h4 className="section-title mb-4">Danh sách bác sĩ hoạt động</h4>
          
          {doctorIds.length > 0 ? (
            <div className="d-flex flex-column gap-4">
              {doctorIds.map((doctorId) => (
                <Card key={doctorId} className="border shadow-sm p-4 hover-glow bg-white">
                  <Row className="gy-4">
                    {/* Doctor profile left column */}
                    <Col lg={6} className="border-end border-slate pr-lg-4">
                      <ProfileDoctor
                        doctorId={doctorId}
                        isShowDescriptionDoctor={true}
                        isShowLinkDetail={true}
                        isShowPrice={false}
                      />
                    </Col>

                    {/* Schedule picker & price card right column */}
                    <Col lg={6} className="ps-lg-4">
                      <div className="mb-3">
                        <DoctorSchedule doctorId={doctorId} />
                      </div>
                      <div>
                        <DoctorExtraInfo doctorId={doctorId} />
                      </div>
                    </Col>
                  </Row>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted py-5 border rounded bg-light">
              Hiện tại chưa có bác sĩ nào đăng ký lịch khám tại cơ sở y tế này.
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default ClinicDetail;
