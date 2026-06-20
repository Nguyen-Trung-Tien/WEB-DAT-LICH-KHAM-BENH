import patientService from '../services/patientService.js';

export const postBookAppointment = async (req, res) => {
  try {
    const info = await patientService.postBookAppointment(req.body);
    return res.status(200).json(info);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: 'Error from server!',
    });
  }
};

export const postVerifyBookAppointment = async (req, res) => {
  try {
    const info = await patientService.postVerifyBookAppointment(req.body);
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
  postBookAppointment,
  postVerifyBookAppointment,
};
