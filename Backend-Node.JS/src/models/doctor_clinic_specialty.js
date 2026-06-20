import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/connectDB.js';

class Doctor_Clinic_Specialty extends Model {}

Doctor_Clinic_Specialty.init(
  {
    doctorId: DataTypes.INTEGER,
    clinicId: DataTypes.INTEGER,
    specialtyId: DataTypes.INTEGER,
  },
  {
    sequelize,
    modelName: 'Doctor_Clinic_Specialty',
  }
);

export default Doctor_Clinic_Specialty;
