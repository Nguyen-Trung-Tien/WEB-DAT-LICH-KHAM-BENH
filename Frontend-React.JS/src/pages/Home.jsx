import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api.js';
import HomeBanner from '../components/HomeBanner.jsx';
import { ArrowRight, Star } from 'lucide-react';

const SkeletonCard = ({ isDoctor = false }) => (
  <Col xs={12} sm={6} md={3}>
    <Card className={`h-100 border-0 shadow-sm p-3 ${isDoctor ? 'text-center' : ''}`}>
      {isDoctor ? (
        <div className="d-flex justify-content-center mb-3">
          <div className="skeleton-box" style={{ width: '120px', height: '120px', borderRadius: '50%' }} />
        </div>
      ) : (
        <div className="skeleton-box mb-3" style={{ height: '180px', width: '100%', borderRadius: '12px' }} />
      )}
      <Card.Body className="p-0">
        {isDoctor && (
          <div className="skeleton-box mx-auto mb-2" style={{ height: '14px', width: '50%' }} />
        )}
        <div className="skeleton-box mx-auto mb-2" style={{ height: '20px', width: '80%' }} />
        <div className="skeleton-box mx-auto" style={{ height: '14px', width: '60%' }} />
      </Card.Body>
    </Card>
  </Col>
);

