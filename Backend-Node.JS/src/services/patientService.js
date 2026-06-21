import db from '../models/index.js';
import emailService from './emailService.js';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
dotenv.config();

const builtUrlEmail = (doctorId, token) => {
  return `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;
};

export const postBookAppointment = async (data) => {
  try {
    if (
      !data.email ||
      !data.doctorId ||
      !data.timeType ||
      !data.date ||
      !data.fullName ||
      !data.selectedGender ||
      !data.address
    ) {
      return {
        errCode: -1,
        errMessage: 'Missing required parameters!',
      };
    }

    const token = uuidv4();

    // Send confirmation email
    await emailService.sendSimpleEmail({
      receiveEmail: data.email,
      patientName: data.fullName,
      time: data.timeString,
      doctorName: data.doctorName,
      language: data.language,
      redirectLink: builtUrlEmail(data.doctorId, token),
    });

    // find or create patient user
    const [user, userCreated] = await db.User.findOrCreate({
      where: { email: data.email },
      defaults: {
        email: data.email,
        firstName: data.fullName,
        phoneNumber: data.phoneNumber,
        roleId: 'R3',
        gender: data.selectedGender,
        address: data.address,
      },
    });

    // create booking record (check patient, date, and doctor to avoid duplicate double booking)
    if (user) {
      await db.Booking.findOrCreate({
        where: { 
          patientId: user.id, 
          date: data.date,
          timeType: data.timeType
        },
        defaults: {
          statusId: 'S1',
          doctorId: data.doctorId,
          patientId: user.id,
          date: data.date,
          timeType: data.timeType,
          token: token,
        },
      });
    }

    return {
      errCode: 0,
      errMessage: 'Save info patient success!',
    };
  } catch (error) {
    throw error;
  }
};

export const postVerifyBookAppointment = async (data) => {
  try {
    if (!data.token || !data.doctorId) {
      return {
        errCode: -1,
        errMessage: 'Missing required parameters!',
      };
    }

    const appointment = await db.Booking.findOne({
      where: {
        doctorId: data.doctorId,
        token: data.token,
        statusId: 'S1',
      },
      raw: false,
    });

    if (appointment) {
      appointment.statusId = 'S2';
      await appointment.save();
      return {
        errCode: 0,
        errMessage: 'Update appointment success!',
      };
    } else {
      return {
        errCode: 2,
        errMessage: 'Appointment already exists or is activated!',
      };
    }
  } catch (error) {
    throw error;
  }
};

export const updateBookingStatus = async (data) => {
  try {
    if (!data.id || !data.statusId) {
      return {
        errCode: -1,
        errMessage: 'Missing required parameters (id, statusId)!',
      };
    }

    const booking = await db.Booking.findOne({
      where: { id: data.id },
      raw: false,
    });

    if (booking) {
      booking.statusId = data.statusId;
      await booking.save();
      return {
        errCode: 0,
        errMessage: 'Update booking status success!',
      };
    } else {
      return {
        errCode: 1,
        errMessage: 'Booking appointment not found!',
      };
    }
  } catch (error) {
    throw error;
  }
};

export default {
  postBookAppointment,
  postVerifyBookAppointment,
  updateBookingStatus,
};
