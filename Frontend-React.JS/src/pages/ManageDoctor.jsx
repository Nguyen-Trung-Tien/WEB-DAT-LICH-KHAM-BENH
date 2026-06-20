import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card, Spinner } from 'react-bootstrap';
import { useQuery } from '@tanstack/react-query';
import { Save, UserCheck, Settings } from 'lucide-react';
import { toast } from 'sonner';
import api from '../services/api.js';

const ManageDoctor = () => {
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [action, setAction] = useState('CREATE'); // CREATE or EDIT

  // Form states
  const [description, setDescription] = useState('');
  const [contentHTML, setContentHTML] = useState('');
  const [contentMarkdown, setContentMarkdown] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [nameClinic, setNameClinic] = useState('');
  const [addressClinic, setAddressClinic] = useState('');
  const [note, setNote] = useState('');
  const [specialtyId, setSpecialtyId] = useState('');
  const [clinicId, setClinicId] = useState('');

  // Dropdown lists
  const [prices, setPrices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [loadingDoctorDetail, setLoadingDoctorDetail] = useState(false);

  // Queries
  const { data: doctors = [] } = useQuery({
    queryKey: ['allDoctors'],
    queryFn: async () => {
      const res = await api.get('/api/get-all-doctors');
      return res.data.data || [];
    },
  });

  const { data: specialties = [] } = useQuery({
    queryKey: ['allSpecialties'],
    queryFn: async () => {
      const res = await api.get('/api/get-all-specialty');
      return res.data.data || [];
    },
  });

  const { data: clinics = [] } = useQuery({
    queryKey: ['allClinics'],
    queryFn: async () => {
      const res = await api.get('/api/get-all-clinic');
      return res.data.data || [];
    },
  });

  // Fetch lookups
  useEffect(() => {
    const fetchLookups = async () => {
      try {
        const [resPrice, resPayment, resProv] = await Promise.all([
          api.get('/api/allCode?type=PRICE'),
          api.get('/api/allCode?type=PAYMENT'),
          api.get('/api/allCode?type=PROVINCE'),
        ]);
        if (resPrice.data.errCode === 0) setPrices(resPrice.data.data || []);
        if (resPayment.data.errCode === 0) setPayments(resPayment.data.data || []);
        if (resProv.data.errCode === 0) setProvinces(resProv.data.data || []);
      } catch (err) {
        console.error('Error fetching lookups:', err);
      }
    };
    fetchLookups();
  }, []);

  // Pre-populate form when doctor is selected
  const handleDoctorChange = async (e) => {
    const id = e.target.value;
    setSelectedDoctorId(id);
    if (!id) {
      clearForm();
      return;
    }

    setLoadingDoctorDetail(true);
    try {
      const res = await api.get(`/api/get-detail-doctor-by-id?id=${id}`);
      if (res.data && res.data.errCode === 0) {
        const doc = res.data.data;
        
        // Markdown description
        if (doc.Markdown) {
          setAction('EDIT');
          setDescription(doc.Markdown.description || '');
          setContentHTML(doc.Markdown.contentHTML || '');
          setContentMarkdown(doc.Markdown.contentMarkdown || '');
        } else {
          setAction('CREATE');
          setDescription('');
          setContentHTML('');
          setContentMarkdown('');
        }

        // Doctor info metadata
        if (doc.Doctor_Info) {
          setSelectedPrice(doc.Doctor_Info.priceId || '');
          setSelectedPayment(doc.Doctor_Info.paymentId || '');
          setSelectedProvince(doc.Doctor_Info.provinceId || '');
          setNameClinic(doc.Doctor_Info.nameClinic || '');
          setAddressClinic(doc.Doctor_Info.addressClinic || '');
          setNote(doc.Doctor_Info.note || '');
          setSpecialtyId(doc.Doctor_Info.specialtyId || '');
          setClinicId(doc.Doctor_Info.clinicId || '');
        } else {
          setSelectedPrice('');
          setSelectedPayment('');
          setSelectedProvince('');
          setNameClinic('');
          setAddressClinic('');
          setNote('');
          setSpecialtyId('');
          setClinicId('');
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi tải thông tin chi tiết bác sĩ.');
    } finally {
      setLoadingDoctorDetail(false);
    }
  };

  const clearForm = () => {
    setAction('CREATE');
    setDescription('');
    setContentHTML('');
    setContentMarkdown('');
    setSelectedPrice('');
    setSelectedPayment('');
    setSelectedProvince('');
    setNameClinic('');
    setAddressClinic('');
    setNote('');
    setSpecialtyId('');
    setClinicId('');
  };

  const handleTextareaChange = (e) => {
    const val = e.target.value;
    setContentMarkdown(val);
    // Simple markdown to HTML conversion fallback for testing
    // In production, you would use a rich markdown parser or rich editor.
    // For our refactor, we will map markdown directly to simple paragraph HTML.
    setContentHTML(val.replace(/\n/g, '<br/>'));
  };

  const handleSaveInfo = async (e) => {
    e.preventDefault();
    if (!selectedDoctorId) {
      toast.error('Vui lòng chọn bác sĩ trước.');
      return;
    }

    try {
      const res = await api.post('/api/save-info-doctors', {
        doctorId: Number(selectedDoctorId),
        contentHTML,
        contentMarkdown,
        description,
        action,
        selectedPrice,
        selectedPayment,
        selectedProvince,
        nameClinic,
        addressClinic,
        note,
        specialtyId: Number(specialtyId),
        clinicId: Number(clinicId),
      });

      if (res.data && res.data.errCode === 0) {
        toast.success('Lưu thông tin chi tiết bác sĩ thành công!');
        setAction('EDIT');
      } else {
        toast.error(res.data.errMessage || 'Lưu thông tin thất bại!');
      }
    } catch (err) {
      console.error(err);
      toast.error('Có lỗi xảy ra trong quá trình lưu thông tin.');
    }
  };

  return (
    <div className="bg-white rounded border shadow-sm p-4">
      <div className="d-flex align-items-center gap-2 mb-4 border-bottom pb-2">
        <Settings className="text-primary" size={22} />
        <h4 className="fw-bold text-dark m-0">Thiết lập thông tin bác sĩ</h4>
      </div>

      <Form onSubmit={handleSaveInfo}>
        <Row className="mb-4">
          <Col md={6}>
            <Form.Group controlId="select-doctor">
              <Form.Label className="fw-semibold small">Chọn bác sĩ</Form.Label>
              <Form.Select value={selectedDoctorId} onChange={handleDoctorChange}>
                <option value="">-- Chọn bác sĩ để thiết lập thông tin --</option>
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.lastName} {doc.firstName} (Email: {doc.email})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {loadingDoctorDetail ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="primary" />
            <p className="text-secondary small mt-2">Đang tải thông tin...</p>
          </div>
        ) : (
          <>
            <Row className="g-3 mb-4">
              <Col md={12}>
                <Form.Group controlId="intro">
                  <Form.Label className="fw-semibold small">Mô tả giới thiệu ngắn</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Mô tả tóm tắt kinh nghiệm học vấn..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group controlId="markdown-content">
                  <Form.Label className="fw-semibold small">Thông tin giới thiệu chi tiết (Markdown)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={6}
                    placeholder="Nhập nội dung mô tả chi tiết bằng Markdown..."
                    value={contentMarkdown}
                    onChange={handleTextareaChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <h5 className="fw-bold text-secondary mb-3 border-bottom pb-2">Thông tin phòng khám & dịch vụ</h5>
            
            <Row className="g-3 mb-4">
              <Col md={4}>
                <Form.Group controlId="price">
                  <Form.Label className="fw-semibold small">Giá khám bệnh</Form.Label>
                  <Form.Select value={selectedPrice} onChange={(e) => setSelectedPrice(e.target.value)}>
                    <option value="">Chọn giá khám...</option>
                    {prices.map((p) => (
                      <option key={p.keyMap} value={p.keyMap}>
                        {p.valueVi} VND ({p.valueEn} USD)
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group controlId="payment">
                  <Form.Label className="fw-semibold small">Phương thức thanh toán</Form.Label>
                  <Form.Select value={selectedPayment} onChange={(e) => setSelectedPayment(e.target.value)}>
                    <option value="">Chọn phương thức...</option>
                    {payments.map((p) => (
                      <option key={p.keyMap} value={p.keyMap}>
                        {p.valueVi}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group controlId="province">
                  <Form.Label className="fw-semibold small">Tỉnh thành</Form.Label>
                  <Form.Select value={selectedProvince} onChange={(e) => setSelectedProvince(e.target.value)}>
                    <option value="">Chọn tỉnh thành...</option>
                    {provinces.map((p) => (
                      <option key={p.keyMap} value={p.keyMap}>
                        {p.valueVi}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group controlId="specialty">
                  <Form.Label className="fw-semibold small">Chuyên khoa</Form.Label>
                  <Form.Select value={specialtyId} onChange={(e) => setSpecialtyId(e.target.value)}>
                    <option value="">Chọn chuyên khoa...</option>
                    {specialties.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group controlId="clinic">
                  <Form.Label className="fw-semibold small">Cơ sở y tế / Phòng khám</Form.Label>
                  <Form.Select value={clinicId} onChange={(e) => setClinicId(e.target.value)}>
                    <option value="">Chọn cơ sở...</option>
                    {clinics.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group controlId="nameClinic">
                  <Form.Label className="fw-semibold small">Tên phòng khám hiển thị</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Khoa Tim Mạch - Bệnh viện Việt Đức..."
                    value={nameClinic}
                    onChange={(e) => setNameClinic(e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="addressClinic">
                  <Form.Label className="fw-semibold small">Địa chỉ phòng khám</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập địa chỉ chi tiết phòng khám..."
                    value={addressClinic}
                    onChange={(e) => setAddressClinic(e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="note">
                  <Form.Label className="fw-semibold small">Ghi chú thêm</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Lưu ý khi đi khám, mang theo hồ sơ..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end">
              <Button type="submit" variant="primary" className="btn-premium-main d-flex align-items-center gap-2">
                <Save size={16} />
                <span>Lưu thông tin</span>
              </Button>
            </div>
          </>
        )}
      </Form>
    </div>
  );
};

export default ManageDoctor;
