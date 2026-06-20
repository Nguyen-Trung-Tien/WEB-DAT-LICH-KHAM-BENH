import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/connectDB.js';

class Booking extends Model {}

Booking.init(
  {
    statusId: DataTypes.STRING,
    doctorId: DataTypes.INTEGER,
    patientId: DataTypes.INTEGER,
    date: DataTypes.STRING,
    timeType: DataTypes.STRING,
    token: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: 'Bookings', // keep model name Bookings to match old schema
  }
);

export default Booking;
