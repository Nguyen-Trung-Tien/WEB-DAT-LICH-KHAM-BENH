import React, { useState } from 'react';
import { Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { Bookmark, Save } from 'lucide-react';
import { toast } from 'sonner';
import api from '../services/api.js';

const ManageSpecialty = () => {
  const [name, setName] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  const [descriptionMarkdown, setDescriptionMarkdown] = useState('');
  const [descriptionHTML, setDescriptionHTML] = useState('');
  const [saving, setSaving] = useState(false);

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
    if (!name || !imageBase64 || !descriptionMarkdown) {
      toast.error('Vui lòng điền đầy đủ tất cả thông tin bắt buộc.');
      return;
    }

    setSaving(true);
    try {
      const res = await api.post('/api/create-new-specialty', {
        name,
        imageBase64,
        descriptionHTML,
        descriptionMarkdown,
      });

      if (res.data && res.data.errCode === 0) {
        toast.success('Tạo chuyên khoa mới thành công!');
        setName('');
        setImageBase64('');
        setDescriptionMarkdown('');
        setDescriptionHTML('');
        // Reset file input
        const fileInput = document.getElementById('specialty-image-input');
        if (fileInput) fileInput.value = '';
      } else {
        toast.error(res.data.errMessage || 'Tạo chuyên khoa thất bại!');
      }
    } catch (err) {
      console.error(err);
      toast.error('Có lỗi hệ thống xảy ra khi lưu chuyên khoa.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded border shadow-sm p-4">
      <div className="d-flex align-items-center gap-2 mb-4 border-bottom pb-2">
        <Bookmark className="text-primary" size={22} />
        <h4 className="fw-bold text-dark m-0">Quản lý chuyên khoa</h4>
      </div>

      <Form onSubmit={handleSave}>
        <Row className="g-3 mb-4">
          <Col md={6}>
            <Form.Group controlId="specialty-name">
              <Form.Label className="fw-semibold small">Tên chuyên khoa <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                required
                placeholder="Nhập tên chuyên khoa (Răng Hàm Mặt, Tai Mũi Họng...)..."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="specialty-image">
              <Form.Label className="fw-semibold small">Ảnh chuyên khoa <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="file"
                id="specialty-image-input"
                required
                onChange={handleFileChange}
                accept="image/*"
              />
            </Form.Group>
          </Col>

          <Col md={12}>
            <Form.Group controlId="specialty-markdown">
              <Form.Label className="fw-semibold small">Mô tả chuyên khoa (Markdown) <span className="text-danger">*</span></Form.Label>
              <Form.Control
                as="textarea"
                rows={8}
                required
                placeholder="Nhập nội dung mô tả chi tiết chuyên khoa..."
                value={descriptionMarkdown}
                onChange={handleTextareaChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex justify-content-end">
          <Button type="submit" variant="primary" className="btn-premium-main d-flex align-items-center gap-2" disabled={saving}>
            {saving ? <Spinner size="sm" animation="border" /> : <Save size={16} />}
            <span>Lưu chuyên khoa</span>
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ManageSpecialty;
