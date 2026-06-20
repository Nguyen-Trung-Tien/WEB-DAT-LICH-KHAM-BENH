import express from 'express';
import {
  handleLogin,
  handleGetAllUsers,
  handleCreateNewUser,
  handleEditUser,
  handleDeleteUser,
  getAllCode,
} from '../controllers/userController.js';
import {
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
} from '../controllers/doctorController.js';
import {
  postBookAppointment,
  postVerifyBookAppointment,
} from '../controllers/patientController.js';
import {
  createSpecialty,
  getAllSpecialty,
  getDetailSpecialtyById,
} from '../controllers/specialtyController.js';
import {
  createClinic,
  getAllClinic,
  getDetailClinicById,
} from '../controllers/clinicController.js';

const router = express.Router();

export const initWebRoutes = (app) => {
  // Base health check endpoint
  router.get('/', (req, res) => {
    return res.status(200).json({
      status: 'success',
      message: 'BookingCare Doctor Appointment API is running!',
      version: '5.0.0-express',
    });
  });

  // User management APIs
  router.post('/api/login', handleLogin);
  router.get('/api/get-all-users', handleGetAllUsers);
  router.post('/api/create-new-user', handleCreateNewUser);
  router.put('/api/edit-user', handleEditUser);
  router.delete('/api/delete-user', handleDeleteUser);
  router.get('/api/allCode', getAllCode);

  // Doctor APIs
  router.get('/api/top-doctor-home', getTopDoctorHome);
  router.get('/api/get-all-doctors', getAllDoctors);
  router.post('/api/save-info-doctors', postInfoDoctor);
  router.get('/api/get-detail-doctor-by-id', getDetailDoctorById);
  router.post('/api/bulk-create-schedule', bulkCreateSchedule);
  router.get('/api/get-schedule-doctor-by-date', getScheduleByDate);
  router.get('/api/get-extra-info-doctor-by-id', getExtraDoctorById);
  router.get('/api/get-profile-doctor-by-id', getProfileDoctorById);
  router.get('/api/get-list-patient-for-doctor', getListPatientForDoctor);
  router.post('/api/send-remedy', sendRemedy);

  // Patient Booking APIs
  router.post('/api/patient-book-appointment', postBookAppointment);
  router.post('/api/verify-book-appointment', postVerifyBookAppointment);

  // Specialty APIs
  router.post('/api/create-new-specialty', createSpecialty);
  router.get('/api/get-all-specialty', getAllSpecialty);
  router.get('/api/get-detail-specialty-by-id', getDetailSpecialtyById);

  // Clinic APIs
  router.post('/api/create-new-clinic', createClinic);
  router.get('/api/get-all-clinic', getAllClinic);
  router.get('/api/get-detail-clinic-by-id', getDetailClinicById);

  return app.use('/', router);
};

export default initWebRoutes;
