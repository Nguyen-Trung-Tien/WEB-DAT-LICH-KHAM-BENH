import React, { useState } from 'react';
import { Container, Row, Col, Card, Spinner, Button } from 'react-bootstrap';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api.js';
import HomeBanner from '../components/HomeBanner.jsx';
import { ArrowRight, Star } from 'lucide-react';

const Home = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch Specialties
  const { data: specialtiesData, isLoading: loadingSpecialties } = useQuery({
    queryKey: ['specialties'],
    queryFn: async () => {
      const res = await api.get('/api/get-all-specialty');
      return res.data;
    },
  });

  // Fetch Clinics
  const { data: clinicsData, isLoading: loadingClinics } = useQuery({
    queryKey: ['clinics'],
    queryFn: async () => {
      const res = await api.get('/api/get-all-clinic');
      return res.data;
    },
  });

  // Fetch Top Doctors
  const { data: doctorsData, isLoading: loadingDoctors } = useQuery({
    queryKey: ['topDoctors'],
    queryFn: async () => {
      const res = await api.get('/api/top-doctor-home?limit=10');
      return res.data;
    },
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  // Filter specialties based on search
  const filteredSpecialties = specialtiesData?.data?.filter((item) =>
    item.name.toLowerCase().includes(searchTerm)
  ) || [];

  return (
    <div>
      <HomeBanner onSearchChange={handleSearchChange} />

      <Container className="py-5">
        {/* Popular Specialties */}
        <section className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="section-title m-0">{t('homepage.specialty-popular')}</h3>
            <Button variant="outline-primary" size="sm" className="d-flex align-items-center gap-1">
              <span>{t('homepage.more-info')}</span>
              <ArrowRight size={14} />
            </Button>
          </div>

          {loadingSpecialties ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <Row className="g-4">
              {filteredSpecialties.slice(0, 4).map((specialty) => (
                <Col key={specialty.id} xs={12} sm={6} md={3}>
                  <Card
                    onClick={() => navigate(`/detail-specialty/${specialty.id}`)}
                    className="h-100 border-0 shadow-sm hover-glow cursor-pointer"
                  >
                    <div
                      style={{
                        height: '180px',
                        backgroundImage: `url(${specialty.image || 'https://via.placeholder.com/180'})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderTopLeftRadius: '0.375rem',
                        borderTopRightRadius: '0.375rem',
                      }}
                    />
                    <Card.Body className="d-flex flex-column justify-content-center text-center">
                      <Card.Title className="fw-semibold text-dark fs-6">{specialty.name}</Card.Title>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
              {filteredSpecialties.length === 0 && (
                <Col className="text-center text-muted py-4">
                  Không tìm thấy chuyên khoa nào phù hợp.
                </Col>
              )}
            </Row>
          )}
        </section>

        {/* Outstanding Clinics */}
        <section className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="section-title m-0">{t('home-header.health-facility')}</h3>
            <Button variant="outline-primary" size="sm" className="d-flex align-items-center gap-1">
              <span>{t('homepage.more-info')}</span>
              <ArrowRight size={14} />
            </Button>
          </div>

          {loadingClinics ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <Row className="g-4">
              {clinicsData?.data?.slice(0, 4).map((clinic) => (
                <Col key={clinic.id} xs={12} sm={6} md={3}>
                  <Card
                    onClick={() => navigate(`/detail-clinic/${clinic.id}`)}
                    className="h-100 border-0 shadow-sm hover-glow cursor-pointer"
                  >
                    <div
                      style={{
                        height: '180px',
                        backgroundImage: `url(${clinic.image || 'https://via.placeholder.com/180'})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderTopLeftRadius: '0.375rem',
                        borderTopRightRadius: '0.375rem',
                      }}
                    />
                    <Card.Body>
                      <Card.Title className="fw-semibold text-dark fs-6 mb-1 text-truncate">{clinic.name}</Card.Title>
                      <Card.Text className="text-muted small text-truncate">{clinic.address}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </section>

        {/* Top Doctors */}
        <section className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="section-title m-0">{t('homepage.outstanding-doctor')}</h3>
            <Button variant="outline-primary" size="sm" className="d-flex align-items-center gap-1">
              <span>{t('homepage.more-info')}</span>
              <ArrowRight size={14} />
            </Button>
          </div>

          {loadingDoctors ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <Row className="g-4">
              {doctorsData?.data?.slice(0, 4).map((doctor) => {
                const titleVi = `${doctor.positionData?.valueVi || 'Bác sĩ'}, ${doctor.lastName} ${doctor.firstName}`;
                const titleEn = `${doctor.positionData?.valueEn || 'Doctor'}, ${doctor.firstName} ${doctor.lastName}`;
                const displayName = i18n.language === 'vi' ? titleVi : titleEn;

                return (
                  <Col key={doctor.id} xs={12} sm={6} md={3}>
                    <Card
                      onClick={() => navigate(`/detail-doctor/${doctor.id}`)}
                      className="h-100 border-0 shadow-sm hover-glow cursor-pointer text-center p-3"
                    >
                      <div className="d-flex justify-content-center mb-3">
                        <div
                          style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            backgroundImage: `url(${doctor.image || 'https://via.placeholder.com/120'})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            border: '3px solid #e2e8f0',
                          }}
                        />
                      </div>
                      <Card.Body className="p-0">
                        <div className="d-flex justify-content-center align-items-center gap-1 text-warning small mb-2">
                          <Star size={14} fill="currentColor" />
                          <Star size={14} fill="currentColor" />
                          <Star size={14} fill="currentColor" />
                          <Star size={14} fill="currentColor" />
                          <Star size={14} fill="currentColor" />
                        </div>
                        <Card.Title className="fw-bold text-dark fs-6 mb-1">{displayName}</Card.Title>
                        <Card.Text className="text-secondary small">Bác sĩ chuyên khoa khám bệnh</Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          )}
        </section>
      </Container>
    </div>
  );
};

export default Home;
