import dashboardService from '../services/dashboardService.js';

export const handleGetDashboardStats = async (req, res) => {
  try {
    const doctorId = req.query.doctorId; // Optional query param
    const info = await dashboardService.getDashboardStats(doctorId ? Number(doctorId) : null);
    return res.status(200).json(info);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: 'Error from server while fetching dashboard statistics!',
    });
  }
};

export default {
  handleGetDashboardStats,
};
