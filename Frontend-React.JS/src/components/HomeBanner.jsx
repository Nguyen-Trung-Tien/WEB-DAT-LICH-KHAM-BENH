import React from 'react';
import { Container, Row, Col, InputGroup, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Search, Stethoscope, Video, HeartPulse, FlaskConical, Brain, Smile } from 'lucide-react';

const HomeBanner = ({ onSearchChange }) => {
  const { t } = useTranslation();

  return (
    <div className="home-banner py-5 d-flex align-items-center" style={{ minHeight: '400px' }}>
      <Container className="banner-content text-center py-4">
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <h1 className="fw-bold mb-1 text-uppercase text-white tracking-tight" style={{ fontSize: '2.5rem' }}>
              {t('banner.title1')}
            </h1>
            <h2 className="fw-light mb-4 text-white text-opacity-90" style={{ fontSize: '1.75rem' }}>
              {t('banner.title2')}
            </h2>

            {/* Search Input */}
            <div className="max-width-600 mx-auto mb-5 shadow">
              <InputGroup size="lg">
                <InputGroup.Text className="bg-white border-end-0">
                  <Search className="text-secondary" size={20} />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Tìm chuyên khoa khám bệnh hoặc bác sĩ..."
                  className="border-start-0 py-3"
                  onChange={onSearchChange}
                />
              </InputGroup>
            </div>

            {/* Interactive Grid Options */}
            <Row className="g-3 mt-4 justify-content-center">
              <Col xs={6} sm={4} md={2} className="text-center">
                <div className="option-child p-3 bg-white bg-opacity-10 rounded hover-glow cursor-pointer text-white d-flex flex-column align-items-center gap-2">
                  <div className="p-3 bg-white bg-opacity-20 rounded-circle text-danger">
                    <Stethoscope size={24} />
                  </div>
                  <div className="small fw-semibold mt-1">{t('banner.child1')}</div>
                </div>
              </Col>
              
              <Col xs={6} sm={4} md={2} className="text-center">
                <div className="option-child p-3 bg-white bg-opacity-10 rounded hover-glow cursor-pointer text-white d-flex flex-column align-items-center gap-2">
                  <div className="p-3 bg-white bg-opacity-20 rounded-circle text-info">
                    <Video size={24} />
                  </div>
                  <div className="small fw-semibold mt-1">{t('banner.child2')}</div>
                </div>
              </Col>

              <Col xs={6} sm={4} md={2} className="text-center">
                <div className="option-child p-3 bg-white bg-opacity-10 rounded hover-glow cursor-pointer text-white d-flex flex-column align-items-center gap-2">
                  <div className="p-3 bg-white bg-opacity-20 rounded-circle text-success">
                    <HeartPulse size={24} />
                  </div>
                  <div className="small fw-semibold mt-1">{t('banner.child3')}</div>
                </div>
              </Col>

              <Col xs={6} sm={4} md={2} className="text-center">
                <div className="option-child p-3 bg-white bg-opacity-10 rounded hover-glow cursor-pointer text-white d-flex flex-column align-items-center gap-2">
                  <div className="p-3 bg-white bg-opacity-20 rounded-circle text-warning">
                    <FlaskConical size={24} />
                  </div>
                  <div className="small fw-semibold mt-1">{t('banner.child4')}</div>
                </div>
              </Col>

              <Col xs={6} sm={4} md={2} className="text-center">
                <div className="option-child p-3 bg-white bg-opacity-10 rounded hover-glow cursor-pointer text-white d-flex flex-column align-items-center gap-2">
                  <div className="p-3 bg-white bg-opacity-20 rounded-circle text-light">
                    <Brain size={24} />
                  </div>
                  <div className="small fw-semibold mt-1">{t('banner.child5')}</div>
                </div>
              </Col>

              <Col xs={6} sm={4} md={2} className="text-center">
                <div className="option-child p-3 bg-white bg-opacity-10 rounded hover-glow cursor-pointer text-white d-flex flex-column align-items-center gap-2">
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
