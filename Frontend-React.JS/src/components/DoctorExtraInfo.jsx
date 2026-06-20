import React, { useState, useEffect } from 'react';
import { Card, Collapse, Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { MapPin, DollarSign, CreditCard, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../services/api.js';

const DoctorExtraInfo = ({ doctorId }) => {
  const { t, i18n } = useTranslation();
  const [extraInfo, setExtraInfo] = useState({});
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    const fetchExtraInfo = async () => {
      if (!doctorId) return;
      try {
        const res = await api.get(`/api/get-extra-info-doctor-by-id?doctorId=${doctorId}`);
        if (res.data && res.data.errCode === 0) {
          setExtraInfo(res.data.data || {});
        }
      } catch (err) {
        console.error('Error fetching doctor extra info:', err);
      }
    };
    fetchExtraInfo();
  }, [doctorId]);

  const toggleDetail = () => {
    setShowDetail(!showDetail);
  };

  const formatPrice = (price) => {
    if (!price) return '0';
    // Format currency string
    return Number(price).toLocaleString('vi-VN') + ' VND';
  };

  return (
    <Card className="border shadow-sm p-3 mb-4">
      {/* Clinic address section */}
      <div className="mb-3">
        <h6 className="fw-bold text-secondary uppercase d-flex align-items-center gap-1">
          <MapPin size={16} className="text-danger" />
          <span>{t('patient.extra-info-doctor.text-address')}</span>
        </h6>
        <div className="fw-bold text-dark mb-1">{extraInfo.nameClinic || 'Tên phòng khám chưa cập nhật'}</div>
        <div className="text-secondary small">{extraInfo.addressClinic || 'Địa chỉ phòng khám chưa cập nhật'}</div>
      </div>

      <hr className="my-2 border-slate" />

      {/* Price section */}
      <div className="py-2">
        {!showDetail ? (
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
            <div className="d-flex align-items-center gap-2">
              <DollarSign size={16} className="text-success" />
              <span className="text-secondary fw-semibold">{t('patient.extra-info-doctor.price')}:</span>
              <strong className="text-danger">
                {extraInfo.priceTypeData ? formatPrice(i18n.language === 'vi' ? extraInfo.priceTypeData.valueVi : extraInfo.priceTypeData.valueEn) : '0 VND'}
              </strong>
            </div>
            <span
              onClick={toggleDetail}
              className="text-primary small cursor-pointer fw-semibold d-flex align-items-center gap-1 hover-glow"
            >
              <span>{t('patient.extra-info-doctor.detail')}</span>
              <ChevronDown size={14} />
            </span>
          </div>
        ) : (
          <div>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="fw-bold text-secondary m-0">{t('patient.extra-info-doctor.price').toUpperCase()}</h6>
              <span
                onClick={toggleDetail}
                className="text-primary small cursor-pointer fw-semibold d-flex align-items-center gap-1 hover-glow"
              >
                <span>{t('patient.extra-info-doctor.hide-price')}</span>
                <ChevronUp size={14} />
              </span>
            </div>

            <Table bordered responsive size="sm" className="bg-light mb-3">
              <tbody>
                <tr>
                  <td className="p-3 bg-white">
                    <div className="d-flex justify-content-between fw-semibold text-dark mb-1">
                      <span>Giá khám</span>
                      <span className="text-danger">
                        {extraInfo.priceTypeData ? formatPrice(i18n.language === 'vi' ? extraInfo.priceTypeData.valueVi : extraInfo.priceTypeData.valueEn) : '0 VND'}
                      </span>
                    </div>
                    <div className="text-secondary small">
                      {extraInfo.note || 'Giá khám cho dịch vụ khám chữa bệnh cơ bản.'}
                    </div>
                  </td>
                </tr>
              </tbody>
            </Table>

            <div className="d-flex align-items-center gap-2 small text-secondary">
              <CreditCard size={16} className="text-primary" />
              <span>
                <strong>{t('patient.extra-info-doctor.payment')}</strong>
                {extraInfo.paymentTypeData ? (i18n.language === 'vi' ? extraInfo.paymentTypeData.valueVi : extraInfo.paymentTypeData.valueEn) : 'Chưa xác định'}
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default DoctorExtraInfo;
