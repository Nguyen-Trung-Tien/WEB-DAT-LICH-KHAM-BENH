import db from '../models/index.js';

export const createMedicalPackage = async (data) => {
  try {
    if (
      !data.name ||
      !data.price ||
      !data.imageBase64 ||
      !data.descriptionHTML ||
      !data.descriptionMarkdown
    ) {
      return {
        errCode: -1,
        errMessage: 'Missing required parameters!',
      };
    }

    await db.MedicalPackage.create({
      name: data.name,
      price: data.price,
      clinicId: data.clinicId ? Number(data.clinicId) : null,
      specialtyId: data.specialtyId ? Number(data.specialtyId) : null,
      image: data.imageBase64,
      descriptionHTML: data.descriptionHTML,
      descriptionMarkdown: data.descriptionMarkdown,
    });

    return {
      errCode: 0,
      errMessage: 'OK',
    };
  } catch (error) {
    throw error;
  }
};

export const getAllMedicalPackages = async () => {
  try {
    const data = await db.MedicalPackage.findAll({
      include: [
        { model: db.Clinic, as: 'clinicData', attributes: ['name', 'address'] },
        { model: db.Specialty, as: 'specialtyData', attributes: ['name'] }
      ]
    });
    if (data && data.length > 0) {
      data.forEach((item) => {
        if (item.image) {
          if (Buffer.isBuffer(item.image)) {
            item.image = item.image.toString('binary');
          }
        }
      });
    }
    return {
      errCode: 0,
      errMessage: 'OK',
      data,
    };
  } catch (error) {
    throw error;
  }
};

export const getDetailMedicalPackageById = async (inputId) => {
  try {
    if (!inputId) {
      return {
        errCode: -1,
        errMessage: 'Missing required parameters!',
      };
    }

    let data = await db.MedicalPackage.findOne({
      where: { id: inputId },
      include: [
        { model: db.Clinic, as: 'clinicData', attributes: ['name', 'address'] },
        { model: db.Specialty, as: 'specialtyData', attributes: ['name'] }
      ]
    });

    if (data) {
      if (data.image) {
        if (Buffer.isBuffer(data.image)) {
          data.image = data.image.toString('binary');
        }
      }
      data = data.get({ plain: true });
    } else {
      data = {};
    }

    return {
      errCode: 0,
      errMessage: 'OK',
      data,
    };
  } catch (error) {
    throw error;
  }
};

export default {
  createMedicalPackage,
  getAllMedicalPackages,
  getDetailMedicalPackageById,
};
