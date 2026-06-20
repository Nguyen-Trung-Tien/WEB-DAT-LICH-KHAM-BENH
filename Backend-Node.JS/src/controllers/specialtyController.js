import specialtyService from '../services/specialtyService.js';

export const createSpecialty = async (req, res) => {
  try {
    const info = await specialtyService.createSpecialty(req.body);
    return res.status(200).json(info);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: 'Error from server!',
    });
  }
};

export const getAllSpecialty = async (req, res) => {
  try {
    const info = await specialtyService.getAllSpecialty();
    return res.status(200).json(info);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: 'Error from server!',
    });
  }
};

export const getDetailSpecialtyById = async (req, res) => {
  try {
    const info = await specialtyService.getDetailSpecialtyById(
      req.query.id,
      req.query.location
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

export default {
  createSpecialty,
  getAllSpecialty,
  getDetailSpecialtyById,
};
