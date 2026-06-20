import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Spinner } from 'react-bootstrap';
import { toast } from 'sonner';

const RemedyModal = ({ isOpenModal, closeRemedyModal, dataModal, onSendRemedy }) => {
  const [email, setEmail] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (dataModal) {
      setEmail(dataModal.email || '');
      setImageBase64('');
    }
  }, [dataModal]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size and type
      if (!file.type.startsWith('image/')) {
        toast.error('Vui lòng chỉ tải lên file hình ảnh (PNG, JPG, JPEG).');
        return;
      }
      try {
        const base64 = await convertFileToBase64(file);
        setImageBase64(base64);
      } catch (err) {
        toast.error('Lỗi khi đọc file.');
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

  const handleSend = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Vui lòng nhập email bệnh nhân.');
      return;
    }
    if (!imageBase64) {
      toast.error('Vui lòng chọn ảnh đơn thuốc/hóa đơn đính kèm.');
      return;
    }

    setSending(true);
    try {
      await onSendRemedy({
        email,
        imgBase64: imageBase64,
      });
      closeRemedyModal();
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal show={isOpenModal} onHide={closeRemedyModal} centered>
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold text-main-color">Gửi đơn thuốc & hóa đơn khám</Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSend}>
        <Modal.Body className="px-4">
          <Row className="g-3">
            <Col md={12}>
              <Form.Group controlId="patient-email">
                <Form.Label className="fw-semibold small">Email bệnh nhân</Form.Label>
                <Form.Control
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group controlId="remedy-file">
                <Form.Label className="fw-semibold small">Chọn ảnh đơn thuốc / hoá đơn</Form.Label>
                <Form.Control
                  type="file"
                  required
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="outline-secondary" onClick={closeRemedyModal} disabled={sending}>
            Hủy
          </Button>
          <Button variant="primary" type="submit" className="btn-premium-main d-flex align-items-center gap-2" disabled={sending}>
            {sending && <Spinner size="sm" animation="border" />}
            <span>Gửi hóa đơn</span>
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default RemedyModal;
