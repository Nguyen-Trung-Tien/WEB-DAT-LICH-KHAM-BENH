import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/connectDB.js';

class History extends Model {}

History.init(
  {
    patientId: DataTypes.INTEGER,
    doctorId: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    files: DataTypes.TEXT,
  },
  {
    sequelize,
    modelName: 'History',
  }
);

export default History;
