import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Spinner, Card, Nav, Tab, Form, Button, ListGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '../services/api.js';
import DoctorSchedule from '../components/DoctorSchedule.jsx';
import DoctorExtraInfo from '../components/DoctorExtraInfo.jsx';
import { Star, MessageSquarePlus, User } from 'lucide-react';

const DoctorDetail = () => {
  const { id } = useParams();
  const { i18n, t } = useTranslation();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Review form states
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Fetch reviews and average score
  const { data: reviewsPayload, isLoading: loadingReviews, refetch: refetchReviews } = useQuery({
    queryKey: ['doctorReviews', id],
    queryFn: async () => {
      const res = await api.get(`/api/get-reviews?doctorId=${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const reviewList = reviewsPayload?.data || [];
  const ratingSummary = reviewsPayload?.ratingSummary || { averageRating: '5.0', totalReviews: 0 };

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

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) {
      toast.error('Vui lòng điền đầy đủ Tên và Bình luận đánh giá.');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await api.post('/api/create-review', {
        doctorId: Number(id),
        patientName: reviewName,
        rating: Number(reviewRating),
        comment: reviewComment,
      });

      if (res.data && res.data.errCode === 0) {
        toast.success('Gửi đánh giá của bạn thành công!');
        setReviewName('');
        setReviewComment('');
        setReviewRating(5);
        refetchReviews();
      } else {
        toast.error(res.data.errMessage || 'Không thể gửi đánh giá.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Có lỗi xảy ra, vui lòng thử lại sau.');
    } finally {
      setSubmittingReview(false);
    }
  };

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
      <Row className="gy-4">
        {/* Sticky Left Column (35% width on desktop) */}
        <Col lg={4} className="position-relative">
          <div className="sticky-top" style={{ top: '100px', zIndex: 5 }}>
            <Card className="border-0 shadow-sm text-center p-4 hover-glow bg-white" style={{ borderRadius: '16px' }}>
              <div className="d-flex justify-content-center mb-3">
                <div
                  style={{
                    width: '160px',
                    height: '160px',
                    borderRadius: '50%',
                    backgroundImage: `url(${doctor.image || 'https://via.placeholder.com/160'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    border: '4px solid var(--primary-color)',
                  }}
                />
              </div>

              <h3 className="fw-bold text-dark mb-1">{displayName}</h3>
              <p className="text-muted small mb-3">Bác sĩ chuyên khoa khám bệnh</p>

              {/* Star rating summary */}
              <div className="d-flex justify-content-center align-items-center gap-1 text-warning mb-4">
                {Array(5).fill(0).map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    fill={i < Math.round(Number(ratingSummary.averageRating)) ? 'currentColor' : 'none'}
                  />
                ))}
                <span className="text-secondary fw-bold ms-2 fs-6">
                  {ratingSummary.averageRating} ({ratingSummary.totalReviews} đánh giá)
                </span>
              </div>

              <Button
                variant="primary"
                className="w-100 btn-premium-main py-2.5 fs-6"
                onClick={() => {
                  const el = document.getElementById('scheduler-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Đặt lịch hẹn ngay
              </Button>
            </Card>
          </div>
        </Col>

        {/* Right Column (65% width on desktop) */}
        <Col lg={8}>
          {/* Scheduling Calendar Section */}
          <div id="scheduler-section" className="mb-4">
            <DoctorSchedule doctorId={id} doctorData={doctor} />
          </div>

          {/* Pricing Extra Info Card */}
          <div className="mb-4">
            <DoctorExtraInfo doctorId={id} />
          </div>

          {/* Tabbed Detailed Information */}
          <Tab.Container defaultActiveKey="intro">
            <Card className="border-0 shadow-sm p-4 mb-4 bg-white" style={{ borderRadius: '16px' }}>
              <Nav variant="tabs" className="mb-4 custom-tabs-nav border-bottom">
                <Nav.Item>
                  <Nav.Link eventKey="intro" className="fw-bold text-secondary border-0 px-3 py-2">
                    Giới thiệu chung
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="details" className="fw-bold text-secondary border-0 px-3 py-2">
                    Thông tin chi tiết
                  </Nav.Link>
                </Nav.Item>
              </Nav>

              <Tab.Content>
                <Tab.Pane eventKey="intro">
                  <h5 className="fw-bold text-dark mb-3">Tóm tắt tiểu sử</h5>
                  <p className="text-secondary leading-relaxed" style={{ fontSize: '15px' }}>
                    {doctor.Markdown?.description || 'Thông tin giới thiệu bác sĩ đang được cập nhật.'}
                  </p>
                </Tab.Pane>
                <Tab.Pane eventKey="details">
                  {doctor.Markdown?.contentHTML ? (
                    <div
                      className="rich-html-content text-secondary leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: doctor.Markdown.contentHTML }}
                      style={{ fontSize: '15px' }}
                    />
                  ) : (
                    <p className="text-muted italic">Chưa có thông tin chi tiết đầy đủ của bác sĩ này.</p>
                  )}
                </Tab.Pane>
              </Tab.Content>
            </Card>
          </Tab.Container>

          {/* Doctor Reviews & Ratings List */}
          <Card className="border-0 shadow-sm p-4 mb-4 bg-white" style={{ borderRadius: '16px' }}>
            <h4 className="section-title mb-4">Phản hồi từ người bệnh</h4>
            
            {loadingReviews ? (
              <div className="text-center py-4">
                <Spinner size="sm" animation="border" />
              </div>
            ) : reviewList.length > 0 ? (
              <ListGroup variant="flush" className="mb-4">
                {reviewList.map((review) => (
                  <ListGroup.Item key={review.id} className="bg-transparent px-0 py-3 border-bottom">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div className="d-flex align-items-center gap-2">
                        <div className="bg-light p-2 rounded-circle text-muted">
                          <User size={16} />
                        </div>
                        <strong className="text-dark text-capitalize">{review.patientName}</strong>
                      </div>
                      <div className="d-flex text-warning">
                        {Array(5).fill(0).map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            fill={i < review.rating ? 'currentColor' : 'none'}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-secondary small m-0 pl-4">{review.comment}</p>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <div className="no-reviews text-muted py-4 small text-center bg-light rounded border border-opacity-50 mb-4">
                Chưa có đánh giá nào cho bác sĩ này. Hãy là người đầu tiên để lại ý kiến của bạn!
              </div>
            )}

            {/* Write a review form */}
            <div className="bg-light p-3 rounded" style={{ borderRadius: '12px' }}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <MessageSquarePlus className="text-teal" size={18} />
                <h6 className="fw-bold text-dark m-0">Gửi đánh giá và bình luận của bạn</h6>
              </div>

              <Form onSubmit={handleSubmitReview}>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group controlId="review-name">
                      <Form.Label className="small fw-semibold">Họ và tên của bạn</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Nhập họ tên của bạn..."
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="review-rating">
                      <Form.Label className="small fw-semibold">Số sao đánh giá (1-5)</Form.Label>
                      <Form.Select
                        value={reviewRating}
                        onChange={(e) => setReviewRating(Number(e.target.value))}
                      >
                        <option value={5}>⭐⭐⭐⭐⭐ (5/5 Cực kỳ hài lòng)</option>
                        <option value={4}>⭐⭐⭐⭐ (4/5 Hài lòng)</option>
                        <option value={3}>⭐⭐⭐ (3/5 Bình thường)</option>
                        <option value={2}>⭐⭐ (2/5 Không hài lòng)</option>
                        <option value={1}>⭐ (1/5 Cực kỳ thất vọng)</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group controlId="review-comment">
                      <Form.Label className="small fw-semibold">Nhận xét chi tiết</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Chia sẻ trải nghiệm của bạn về dịch vụ khám và thái độ phục vụ..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={12} className="text-end">
                    <Button
                      type="submit"
                      variant="primary"
                      className="btn-premium-main"
                      disabled={submittingReview}
                    >
                      {submittingReview ? <Spinner size="sm" animation="border" /> : 'Gửi phản hồi'}
                    </Button>
                  </Col>
                </Row>
              </Form>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DoctorDetail;
