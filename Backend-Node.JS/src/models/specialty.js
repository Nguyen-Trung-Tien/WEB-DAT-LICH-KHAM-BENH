import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/connectDB.js';

class Specialty extends Model {}

Specialty.init(
  {
    name: DataTypes.STRING,
    descriptionHTML: DataTypes.TEXT,
    descriptionMarkdown: DataTypes.TEXT,
    image: DataTypes.TEXT('long'),
  },
  {
    sequelize,
    modelName: 'Specialty',
  }
);

export default Specialty;
