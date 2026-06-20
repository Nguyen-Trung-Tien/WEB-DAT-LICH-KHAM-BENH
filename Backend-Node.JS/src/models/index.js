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

// Define Associations

// User associations
User.belongsTo(AllCode, {
  foreignKey: 'positionId',
  targetKey: 'keyMap',
  as: 'positionData',
});
User.belongsTo(AllCode, {
  foreignKey: 'gender',
  targetKey: 'keyMap',
  as: 'genderData',
});
User.hasOne(Markdown, {
  foreignKey: 'doctorId',
});
User.hasOne(Doctor_Info, {
  foreignKey: 'doctorId',
});
User.hasMany(Schedule, {
  foreignKey: 'doctorId',
  as: 'doctorData',
});
User.hasMany(Booking, {
  foreignKey: 'patientId',
  as: 'patientData',
});

// AllCode associations
AllCode.hasMany(User, {
  foreignKey: 'positionId',
  as: 'positionData',
});
AllCode.hasMany(User, {
  foreignKey: 'gender',
  as: 'genderData',
});
AllCode.hasMany(Schedule, {
  foreignKey: 'timeType',
  as: 'timeTypeData',
});

AllCode.hasMany(Doctor_Info, {
  foreignKey: 'priceId',
  as: 'priceTypeData',
});
AllCode.hasMany(Doctor_Info, {
  foreignKey: 'provinceId',
  as: 'provinceTypeData',
});
AllCode.hasMany(Doctor_Info, {
  foreignKey: 'paymentId',
  as: 'paymentTypeData',
});

AllCode.hasMany(Booking, {
  foreignKey: 'timeType',
  as: 'timeTypeDataPatient',
});

// Booking associations
Booking.belongsTo(User, {
  foreignKey: 'patientId',
  targetKey: 'id',
  as: 'patientData',
});
Booking.belongsTo(AllCode, {
  foreignKey: 'timeType',
  targetKey: 'keyMap',
  as: 'timeTypeDataPatient',
});

// Doctor_Info associations
Doctor_Info.belongsTo(User, {
  foreignKey: 'doctorId',
});
Doctor_Info.belongsTo(AllCode, {
  foreignKey: 'priceId',
  targetKey: 'keyMap',
  as: 'priceTypeData',
});
Doctor_Info.belongsTo(AllCode, {
  foreignKey: 'provinceId',
  targetKey: 'keyMap',
  as: 'provinceTypeData',
});
Doctor_Info.belongsTo(AllCode, {
  foreignKey: 'paymentId',
  targetKey: 'keyMap',
  as: 'paymentTypeData',
});

// Markdown associations
Markdown.belongsTo(User, {
  foreignKey: 'doctorId',
});

// Schedule associations
Schedule.belongsTo(AllCode, {
  foreignKey: 'timeType',
  targetKey: 'keyMap',
  as: 'timeTypeData',
});
Schedule.belongsTo(User, {
  foreignKey: 'doctorId',
  targetKey: 'id',
  as: 'doctorData',
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
};

export default db;
