import sequelize from '../config/connectDB.js';
import User from './user.js';
import AllCode from './allcode.js';
import Booking from './booking.js';
import Clinic from './clinic.js';
import Doctor_Clinic_Specialty from './doctor_clinic_specialty.js';
import Doctor_Info from './doctor_info.js';
import History from './history.js';
import Markdown from './markdown.js';
import Schedule from './schedule.js';
import Specialty from './specialty.js';
import Review from './review.js';
import MedicalPackage from './medicalPackage.js';

// Define Associations

// User associations
User.hasMany(Review, {
  foreignKey: 'doctorId',
  as: 'reviewData',
  constraints: false,
});
Review.belongsTo(User, {
  foreignKey: 'doctorId',
  targetKey: 'id',
  as: 'doctorData',
  constraints: false,
});
User.belongsTo(AllCode, {
  foreignKey: 'positionId',
  targetKey: 'keyMap',
  as: 'positionData',
  constraints: false,
});
User.belongsTo(AllCode, {
  foreignKey: 'gender',
  targetKey: 'keyMap',
  as: 'genderData',
  constraints: false,
});
User.hasOne(Markdown, {
  foreignKey: 'doctorId',
  constraints: false,
});
User.hasOne(Doctor_Info, {
  foreignKey: 'doctorId',
  constraints: false,
});
User.hasMany(Schedule, {
  foreignKey: 'doctorId',
  as: 'doctorData',
  constraints: false,
});
User.hasMany(Booking, {
  foreignKey: 'patientId',
  as: 'patientData',
  constraints: false,
});

// AllCode associations
AllCode.hasMany(User, {
  foreignKey: 'positionId',
  as: 'positionData',
  constraints: false,
});
AllCode.hasMany(User, {
  foreignKey: 'gender',
  as: 'genderData',
  constraints: false,
});
AllCode.hasMany(Schedule, {
  foreignKey: 'timeType',
  as: 'timeTypeData',
  constraints: false,
});

AllCode.hasMany(Doctor_Info, {
  foreignKey: 'priceId',
  as: 'priceTypeData',
  constraints: false,
});
AllCode.hasMany(Doctor_Info, {
  foreignKey: 'provinceId',
  as: 'provinceTypeData',
  constraints: false,
});
AllCode.hasMany(Doctor_Info, {
  foreignKey: 'paymentId',
  as: 'paymentTypeData',
  constraints: false,
});

AllCode.hasMany(Booking, {
  foreignKey: 'timeType',
  as: 'timeTypeDataPatient',
  constraints: false,
});

// Booking associations
Booking.belongsTo(User, {
  foreignKey: 'patientId',
  targetKey: 'id',
  as: 'patientData',
  constraints: false,
});
Booking.belongsTo(AllCode, {
  foreignKey: 'timeType',
  targetKey: 'keyMap',
  as: 'timeTypeDataPatient',
  constraints: false,
});

// Doctor_Info associations
Doctor_Info.belongsTo(User, {
  foreignKey: 'doctorId',
  constraints: false,
});
Doctor_Info.belongsTo(AllCode, {
  foreignKey: 'priceId',
  targetKey: 'keyMap',
  as: 'priceTypeData',
  constraints: false,
});
Doctor_Info.belongsTo(AllCode, {
  foreignKey: 'provinceId',
  targetKey: 'keyMap',
  as: 'provinceTypeData',
  constraints: false,
});
Doctor_Info.belongsTo(AllCode, {
  foreignKey: 'paymentId',
  targetKey: 'keyMap',
  as: 'paymentTypeData',
  constraints: false,
});

// Markdown associations
Markdown.belongsTo(User, {
  foreignKey: 'doctorId',
  constraints: false,
});

// Schedule associations
Schedule.belongsTo(AllCode, {
  foreignKey: 'timeType',
  targetKey: 'keyMap',
  as: 'timeTypeData',
  constraints: false,
});
Schedule.belongsTo(User, {
  foreignKey: 'doctorId',
  targetKey: 'id',
  as: 'doctorData',
  constraints: false,
});

// MedicalPackage associations
MedicalPackage.belongsTo(Clinic, {
  foreignKey: 'clinicId',
  as: 'clinicData',
  constraints: false,
});
MedicalPackage.belongsTo(Specialty, {
  foreignKey: 'specialtyId',
  as: 'specialtyData',
  constraints: false,
});
Clinic.hasMany(MedicalPackage, {
  foreignKey: 'clinicId',
  as: 'packageData',
  constraints: false,
});
Specialty.hasMany(MedicalPackage, {
  foreignKey: 'specialtyId',
  as: 'packageData',
  constraints: false,
});

// Export database client interface
const db = {
  sequelize,
  User,
  AllCode,
  Booking,
  Clinic,
  Doctor_Clinic_Specialty,
  Doctor_Info,
  History,
  Markdown,
  Schedule,
  Specialty,
  Review,
  MedicalPackage,
};

export {
  sequelize,
  User,
  AllCode,
  Booking,
  Clinic,
  Doctor_Clinic_Specialty,
  Doctor_Info,
  History,
  Markdown,
  Schedule,
  Specialty,
  Review,
  MedicalPackage,
};

export default db;
