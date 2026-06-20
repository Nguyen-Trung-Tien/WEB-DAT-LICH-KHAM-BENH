import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import api from '../services/api.js';

const ProfileDoctor = ({
  doctorId,
  isShowDescriptionDoctor = true,
  dataTime,
  isShowLinkDetail = true,
  isShowPrice = false,
}) => {
  const { t, i18n } = useTranslation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!doctorId) return;
      setLoading(true);
      try {
        const res = await api.get(`/api/get-profile-doctor-by-id?doctorId=${doctorId}`);
        if (res.data && res.data.errCode === 0) {
          setProfile(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching doctor profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [doctorId]);

  const renderTimeBooking = (dataTime) => {
    if (!dataTime || !dataTime.timeTypeData) return null;
    const time = i18n.language === 'vi' ? dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn;
    const date = i18n.language === 'vi'
      ? dayjs(+dataTime.date).format('dddd - DD/MM/YYYY')
      : dayjs(+dataTime.date).locale('en').format('ddd - MM/DD/YYYY');

    return (
      <div className="text-secondary small mt-1">
        <div className="fw-semibold text-success">{time} - {date}</div>
        <div className="text-muted text-opacity-75">{t('patient.booking-modal.freeBooking')}</div>
      </div>
    );
  };

  if (loading) {
    return <div className="text-muted small">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="text-muted small">Chưa có thông tin bác sĩ.</div>;
  }

  // Build name
  const nameVi = `${profile.positionData?.valueVi || 'Bác sĩ'}, ${profile.lastName} ${profile.firstName}`;
  const nameEn = `${profile.positionData?.valueEn || 'Doctor'}, ${profile.firstName} ${profile.lastName}`;
  const displayName = i18n.language === 'vi' ? nameVi : nameEn;

  const formatPrice = (priceVal) => {
    if (!priceVal) return '0';
    return Number(priceVal).toLocaleString('vi-VN');
  };

  return (
    <div className="d-flex flex-column gap-2">
      <div className="d-flex align-items-center gap-3">
        {/* Avatar */}
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundImage: `url(${profile.image || 'https://via.placeholder.com/80'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            border: '2px solid #e2e8f0',
            flexShrink: 0,
          }}
        />

        {/* Info */}
        <div className="d-flex flex-column">
          <h5 className="fw-bold text-dark m-0 fs-6">{displayName}</h5>
          
          {isShowDescriptionDoctor ? (
            <p className="text-secondary small m-0 mt-1 line-clamp-3" style={{ maxHeight: '60px', overflow: 'hidden' }}>
              {profile.Markdown?.description || 'Giới thiệu bác sĩ chưa cập nhật.'}
            </p>
          ) : (
            renderTimeBooking(dataTime)
          )}
        </div>
      </div>

      {isShowLinkDetail && (
        <div className="text-start mt-1">
          <Link to={`/detail-doctor/${doctorId}`} className="text-primary small fw-semibold text-decoration-none hover-glow">
            Xem thêm chi tiết &rarr;
          </Link>
        </div>
      )}

      {isShowPrice && profile.Doctor_Info && (
        <div className="mt-2 text-secondary small border-top pt-2 d-flex align-items-center gap-1">
          <span>{t('patient.booking-modal.price')}</span>
          <strong className="text-danger">
            {i18n.language === 'vi'
              ? `${formatPrice(profile.Doctor_Info.priceTypeData?.valueVi)} VND`
              : `$${profile.Doctor_Info.priceTypeData?.valueEn}`}
          </strong>
        </div>
      )}
    </div>
  );
};

export default ProfileDoctor;