const Home = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

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

  // Fetch Medical Packages
  const { data: packagesData, isLoading: loadingPackages } = useQuery({
    queryKey: ['medicalPackages'],
    queryFn: async () => {
      const res = await api.get('/api/get-all-medical-packages');
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

  const specialties = specialtiesData?.data || [];
  const clinics = clinicsData?.data || [];
  const packages = packagesData?.data || [];
  const doctors = doctorsData?.data || [];

  return (
    <div>
      <HomeBanner />

      <Container className="py-5">
        {/* Popular Specialties */}
        <section id="specialties-section" className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="section-title m-0">{t('homepage.specialty-popular')}</h3>
            <Button variant="outline-primary" size="sm" className="d-flex align-items-center gap-1 border-teal text-teal btn-premium-main-outline">
              <span>{t('homepage.more-info')}</span>
              <ArrowRight size={14} />
            </Button>
          </div>

          <Row className="g-4">
            {loadingSpecialties ? (
              Array(4).fill(0).map((_, i) => <SkeletonCard key={`spec-skel-${i}`} />)
            ) : (
              specialties.slice(0, 4).map((specialty) => (
                <Col key={specialty.id} xs={12} sm={6} md={3}>
                  <Card
                    onClick={() => navigate(`/detail-specialty/${specialty.id}`)}
                    className="h-100 border-0 shadow-sm hover-glow cursor-pointer"
                    style={{ borderRadius: '16px', overflow: 'hidden' }}
                  >
                    <div
                      style={{
                        height: '180px',
                        backgroundImage: `url(${specialty.image || 'https://via.placeholder.com/180'})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    />
                    <Card.Body className="d-flex flex-column justify-content-center text-center p-3">
                      <Card.Title className="fw-bold text-dark fs-6 m-0">{specialty.name}</Card.Title>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
            {!loadingSpecialties && specialties.length === 0 && (
              <Col className="text-center text-muted py-4">
                Không tìm thấy chuyên khoa nào phù hợp.
              </Col>
            )}
          </Row>
        </section>

        {/* Outstanding Clinics */}
        <section id="clinics-section" className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="section-title m-0">{t('home-header.health-facility')}</h3>
            <Button variant="outline-primary" size="sm" className="d-flex align-items-center gap-1 border-teal text-teal">
              <span>{t('homepage.more-info')}</span>
              <ArrowRight size={14} />
            </Button>
          </div>

          <Row className="g-4">
            {loadingClinics ? (
              Array(4).fill(0).map((_, i) => <SkeletonCard key={`clinic-skel-${i}`} />)
            ) : (
              clinics.slice(0, 4).map((clinic) => (
                <Col key={clinic.id} xs={12} sm={6} md={3}>
                  <Card
                    onClick={() => navigate(`/detail-clinic/${clinic.id}`)}
                    className="h-100 border-0 shadow-sm hover-glow cursor-pointer"
                    style={{ borderRadius: '16px', overflow: 'hidden' }}
                  >
                    <div
                      style={{
                        height: '180px',
                        backgroundImage: `url(${clinic.image || 'https://via.placeholder.com/180'})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    />
                    <Card.Body className="p-3">
                      <Card.Title className="fw-bold text-dark fs-6 mb-1 text-truncate">{clinic.name}</Card.Title>
                      <Card.Text className="text-muted small text-truncate m-0">{clinic.address}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
            {!loadingClinics && clinics.length === 0 && (
              <Col className="text-center text-muted py-4">
                Không tìm thấy phòng khám nào phù hợp.
              </Col>
            )}
          </Row>
        </section>

        {/* Outstanding Packages */}
        <section id="health-packages-section" className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="section-title m-0">{t('homepage.featured-package')}</h3>
            <Button variant="outline-primary" size="sm" className="d-flex align-items-center gap-1 border-teal text-teal btn-premium-main-outline">
              <span>{t('homepage.more-info')}</span>
              <ArrowRight size={14} />
            </Button>
          </div>

          <Row className="g-4">
            {loadingPackages ? (
              Array(4).fill(0).map((_, i) => <SkeletonCard key={`pack-skel-${i}`} />)
            ) : (
              packages.slice(0, 4).map((pack) => (
                <Col key={pack.id} xs={12} sm={6} md={3}>
                  <Card
                    onClick={() => navigate(`/detail-package/${pack.id}`)}
                    className="h-100 border-0 shadow-sm hover-glow cursor-pointer d-flex flex-column"
                    style={{ borderRadius: '16px', overflow: 'hidden' }}
                  >
                    <div
                      style={{
                        height: '180px',
                        backgroundImage: `url(${pack.image || 'https://via.placeholder.com/180'})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    />
                    <Card.Body className="p-3 d-flex flex-column flex-grow-1 justify-content-between">
                      <div>
                        <Card.Title className="fw-bold text-dark fs-6 mb-1 text-clamp-2" style={{ height: '38px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                          {pack.name}
                        </Card.Title>
                        {pack.clinicData && (
                          <Card.Text className="text-secondary small text-truncate mb-2" style={{ fontSize: '12px' }}>
                            {pack.clinicData.name}
                          </Card.Text>
                        )}
                      </div>
                      <div className="d-flex justify-content-between align-items-center mt-2 border-top pt-2">
                        <span className="text-danger fw-bold small">{pack.price}</span>
                        <span className="text-teal small fw-semibold">Xem chi tiết</span>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
            {!loadingPackages && packages.length === 0 && (
              <Col className="text-center text-muted py-4">
                Không tìm thấy gói khám nào phù hợp.
              </Col>
            )}
          </Row>
        </section>

        {/* Top Doctors */}
        <section id="doctors-section" className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="section-title m-0">{t('homepage.outstanding-doctor')}</h3>
            <Button variant="outline-primary" size="sm" className="d-flex align-items-center gap-1 border-teal text-teal">
              <span>{t('homepage.more-info')}</span>
              <ArrowRight size={14} />
            </Button>
          </div>

          <Row className="g-4">
            {loadingDoctors ? (
              Array(4).fill(0).map((_, i) => <SkeletonCard key={`doc-skel-${i}`} isDoctor />)
            ) : (
              doctors.slice(0, 4).map((doctor) => {
                const titleVi = `${doctor.positionData?.valueVi || 'Bác sĩ'}, ${doctor.lastName} ${doctor.firstName}`;
                const titleEn = `${doctor.positionData?.valueEn || 'Doctor'}, ${doctor.firstName} ${doctor.lastName}`;
                const displayName = i18n.language === 'vi' ? titleVi : titleEn;

                return (
                  <Col key={doctor.id} xs={12} sm={6} md={3}>
                    <Card
                      onClick={() => navigate(`/detail-doctor/${doctor.id}`)}
                      className="h-100 border-0 shadow-sm hover-glow cursor-pointer text-center p-3"
                      style={{ borderRadius: '16px' }}
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
                            border: '3px solid var(--border-color)',
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
                        <Card.Text className="text-secondary small m-0">Bác sĩ chuyên khoa khám bệnh</Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })
            )}
            {!loadingDoctors && doctors.length === 0 && (
              <Col className="text-center text-muted py-4">
                Không tìm thấy bác sĩ nào phù hợp.
              </Col>
            )}
          </Row>
        </section>
      </Container>
    </div>
  );
};

export default Home;
