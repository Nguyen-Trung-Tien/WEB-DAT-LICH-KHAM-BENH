import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/connectDB.js';

class MedicalPackage extends Model {}

MedicalPackage.init(
  {
    name: DataTypes.STRING,
    price: DataTypes.STRING,
    clinicId: DataTypes.INTEGER,
    specialtyId: DataTypes.INTEGER,
    descriptionHTML: DataTypes.TEXT,
    descriptionMarkdown: DataTypes.TEXT,
    image: DataTypes.TEXT('long'),
  },
  {
    sequelize,
    modelName: 'MedicalPackage',
  }
);

export default MedicalPackage;
