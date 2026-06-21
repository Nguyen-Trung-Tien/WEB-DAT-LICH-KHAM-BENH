import medicalPackageService from '../services/medicalPackageService.js';

export const createMedicalPackage = async (req, res) => {
  try {
    const info = await medicalPackageService.createMedicalPackage(req.body);
    return res.status(200).json(info);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: 'Error from server!',
    });
  }
};

export const getAllMedicalPackages = async (req, res) => {
  try {
    const info = await medicalPackageService.getAllMedicalPackages();
    return res.status(200).json(info);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: 'Error from server!',
    });
  }
};

export const getDetailMedicalPackageById = async (req, res) => {
  try {
    const info = await medicalPackageService.getDetailMedicalPackageById(req.query.id);
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
  createMedicalPackage,
  getAllMedicalPackages,
  getDetailMedicalPackageById,
};
