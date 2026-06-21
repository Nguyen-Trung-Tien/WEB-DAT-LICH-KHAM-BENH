import db from '../models/index.js';

export const createSpecialty = async (data) => {
  try {
    if (
      !data.name ||
      !data.imageBase64 ||
      !data.descriptionHTML ||
      !data.descriptionMarkdown
    ) {
      return {
        errCode: -1,
        errMessage: 'Missing required parameters!',
      };
    }

    await db.Specialty.create({
      name: data.name,
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

export const getAllSpecialty = async () => {
  try {
    const data = await db.Specialty.findAll();
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

export const getDetailSpecialtyById = async (inputId, location) => {
  try {
    if (!inputId || !location) {
      return {
        errCode: -1,
        errMessage: 'Missing required parameters!',
      };
    }

    let data = await db.Specialty.findOne({
      where: { id: inputId },
      attributes: ['descriptionHTML', 'descriptionMarkdown'],
    });

    if (data) {
      // Find doctors in this specialty
      let doctorSpecialty = [];
      if (location === 'All') {
        doctorSpecialty = await db.Doctor_Info.findAll({
          where: { specialtyId: inputId },
          attributes: ['doctorId', 'provinceId'],
        });
      } else {
        // Find by location
        doctorSpecialty = await db.Doctor_Info.findAll({
          where: {
            specialtyId: inputId,
            provinceId: location,
          },
          attributes: ['doctorId', 'provinceId'],
        });
      }
      // Since Sequelize findOne might return read-only raw values or model instances,
      // we attach the doctorSpecialty property. We convert it to a plain object first.
      data = data.get({ plain: true });
      data.doctorSpecialty = doctorSpecialty;
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
  createSpecialty,
  getAllSpecialty,
  getDetailSpecialtyById,
};
