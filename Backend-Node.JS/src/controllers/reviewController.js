import reviewService from '../services/reviewService.js';

export const handleCreateReview = async (req, res) => {
  try {
    const info = await reviewService.createReview(req.body);
    return res.status(200).json(info);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: 'Error from server!',
    });
  }
};

export const handleGetReviews = async (req, res) => {
  try {
    const doctorId = req.query.doctorId;
    const info = await reviewService.getReviewsByDoctorId(doctorId);
    return res.status(200).json(info);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: 'Error from server!',
    });
  }
};

export default {
  handleCreateReview,
  handleGetReviews,
};
