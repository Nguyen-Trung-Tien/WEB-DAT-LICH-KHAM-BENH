import db from '../models/index.js';
import emailService from './emailService.js';
import _ from 'lodash';
import dotenv from 'dotenv';
dotenv.config();

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE || 10;

export const getTopDoctorHome = async (limitInput) => {
  try {
    const users = await db.User.findAll({
      limit: limitInput,
      where: { roleId: 'R2' },
      order: [['createdAt', 'DESC']],
      attributes: {
        exclude: ['password'],
      },
      include: [
        {
          model: db.AllCode,
          as: 'positionData',
          attributes: ['valueEn', 'valueVi'],
        },
        {
          model: db.AllCode,
          as: 'genderData',
          attributes: ['valueEn', 'valueVi'],
        },
      ],
      raw: true,
      nest: true,
    });

    // If images are stored as binary buffers, they will automatically be read.
    // If they need custom base64 formatting, we can convert it here.
    users.forEach((user) => {
      if (user.image) {
        try {
          user.image = Buffer.from(user.image, 'base64').toString('binary');
        } catch (e) {
          // If already binary, keep as is
        }
      }
    });

    return {
      errCode: 0,
      data: users,
    };
  } catch (error) {
    throw error;
  }
};

export const getAllDoctors = async () => {
  try {
    const doctors = await db.User.findAll({
      where: { roleId: 'R2' },
      attributes: {
        exclude: ['password', 'image'],
      },
    });
    return {
      errCode: 0,
      data: doctors,
    };
  } catch (error) {
    throw error;
  }
};

const checkRequiredFields = (inputData) => {
  const arrFields = [
    'doctorId',
    'contentHTML',
    'contentMarkdown',
    'action',
    'selectedPrice',
    'selectedPayment',
    'selectedProvince',
    'nameClinic',
    'addressClinic',
    'note',
    'specialtyId',
  ];

  let isValid = true;
  let element = '';
  for (let i = 0; i < arrFields.length; i++) {
    if (!inputData[arrFields[i]]) {
      isValid = false;
      element = arrFields[i];
      break;
    }
  }
  return {
    isValid: isValid,
    element: element,
  };
};

export const saveDetailInfoDoctor = async (inputData) => {
  try {
    const checkObject = checkRequiredFields(inputData);

    if (checkObject.isValid === false) {
      return {
        errCode: -1,
        errMessage: `Missing parameter: ${checkObject.element}!`,
      };
    }

    // upsert markdown
    if (inputData.action === 'CREATE') {
      await db.Markdown.create({
        contentHTML: inputData.contentHTML,
        contentMarkdown: inputData.contentMarkdown,
        description: inputData.description,
        doctorId: inputData.doctorId,
      });
    } else if (inputData.action === 'EDIT') {
      const doctorMarkdown = await db.Markdown.findOne({
        where: { doctorId: inputData.doctorId },
        raw: false,
      });

      if (doctorMarkdown) {
        doctorMarkdown.contentHTML = inputData.contentHTML;
        doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
        doctorMarkdown.description = inputData.description;
        await doctorMarkdown.save();
      }
    }

    // upsert to Doctor_Info table
    const doctorInfo = await db.Doctor_Info.findOne({
      where: { doctorId: inputData.doctorId },
      raw: false,
    });

    if (doctorInfo) {
      // update
      doctorInfo.priceId = inputData.selectedPrice;
      doctorInfo.provinceId = inputData.selectedProvince;
      doctorInfo.paymentId = inputData.selectedPayment;
      doctorInfo.nameClinic = inputData.nameClinic;
      doctorInfo.addressClinic = inputData.addressClinic;
      doctorInfo.note = inputData.note;
      doctorInfo.specialtyId = inputData.specialtyId;
      doctorInfo.clinicId = inputData.clinicId;
      await doctorInfo.save();
    } else {
      // create
      await db.Doctor_Info.create({
        doctorId: inputData.doctorId,
        priceId: inputData.selectedPrice,
        provinceId: inputData.selectedProvince,
        paymentId: inputData.selectedPayment,
        nameClinic: inputData.nameClinic,
        addressClinic: inputData.addressClinic,
        note: inputData.note,
        specialtyId: inputData.specialtyId,
        clinicId: inputData.clinicId,
      });
    }

    return {
      errCode: 0,
      errMessage: 'Save info doctor success!',
    };
  } catch (error) {
    throw error;
  }
};

