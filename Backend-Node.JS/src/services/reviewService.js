import db from '../models/index.js';

export const createReview = async (data) => {
  try {
    if (!data.doctorId || !data.patientName || !data.rating) {
      return {
        errCode: -1,
        errMessage: 'Missing required parameters (doctorId, patientName, rating)!',
      };
    }

    const review = await db.Review.create({
      doctorId: data.doctorId,
      patientName: data.patientName,
      rating: data.rating,
      comment: data.comment || '',
    });

    return {
      errCode: 0,
      errMessage: 'Save review success!',
      data: review,
    };
  } catch (error) {
    throw error;
  }
};

export const getReviewsByDoctorId = async (doctorId) => {
  try {
    if (!doctorId) {
      return {
        errCode: -1,
        errMessage: 'Missing doctorId parameter!',
      };
    }

    const reviews = await db.Review.findAll({
      where: { doctorId: doctorId },
      order: [['createdAt', 'DESC']],
    });

    // Also get the average rating
    const aggregate = await db.Review.findAll({
      where: { doctorId: doctorId },
      attributes: [
        [db.sequelize.fn('AVG', db.sequelize.col('rating')), 'avgRating'],
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'totalReviews'],
      ],
      raw: true,
    });

    const avgRating = aggregate && aggregate[0] && aggregate[0].avgRating ? parseFloat(aggregate[0].avgRating) : 5.0;
    const totalReviews = aggregate && aggregate[0] && aggregate[0].totalReviews ? parseInt(aggregate[0].totalReviews) : 0;

    return {
      errCode: 0,
      data: reviews || [],
      ratingSummary: {
        averageRating: avgRating.toFixed(1),
        totalReviews: totalReviews,
      },
    };
  } catch (error) {
    throw error;
  }
};

export default {
  createReview,
  getReviewsByDoctorId,
};
