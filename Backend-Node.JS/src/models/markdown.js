import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/connectDB.js';

class Markdown extends Model {}

Markdown.init(
  {
    contentHTML: DataTypes.TEXT('long'),
    contentMarkdown: DataTypes.TEXT('long'),
    doctorId: DataTypes.INTEGER,
    description: DataTypes.TEXT('long'),
    specialtyId: DataTypes.INTEGER,
    clinicId: DataTypes.INTEGER,
  },
  {
    sequelize,
    modelName: 'Markdown',
    tableName: 'Markdowns',
  }
);

export default Markdown;