export const getDetailDoctorById = async (inputId) => {
  try {
    if (!inputId) {
      return {
        errCode: -1,
        errMessage: 'Missing required parameters!',
      };
    }

    let data = await db.User.findOne({
      where: { id: inputId },
      attributes: { exclude: ['password'] },
      include: [
        {
          model: db.Markdown,
          attributes: ['description', 'contentHTML', 'contentMarkdown'],
        },
        {
          model: db.AllCode,
          as: 'positionData',
          attributes: ['valueEn', 'valueVi'],
        },
        {
          model: db.Doctor_Info,
          attributes: { exclude: ['id', 'doctorId'] },
          include: [
            {
              model: db.AllCode,
              as: 'priceTypeData',
              attributes: ['valueEn', 'valueVi'],
            },
            {
              model: db.AllCode,
              as: 'provinceTypeData',
              attributes: ['valueEn', 'valueVi'],
            },
            {
              model: db.AllCode,
              as: 'paymentTypeData',
              attributes: ['valueEn', 'valueVi'],
            },
          ],
        },
      ],
      raw: false,
      nest: true,
    });

    if (data) {
      data = data.get({ plain: true });
      if (data.image) {
        try {
          data.image = Buffer.from(data.image, 'base64').toString('binary');
        } catch (e) {
          // If not base64, keep as is
        }
      }
    } else {
      data = {};
    }

    return {
      errCode: 0,
      data: data,
    };
  } catch (error) {
    throw error;
  }
};

export const bulkCreateSchedule = async (data) => {
  try {
    if (!data.arrSchedule || !data.doctorId || !data.formatDate) {
      return {
        errCode: 1,
        errMessage: 'Missing required parameters!',
      };
    }

    let schedule = data.arrSchedule;
    if (schedule && schedule.length > 0) {
      schedule = schedule.map((item) => {
        item.maxNumber = MAX_NUMBER_SCHEDULE;
        return item;
      });
    }

    // get all existing schedules for this date
    const existing = await db.Schedule.findAll({
      where: { doctorId: data.doctorId, date: data.formatDate },
      attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
      raw: true,
    });

    // compare and find new ones to insert
    const toCreate = _.differenceWith(schedule, existing, (a, b) => {
      return a.timeType === b.timeType && String(a.date) === String(b.date);
    });

    // create new schedule records
    if (toCreate && toCreate.length > 0) {
      await db.Schedule.bulkCreate(toCreate);
    }

    return {
      errCode: 0,
      errMessage: 'OK',
    };
  } catch (error) {
    throw error;
  }
};

export const getScheduleByDate = async (doctorId, date) => {
  try {
    if (!doctorId || !date) {
      return {
        errCode: -1,
        errMessage: 'Missing required parameters!',
      };
    }

    const dataSchedule = await db.Schedule.findAll({
      where: {
        doctorId: doctorId,
        date: date,
      },
      include: [
        {
          model: db.AllCode,
          as: 'timeTypeData',
          attributes: ['valueEn', 'valueVi'],
        },
        {
          model: db.User,
          as: 'doctorData',
          attributes: ['firstName', 'lastName'],
        },
      ],
      raw: false,
      nest: true,
    });

    return {
      errCode: 0,
      errMessage: 'OK',
      data: dataSchedule || [],
    };
  } catch (error) {
    throw error;
  }
};

