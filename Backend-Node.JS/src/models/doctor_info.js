import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/connectDB.js';

class Doctor_Info extends Model {}

Doctor_Info.init(
  {
    doctorId: DataTypes.INTEGER,
    specialtyId: DataTypes.INTEGER,
    clinicId: DataTypes.INTEGER,
    priceId: DataTypes.STRING,
    provinceId: DataTypes.STRING,
    paymentId: DataTypes.STRING,
    nameClinic: DataTypes.STRING,
    addressClinic: DataTypes.STRING,
    note: DataTypes.STRING,
    count: DataTypes.INTEGER,
  },
  {
    sequelize,
    modelName: 'Doctor_Info',
    freezeTableName: true,
  }
);

export default Doctor_Info;
