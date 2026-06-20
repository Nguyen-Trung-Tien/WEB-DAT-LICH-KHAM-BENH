import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Form, Spinner, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import api from '../services/api.js';
import ProfileDoctor from '../components/ProfileDoctor.jsx';
import DoctorSchedule from '../components/DoctorSchedule.jsx';
import DoctorExtraInfo from '../components/DoctorExtraInfo.jsx';
import { MapPin } from 'lucide-react';

const SpecialtyDetail = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [specialty, setSpecialty] = useState({});
  const [doctorIds, setDoctorIds] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('All');
  const [loading, setLoading] = useState(true);

  // Fetch provinces
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await api.get('/api/allCode?type=PROVINCE');
        if (res.data && res.data.errCode === 0) {
          const list = res.data.data || [];
          const allOption = {
            keyMap: 'All',
            type: 'PROVINCE',
            valueEn: 'All',
            valueVi: 'Toàn Quốc',
          };
          setProvinces([allOption, ...list]);
        }
      } catch (err) {
        console.error('Error fetching provinces:', err);
      }
    };
    fetchProvinces();
  }, []);

  // Fetch detail specialty and doctor list
  useEffect(() => {
    const fetchSpecialtyDetail = async () => {
      setLoading(true);
      try {
        const res = await api.get(
          `/api/get-detail-specialty-by-id?id=${id}&location=${selectedProvince}`
        );
        if (res.data && res.data.errCode === 0) {
          setSpecialty(res.data.data || {});
          
          // Collect doctor IDs
          const list = res.data.data?.doctorSpecialty || [];
          setDoctorIds(list.map((item) => item.doctorId));
          
          document.title = `${res.data.data?.name || 'Chuyên khoa'} - BookingCare`;
        }
      } catch (err) {
        console.error('Error fetching specialty detail:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSpecialtyDetail();
  }, [id, selectedProvince]);

  const handleProvinceChange = (e) => {
    setSelectedProvince(e.target.value);
  };

  return (
    <Container className="py-5">
      {/* Specialty Banner / Intro Description */}
      {specialty.descriptionHTML && (
        <Card className="border shadow-sm p-4 mb-5 bg-white">
          <div
            className="specialty-description-rich-html"
            dangerouslySetInnerHTML={{ __html: specialty.descriptionHTML }}
          />
        </Card>
      )}

      {/* Filter Location Dropdown */}
      <div className="d-flex align-items-center gap-2 mb-4 justify-content-end bg-light p-3 rounded border">
        <MapPin size={18} className="text-secondary" />
        <span className="fw-semibold small text-secondary">Tỉnh thành:</span>
        <Form.Select className="w-auto border border-primary text-primary fw-semibold" value={selectedProvince} onChange={handleProvinceChange}>
          {provinces.map((prov) => (
            <option key={prov.keyMap} value={prov.keyMap}>
              {i18n.language === 'vi' ? prov.valueVi : prov.valueEn}
            </option>
          ))}
        </Form.Select>
      </div>

      {/* Doctors List */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : doctorIds.length > 0 ? (
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
          Hiện tại chưa có bác sĩ nào thuộc chuyên khoa này hoạt động tại khu vực đã chọn.
        </div>
      )}
    </Container>
  );
};

export default SpecialtyDetail;
