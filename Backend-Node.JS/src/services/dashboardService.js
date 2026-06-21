import db from '../models/index.js';
import dayjs from 'dayjs';
import { Op } from 'sequelize';

export const getDashboardStats = async (doctorId) => {
  try {
    const stats = {};
    const bookingWhere = {};

    if (doctorId) {
      bookingWhere.doctorId = doctorId;
    }

    // 1. Basic counts
    stats.totalBookings = await db.Booking.count({ where: bookingWhere });
    stats.statusS1Count = await db.Booking.count({ where: { ...bookingWhere, statusId: 'S1' } }); // Chờ duyệt
    stats.statusS2Count = await db.Booking.count({ where: { ...bookingWhere, statusId: 'S2' } }); // Đã duyệt
    stats.statusS3Count = await db.Booking.count({ where: { ...bookingWhere, statusId: 'S3' } }); // Hoàn thành
    stats.statusS4Count = await db.Booking.count({ where: { ...bookingWhere, statusId: 'S4' } }); // Đã hủy
    
    // Custom/extra status for "Examining" (S5) if added
    stats.statusS5Count = await db.Booking.count({ where: { ...bookingWhere, statusId: 'S5' } }); // Đang khám

    if (doctorId) {
      // For doctor: get count of unique patients they have seen
      const distinctPatients = await db.Booking.findAll({
        where: bookingWhere,
        attributes: [
          [db.sequelize.fn('DISTINCT', db.sequelize.col('patientId')), 'patientId']
        ],
        raw: true,
      });
      stats.totalPatients = distinctPatients.length;
      stats.totalDoctors = 1;
      stats.totalSpecialties = 0;
      stats.totalClinics = 0;
      stats.totalPackages = 0;
    } else {
      // For Admin: get global metrics
      stats.totalPatients = await db.User.count({ where: { roleId: 'R3' } });
      stats.totalDoctors = await db.User.count({ where: { roleId: 'R2' } });
      stats.totalSpecialties = await db.Specialty.count();
      stats.totalClinics = await db.Clinic.count();
      stats.totalPackages = await db.MedicalPackage.count();
    }

    // 2. Fetch bookings to aggregate trends
    // We group bookings by date timestamp
    const allBookings = await db.Booking.findAll({
      where: bookingWhere,
      attributes: ['date', 'statusId'],
      raw: true,
    });

    // Group in memory for database independence & date formatting
    const dateMap = {};
    allBookings.forEach((b) => {
      if (!b.date) return;
      
      let dateLabel = b.date;
      // If it is a timestamp in ms
      if (!isNaN(b.date)) {
        dateLabel = dayjs(Number(b.date)).format('DD/MM/YYYY');
      } else {
        // Fallback if date is stored as string 'YYYY-MM-DD'
        dateLabel = dayjs(b.date).format('DD/MM/YYYY');
      }

      if (!dateMap[dateLabel]) {
        dateMap[dateLabel] = { date: dateLabel, total: 0, completed: 0, cancelled: 0 };
      }
      dateMap[dateLabel].total += 1;
      if (b.statusId === 'S3') {
        dateMap[dateLabel].completed += 1;
      } else if (b.statusId === 'S4') {
        dateMap[dateLabel].cancelled += 1;
      }
    });

    // Sort by date (chronological order)
    const trendData = Object.values(dateMap).sort((a, b) => {
      const aTime = dayjs(a.date, 'DD/MM/YYYY').valueOf();
      const bTime = dayjs(b.date, 'DD/MM/YYYY').valueOf();
      return aTime - bTime;
    });

    // Take the last 30 entries for display limit
    stats.trends = trendData.slice(-30);

    // 3. Status breakdown percentage distribution (Pie chart data)
    stats.statusDistribution = [
      { name: 'Chờ duyệt (New)', value: stats.statusS1Count, color: '#f43f5e' },
      { name: 'Chờ khám (Confirmed)', value: stats.statusS2Count + stats.statusS5Count, color: '#0d9488' },
      { name: 'Hoàn thành (Done)', value: stats.statusS3Count, color: '#1e3a8a' },
      { name: 'Đã hủy (Cancelled)', value: stats.statusS4Count, color: '#d97706' },
    ].filter(item => item.value > 0);

    // If empty, add placeholder
    if (stats.statusDistribution.length === 0) {
      stats.statusDistribution = [
        { name: 'Không có dữ liệu', value: 1, color: '#64748b' }
      ];
    }

    return {
      errCode: 0,
      data: stats,
    };
  } catch (error) {
    throw error;
  }
};

export default {
  getDashboardStats,
};
