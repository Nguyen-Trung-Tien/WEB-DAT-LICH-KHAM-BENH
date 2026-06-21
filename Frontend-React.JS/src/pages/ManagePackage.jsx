import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { Briefcase, Save } from 'lucide-react';
import { toast } from 'sonner';
import api from '../services/api.js';

const ManagePackage = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [clinicId, setClinicId] = useState('');
  const [specialtyId, setSpecialtyId] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  const [descriptionMarkdown, setDescriptionMarkdown] = useState('');
  const [descriptionHTML, setDescriptionHTML] = useState('');
  const [saving, setSaving] = useState(false);

  const [clinics, setClinics] = useState([]);
  const [specialties, setSpecialties] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resClinics = await api.get('/api/get-all-clinic');
        const resSpecs = await api.get('/api/get-all-specialty');
        if (resClinics.data && resClinics.data.errCode === 0) {
          setClinics(resClinics.data.data);
        }
        if (resSpecs.data && resSpecs.data.errCode === 0) {
          setSpecialties(resSpecs.data.data);
        }
      } catch (err) {
        console.error(err);
        toast.error('Lỗi khi tải danh sách cơ sở y tế và chuyên khoa.');
      }
    };
    fetchData();
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Vui lòng chỉ chọn file hình ảnh (PNG, JPG, JPEG).');
        return;
      }
      try {
        const base64 = await convertFileToBase64(file);
        setImageBase64(base64);
      } catch (err) {
        toast.error('Lỗi khi tải ảnh lên.');
      }
    }
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleTextareaChange = (e) => {
    const val = e.target.value;
    setDescriptionMarkdown(val);
    setDescriptionHTML(val.replace(/\n/g, '<br/>'));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name || !price || !imageBase64 || !descriptionMarkdown) {
      toast.error('Vui lòng điền đầy đủ tất cả thông tin bắt buộc.');
      return;
    }

    setSaving(true);
    try {
      const res = await api.post('/api/create-new-medical-package', {
        name,
        price,
        clinicId: clinicId || null,
        specialtyId: specialtyId || null,
        imageBase64,
        descriptionHTML,
        descriptionMarkdown,
      });

      if (res.data && res.data.errCode === 0) {
        toast.success('Tạo gói khám mới thành công!');
        setName('');
        setPrice('');
        setClinicId('');
        setSpecialtyId('');
        setImageBase64('');
        setDescriptionMarkdown('');
        setDescriptionHTML('');
        // Reset file input
        const fileInput = document.getElementById('package-image-input');
        if (fileInput) fileInput.value = '';
      } else {
        toast.error(res.data.errMessage || 'Tạo gói khám thất bại!');
      }
    } catch (err) {
      console.error(err);
      toast.error('Có lỗi hệ thống xảy ra khi lưu gói khám.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded border shadow-sm p-4">
      <div className="d-flex align-items-center gap-2 mb-4 border-bottom pb-2">
        <Briefcase className="text-primary" size={22} />
        <h4 className="fw-bold text-dark m-0">Quản lý gói khám bệnh</h4>
      </div>

      <Form onSubmit={handleSave}>
        <Row className="g-3 mb-4">
          <Col md={6}>
            <Form.Group controlId="package-name">
              <Form.Label className="fw-semibold small">Tên gói khám <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                required
                placeholder="Nhập tên gói khám y tế..."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="package-price">
              <Form.Label className="fw-semibold small">Giá gói khám (để hiển thị) <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                required
                placeholder="Ví dụ: 1.500.000đ, 2.000.000đ..."
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="package-clinic">
              <Form.Label className="fw-semibold small">Cơ sở y tế / Phòng khám</Form.Label>
              <Form.Select
                value={clinicId}
                onChange={(e) => setClinicId(e.target.value)}
              >
                <option value="">-- Chọn cơ sở y tế (Không bắt buộc) --</option>
                {clinics.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="package-specialty">
              <Form.Label className="fw-semibold small">Chuyên khoa khám bệnh</Form.Label>
              <Form.Select
                value={specialtyId}
                onChange={(e) => setSpecialtyId(e.target.value)}
              >
                <option value="">-- Chọn chuyên khoa (Không bắt buộc) --</option>
                {specialties.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={12}>
            <Form.Group controlId="package-image">
              <Form.Label className="fw-semibold small">Ảnh minh họa gói khám <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="file"
                id="package-image-input"
                required
                onChange={handleFileChange}
                accept="image/*"
              />
            </Form.Group>
          </Col>

          <Col md={12}>
            <Form.Group controlId="package-markdown">
              <Form.Label className="fw-semibold small">Mô tả chi tiết gói khám (Markdown) <span className="text-danger">*</span></Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                required
                placeholder="Nhập thông tin chi tiết về gói khám sức khỏe..."
                value={descriptionMarkdown}
                onChange={handleTextareaChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex justify-content-end">
          <Button type="submit" variant="primary" className="btn-premium-main d-flex align-items-center gap-2" disabled={saving}>
            {saving ? <Spinner size="sm" animation="border" /> : <Save size={16} />}
            <span>Lưu gói khám</span>
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ManagePackage;
