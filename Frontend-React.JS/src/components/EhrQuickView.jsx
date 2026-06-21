import React from 'react';
import { Button, Card, Badge } from 'react-bootstrap';
import { X, FileText, Clipboard, Pill, AlertCircle } from 'lucide-react';

const EhrQuickView = ({ isOpen, onClose, patientId, patientName }) => {
  // Mock EHR records based on patientId to simulate dynamic patient histories
  const getMockHistory = (id) => {
    if (!id) return [];
    
    // Seeded mock records
    const recordSets = [
      [
        {
          date: '12/05/2026',
          diagnostics: 'Viêm họng hạt cấp tính, ho khan kéo dài',
          prescription: 'Amoxicillin 500mg (10 viên, uống sáng/tối), Paracetamol 500mg (khi sốt), siro ho Bảo Thanh.',
          doctorName: 'ThS. Nguyễn Trung Tiến',
          clinic: 'Bệnh viện Hữu nghị Việt Đức'
        },
        {
          date: '20/03/2026',
          diagnostics: 'Khám sức khỏe tổng quát định kỳ',
          prescription: 'Không có chỉ định thuốc đặc trị. Khuyên dùng thêm vitamin tổng hợp và tập thể dục đều đặn.',
          doctorName: 'PGS. TS. Trần Hoàng Nam',
          clinic: 'Phòng khám Đa khoa Quốc tế'
        }
      ],
      [
        {
          date: '04/06/2026',
          diagnostics: 'Rối loạn tiền đình nhẹ, mất ngủ kéo dài',
          prescription: 'Ginkgo Biloba 120mg (uống 1 viên sau ăn sáng), Mimosa (2 viên trước khi ngủ).',
          doctorName: 'GS. TS. Nguyễn Văn B',
          clinic: 'Bệnh viện Hữu nghị Việt Đức'
        },
        {
          date: '10/01/2026',
          diagnostics: 'Viêm dạ dày trào ngược (GERD)',
          prescription: 'Nexium 40mg (uống trước ăn sáng 30p), Gaviscon (uống sau các bữa ăn chính). Tránh đồ cay nóng.',
          doctorName: 'ThS. Đỗ Thị Thu C',
          clinic: 'Bệnh viện Bạch Mai'
        }
      ],
      [
        {
          date: '18/04/2026',
          diagnostics: 'Đau dây thần kinh tọa, đau mỏi thắt lưng',
          prescription: 'Meloxicam 15mg (1 viên/ngày), Mydocalm 150mg (sáng/tối), dán salonpas giảm đau tại chỗ.',
          doctorName: 'PGS. TS. Lê Văn D',
          clinic: 'Bệnh viện Hữu nghị Việt Đức'
        }
      ]
    ];

    // Return one of the mock sets depending on ID parity
    return recordSets[id % recordSets.length];
  };

  const history = getMockHistory(Number(patientId));

  return (
    <div className={`ehr-drawer ${isOpen ? 'open' : ''}`}>
      {/* Drawer Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <div className="d-flex align-items-center gap-2">
          <FileText className="text-teal" size={22} />
          <h5 className="fw-bold text-dark m-0">Hồ sơ bệnh án (EHR)</h5>
        </div>
        <Button variant="link" className="text-secondary p-0" onClick={onClose}>
          <X size={22} />
        </Button>
      </div>

      {/* Patient info tóm tắt */}
      <div className="bg-light p-3 rounded mb-4" style={{ borderRadius: '12px' }}>
        <div className="small text-secondary">Họ tên bệnh nhân:</div>
        <h5 className="fw-bold text-dark text-capitalize mb-1">{patientName || 'N/A'}</h5>
        <div className="small text-secondary">Mã số EHR: <strong className="text-dark">EHR-{patientId || '0000'}</strong></div>
      </div>

      <h6 className="fw-bold text-dark mb-3">Lịch sử khám chữa bệnh</h6>
      
      {/* Timeline of records */}
      <div className="ehr-timeline d-flex flex-column gap-3">
        {history.length > 0 ? (
          history.map((item, idx) => (
            <Card key={idx} className="border-0 shadow-sm p-3 bg-white" style={{ borderRadius: '12px', borderLeft: '4px solid var(--primary-color)' }}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Badge bg="teal" className="bg-main-color small">{item.date}</Badge>
                <span className="small text-muted">{item.clinic}</span>
              </div>
              
              <div className="mb-2">
                <div className="small text-muted d-flex align-items-center gap-1">
                  <Clipboard size={12} />
                  <span>Chẩn đoán lâm sàng:</span>
                </div>
                <div className="fw-bold text-dark small">{item.diagnostics}</div>
              </div>

              <div className="mb-2">
                <div className="small text-muted d-flex align-items-center gap-1">
                  <Pill size={12} />
                  <span>Đơn thuốc chỉ định:</span>
                </div>
                <div className="text-secondary small leading-relaxed italic">"{item.prescription}"</div>
              </div>

              <div className="text-end text-muted small mt-1 border-top pt-2">
                Bác sĩ kê đơn: <strong className="text-dark">{item.doctorName}</strong>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-4 text-muted small d-flex flex-column align-items-center gap-2">
            <AlertCircle size={28} className="text-secondary opacity-50" />
            <span>Chưa có dữ liệu bệnh án trước đó của bệnh nhân này trên hệ thống.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EhrQuickView;
