import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/connectDB.js';

class Schedule extends Model {}

Schedule.init(
  {
    currentNumber: DataTypes.INTEGER,
    maxNumber: DataTypes.INTEGER,
    date: DataTypes.STRING,
    timeType: DataTypes.STRING,
    doctorId: DataTypes.INTEGER,
  },
  {
    sequelize,
    modelName: 'Schedule',
  }
);

export default Schedule;
