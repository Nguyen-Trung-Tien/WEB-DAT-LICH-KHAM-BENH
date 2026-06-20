import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/connectDB.js';

class Clinic extends Model {}

Clinic.init(
  {
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    descriptionHTML: DataTypes.TEXT,
    descriptionMarkdown: DataTypes.TEXT,
    image: DataTypes.TEXT,
  },
  {
    sequelize,
    modelName: 'Clinic',
  }
);

export default Clinic;
