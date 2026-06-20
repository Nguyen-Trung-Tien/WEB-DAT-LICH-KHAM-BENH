import db from '../models/index.js';

export const createClinic = async (data) => {
  try {
    if (
      !data.name ||
      !data.address ||
      !data.imageBase64 ||
      !data.descriptionHTML ||
      !data.descriptionMarkdown
    ) {
      return {
        errCode: -1,
        errMessage: 'Missing required parameters!',
      };
    }

    await db.Clinic.create({
      name: data.name,
      address: data.address,
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

export const getAllClinic = async () => {
  try {
    const data = await db.Clinic.findAll();
    if (data && data.length > 0) {
      data.forEach((item) => {
        if (item.image) {
          try {
            item.image = Buffer.from(item.image, 'base64').toString('binary');
          } catch (e) {
            // Leave as is if already binary string
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

export const getDetailClinicById = async (inputId) => {
  try {
    if (!inputId) {
      return {
        errCode: -1,
        errMessage: 'Missing required parameters!',
      };
    }

    let data = await db.Clinic.findOne({
      where: { id: inputId },
      attributes: [
        'name',
        'address',
        'descriptionHTML',
        'descriptionMarkdown',
      ],
    });

    if (data) {
      const doctorClinic = await db.Doctor_Info.findAll({
        where: { clinicId: inputId }, // maps to clinicId in our Doctor_Info model
        attributes: ['doctorId', 'provinceId'],
      });

      data = data.get({ plain: true });
      data.doctorClinic = doctorClinic;
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
  createClinic,
  getAllClinic,
  getDetailClinicById,
};
