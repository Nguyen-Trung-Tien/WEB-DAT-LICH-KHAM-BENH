import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, InputGroup, Form, ListGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Search, Stethoscope, Video, HeartPulse, FlaskConical, Brain, Smile, Activity, MapPin, UserRound } from 'lucide-react';
import api from '../services/api.js';

const HomeBanner = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
  // Data lists
  const [specialties, setSpecialties] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [doctors, setDoctors] = useState([]);
  
  // Filtered lists
  const [filteredSpecialties, setFilteredSpecialties] = useState([]);
  const [filteredClinics, setFilteredClinics] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  
  const dropdownRef = useRef(null);

  // Fetch all searchable data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [specRes, clinicRes, docRes] = await Promise.all([
          api.get('/api/get-all-specialty'),
          api.get('/api/get-all-clinic'),
          api.get('/api/get-all-doctors'),
        ]);

        if (specRes.data && specRes.data.errCode === 0) setSpecialties(specRes.data.data || []);
        if (clinicRes.data && clinicRes.data.errCode === 0) setClinics(clinicRes.data.data || []);
        if (docRes.data && docRes.data.errCode === 0) setDoctors(docRes.data.data || []);
      } catch (err) {
        console.error('Error fetching autocomplete search lists:', err);
      }
    };
    fetchData();
  }, []);

  // Filter lists on query change
  useEffect(() => {
    if (!query.trim()) {
      setFilteredSpecialties([]);
      setFilteredClinics([]);
      setFilteredDoctors([]);
      return;
    }

    const term = query.toLowerCase();
    
    const matchedSpecs = specialties.filter((s) => s.name?.toLowerCase().includes(term));
    const matchedClinics = clinics.filter((c) => c.name?.toLowerCase().includes(term) || c.address?.toLowerCase().includes(term));
    const matchedDocs = doctors.filter((d) => {
      const fullname = `${d.lastName} ${d.firstName}`.toLowerCase();
      return fullname.includes(term) || d.email?.toLowerCase().includes(term);
    });

    setFilteredSpecialties(matchedSpecs);
    setFilteredClinics(matchedClinics);
    setFilteredDoctors(matchedDocs);
  }, [query, specialties, clinics, doctors]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectOption = (path) => {
    setQuery('');
    setIsOpen(false);
    navigate(path);
  };

  const hasResults = filteredSpecialties.length > 0 || filteredClinics.length > 0 || filteredDoctors.length > 0;

  return (
    <div className="home-banner py-5 d-flex align-items-center" style={{ minHeight: '440px' }}>
      <Container className="banner-content text-center py-4">
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <h1 className="fw-extrabold mb-2 text-uppercase text-white tracking-tight" style={{ fontSize: '2.5rem', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
              {t('banner.title1')}
            </h1>
            <h2 className="fw-light mb-4 text-white text-opacity-90" style={{ fontSize: '1.65rem' }}>
              {t('banner.title2')}
            </h2>

            {/* Search Input Container */}
            <div className="position-relative max-width-600 mx-auto mb-5 shadow-lg" ref={dropdownRef}>
              <InputGroup size="lg" className="overflow-hidden" style={{ borderRadius: '12px' }}>
                <InputGroup.Text className="bg-white border-end-0">
                  <Search className="text-secondary" size={20} />
                </InputGroup.Text>
                <Form.Control
                  placeholder={i18n.language === 'vi' ? 'Tìm chuyên khoa, bác sĩ, phòng khám...' : 'Search specialty, doctor, health facility...'}
                  className="border-start-0 py-3"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setIsOpen(true);
                  }}
                  onFocus={() => setIsOpen(true)}
                  style={{ borderTopRightRadius: '12px', borderBottomRightRadius: '12px' }}
                />
              </InputGroup>

              {/* Autocomplete Dropdown List */}
              {isOpen && query.trim() && (
                <div 
                  className="position-absolute w-100 mt-2 text-start glass-card shadow-lg z-3 overflow-y-auto"
                  style={{ maxHeight: '350px', left: 0 }}
                >
                  {hasResults ? (
                    <ListGroup variant="flush" className="bg-transparent border-0 rounded">
                      {/* Specialties section */}
                      {filteredSpecialties.length > 0 && (
                        <>
                          <div className="px-3 py-2 bg-light bg-opacity-20 text-muted small fw-bold d-flex align-items-center gap-1 border-bottom">
                            <Activity size={14} className="text-teal" />
                            <span>CHUYÊN KHOA</span>
                          </div>
                          {filteredSpecialties.map((s) => (
                            <ListGroup.Item 
                              key={`spec-${s.id}`} 
                              action 
                              onClick={() => handleSelectOption(`/detail-specialty/${s.id}`)}
                              className="px-3 py-2 bg-transparent text-main border-bottom border-opacity-10 d-flex align-items-center gap-3 hover-glow"
                            >
                              <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundImage: `url(${s.image || 'https://via.placeholder.com/32'})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                              <span className="fw-semibold">{s.name}</span>
                            </ListGroup.Item>
                          ))}
                        </>
                      )}

                      {/* Clinics section */}
                      {filteredClinics.length > 0 && (
                        <>
                          <div className="px-3 py-2 bg-light bg-opacity-20 text-muted small fw-bold d-flex align-items-center gap-1 border-bottom">
                            <MapPin size={14} className="text-danger" />
                            <span>CƠ SỞ Y TẾ</span>
                          </div>
                          {filteredClinics.map((c) => (
                            <ListGroup.Item 
                              key={`clinic-${c.id}`} 
                              action 
                              onClick={() => handleSelectOption(`/detail-clinic/${c.id}`)}
                              className="px-3 py-2 bg-transparent text-main border-bottom border-opacity-10 d-flex flex-column hover-glow"
                            >
                              <span className="fw-semibold">{c.name}</span>
                              <span className="text-secondary small">{c.address}</span>
                            </ListGroup.Item>
                          ))}
                        </>
                      )}

                      {/* Doctors section */}
                      {filteredDoctors.length > 0 && (
                        <>
                          <div className="px-3 py-2 bg-light bg-opacity-20 text-muted small fw-bold d-flex align-items-center gap-1 border-bottom">
                            <UserRound size={14} className="text-primary" />
                            <span>BÁC SĨ NỔI BẬT</span>
                          </div>
                          {filteredDoctors.map((d) => {
                            const titleVi = `${d.positionData?.valueVi || 'Bác sĩ'}, ${d.lastName} ${d.firstName}`;
                            const titleEn = `${d.positionData?.valueEn || 'Doctor'}, ${d.firstName} ${d.lastName}`;
                            const name = i18n.language === 'vi' ? titleVi : titleEn;
                            return (
                              <ListGroup.Item 
                                key={`doc-${d.id}`} 
                                action 
                                onClick={() => handleSelectOption(`/detail-doctor/${d.id}`)}
                                className="px-3 py-2 bg-transparent text-main border-bottom border-opacity-10 d-flex align-items-center gap-3 hover-glow"
                              >
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundImage: `url(${d.image || 'https://via.placeholder.com/32'})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                                <span className="fw-semibold">{name}</span>
                              </ListGroup.Item>
                            );
                          })}
                        </>
                      )}
                    </ListGroup>
                  ) : (
                    <div className="p-4 text-center text-muted">
                      Không tìm thấy kết quả phù hợp.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Interactive Grid Options */}
            <Row className="g-3 mt-4 justify-content-center">
              <Col xs={6} sm={4} md={2} className="text-center">
                <div className="option-child p-3 bg-white bg-opacity-10 rounded hover-glow cursor-pointer text-white d-flex flex-column align-items-center gap-2" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div className="p-3 bg-white bg-opacity-20 rounded-circle text-danger">
                    <Stethoscope size={24} />
                  </div>
                  <div className="small fw-semibold mt-1">{t('banner.child1')}</div>
                </div>
              </Col>
              
              <Col xs={6} sm={4} md={2} className="text-center">
                <div className="option-child p-3 bg-white bg-opacity-10 rounded hover-glow cursor-pointer text-white d-flex flex-column align-items-center gap-2" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div className="p-3 bg-white bg-opacity-20 rounded-circle text-info">
                    <Video size={24} />
                  </div>
                  <div className="small fw-semibold mt-1">{t('banner.child2')}</div>
                </div>
              </Col>

              <Col xs={6} sm={4} md={2} className="text-center">
                <div className="option-child p-3 bg-white bg-opacity-10 rounded hover-glow cursor-pointer text-white d-flex flex-column align-items-center gap-2" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div className="p-3 bg-white bg-opacity-20 rounded-circle text-success">
                    <HeartPulse size={24} />
                  </div>
                  <div className="small fw-semibold mt-1">{t('banner.child3')}</div>
                </div>
              </Col>

              <Col xs={6} sm={4} md={2} className="text-center">
                <div className="option-child p-3 bg-white bg-opacity-10 rounded hover-glow cursor-pointer text-white d-flex flex-column align-items-center gap-2" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div className="p-3 bg-white bg-opacity-20 rounded-circle text-warning">
                    <FlaskConical size={24} />
                  </div>
                  <div className="small fw-semibold mt-1">{t('banner.child4')}</div>
                </div>
              </Col>

              <Col xs={6} sm={4} md={2} className="text-center">
                <div className="option-child p-3 bg-white bg-opacity-10 rounded hover-glow cursor-pointer text-white d-flex flex-column align-items-center gap-2" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div className="p-3 bg-white bg-opacity-20 rounded-circle text-light">
                    <Brain size={24} />
                  </div>
                  <div className="small fw-semibold mt-1">{t('banner.child5')}</div>
                </div>
              </Col>

              <Col xs={6} sm={4} md={2} className="text-center">
                <div className="option-child p-3 bg-white bg-opacity-10 rounded hover-glow cursor-pointer text-white d-flex flex-column align-items-center gap-2" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div className="p-3 bg-white bg-opacity-20 rounded-circle text-danger">
                    <Smile size={24} />
                  </div>
                  <div className="small fw-semibold mt-1">{t('banner.child6')}</div>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HomeBanner;
