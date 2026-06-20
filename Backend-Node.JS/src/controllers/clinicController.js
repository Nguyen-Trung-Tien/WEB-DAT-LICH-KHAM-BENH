import clinicService from '../services/clinicService.js';

export const createClinic = async (req, res) => {
  try {
    const info = await clinicService.createClinic(req.body);
    return res.status(200).json(info);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: 'Error from server!',
    });
  }
};

export const getAllClinic = async (req, res) => {
  try {
    const info = await clinicService.getAllClinic();
    return res.status(200).json(info);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: 'Error from server!',
    });
  }
};

export const getDetailClinicById = async (req, res) => {
  try {
    const info = await clinicService.getDetailClinicById(req.query.id);
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
  createClinic,
  getAllClinic,
  getDetailClinicById,
};
