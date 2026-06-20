import doctorService from '../services/doctorService.js';

export const getTopDoctorHome = async (req, res) => {
  let limit = req.query.limit;
  if (!limit) limit = 10;
  try {
    const response = await doctorService.getTopDoctorHome(+limit);
    return res.status(200).json(response);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: 'Error from server...',
    });
  }
};

export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await doctorService.getAllDoctors();
    return res.status(200).json(doctors);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: 'Error from server!',
    });
  }
};

export const postInfoDoctor = async (req, res) => {
  try {
    const response = await doctorService.saveDetailInfoDoctor(req.body);
    return res.status(200).json(response);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: 'Error from server!',
    });
  }
};

export const getDetailDoctorById = async (req, res) => {
  try {
    const info = await doctorService.getDetailDoctorById(req.query.id);
    return res.status(200).json(info);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: 'Error from server!',
    });
  }
};

export const bulkCreateSchedule = async (req, res) => {
  try {
    const info = await doctorService.bulkCreateSchedule(req.body);
    return res.status(200).json(info);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: 'Error from server!',
    });
  }
};

export const getScheduleByDate = async (req, res) => {
  try {
    const info = await doctorService.getScheduleByDate(
      req.query.doctorId,
      req.query.date
    );
    return res.status(200).json(info);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: 'Error from server!',
    });
  }
};

export const getExtraDoctorById = async (req, res) => {
  try {
    const info = await doctorService.getExtraDoctorById(req.query.doctorId);
    return res.status(200).json(info);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: 'Error from server!',
    });
  }
};

export const getProfileDoctorById = async (req, res) => {
  try {
    const info = await doctorService.getProfileDoctorById(req.query.doctorId);
    return res.status(200).json(info);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: 'Error from server!',
    });
  }
};

export const getListPatientForDoctor = async (req, res) => {
  try {
    const info = await doctorService.getListPatientForDoctor(
      req.query.doctorId,
      req.query.date
    );
    return res.status(200).json(info);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: 'Error from server!',
    });
  }
};

export const sendRemedy = async (req, res) => {
  try {
    const info = await doctorService.sendRemedy(req.body);
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
  getTopDoctorHome,
  getAllDoctors,
  postInfoDoctor,
  getDetailDoctorById,
  bulkCreateSchedule,
  getScheduleByDate,
  getExtraDoctorById,
  getProfileDoctorById,
  getListPatientForDoctor,
  sendRemedy,
};