export const getExtraDoctorById = async (idInput) => {
  try {
    if (!idInput) {
      return {
        errCode: -1,
        errMessage: 'Missing required parameters!',
      };
    }

    const data = await db.Doctor_Info.findOne({
      where: { doctorId: idInput },
      attributes: {
        exclude: ['id', 'doctorId'],
      },
      include: [
        {
          model: db.AllCode,
          as: 'priceTypeData',
          attributes: ['valueEn', 'valueVi'],
        },
        {
          model: db.AllCode,
          as: 'provinceTypeData',
          attributes: ['valueEn', 'valueVi'],
        },
        {
          model: db.AllCode,
          as: 'paymentTypeData',
          attributes: ['valueEn', 'valueVi'],
        },
      ],
      raw: false,
      nest: true,
    });

    return {
      errCode: 0,
      data: data || {},
    };
  } catch (error) {
    throw error;
  }
};

export const getProfileDoctorById = async (inputId) => {
  try {
    if (!inputId) {
      return {
        errCode: -1,
        errMessage: 'Missing required parameters!',
      };
    }

    let data = await db.User.findOne({
      where: { id: inputId },
      attributes: { exclude: ['password'] },
      include: [
        {
          model: db.Markdown,
          attributes: ['description', 'contentHTML', 'contentMarkdown'],
        },
        {
          model: db.AllCode,
          as: 'positionData',
          attributes: ['valueEn', 'valueVi'],
        },
        {
          model: db.Doctor_Info,
          attributes: { exclude: ['id', 'doctorId'] },
          include: [
            {
              model: db.AllCode,
              as: 'priceTypeData',
              attributes: ['valueEn', 'valueVi'],
            },
            {
              model: db.AllCode,
              as: 'provinceTypeData',
              attributes: ['valueEn', 'valueVi'],
            },
            {
              model: db.AllCode,
              as: 'paymentTypeData',
              attributes: ['valueEn', 'valueVi'],
            },
          ],
        },
      ],
      raw: false,
      nest: true,
    });

    if (data) {
      data = data.get({ plain: true });
      if (data.image) {
        try {
          data.image = Buffer.from(data.image, 'base64').toString('binary');
        } catch (e) {
          // If not base64, keep as is
        }
      }
    } else {
      data = {};
    }

    return {
      errCode: 0,
      data: data,
    };
  } catch (error) {
    throw error;
  }
};

export const getListPatientForDoctor = async (doctorId, date) => {
  try {
    if (!doctorId || !date) {
      return {
        errCode: -1,
        errMessage: 'Missing required parameters!',
      };
    }

    const data = await db.Booking.findAll({
      where: {
        statusId: 'S2',
        doctorId: doctorId,
        date: date,
      },
      include: [
        {
          model: db.User,
          as: 'patientData',
          attributes: ['email', 'firstName', 'address', 'gender'],
          include: [
            {
              model: db.AllCode,
              as: 'genderData',
              attributes: ['valueEn', 'valueVi'],
            },
          ],
        },
        {
          model: db.AllCode,
          as: 'timeTypeDataPatient',
          attributes: ['valueEn', 'valueVi'],
        },
      ],
      raw: false,
      nest: true,
    });

    return {
      errCode: 0,
      data: data || [],
    };
  } catch (error) {
    throw error;
  }
};

export const sendRemedy = async (data) => {
  try {
    if (
      !data.email ||
      !data.doctorId ||
      !data.patientId ||
      !data.timeType ||
      !data.imageBase64
    ) {
      return {
        errCode: -1,
        errMessage: 'Missing required parameters!',
      };
    }

    // update patient booking status to "Done" (S3)
    const appointment = await db.Booking.findOne({
      where: {
        doctorId: data.doctorId,
        patientId: data.patientId,
        timeType: data.timeType,
        statusId: 'S2',
      },
      raw: false,
    });

    if (appointment) {
      appointment.statusId = 'S3';
      await appointment.save();
    }

    // send remedy & invoice attachment email
    await emailService.sendAttachment(data);

    return {
      errCode: 0,
      errMessage: 'OK',
    };
  } catch (error) {
    throw error;
  }
};

export default {
  getTopDoctorHome,
  getAllDoctors,
  saveDetailInfoDoctor,
  getDetailDoctorById,
  bulkCreateSchedule,
  getScheduleByDate,
  getExtraDoctorById,
  getProfileDoctorById,
  getListPatientForDoctor,
  sendRemedy,
};
