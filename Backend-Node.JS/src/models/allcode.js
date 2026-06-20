import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/connectDB.js';

class AllCode extends Model {}

AllCode.init(
  {
    keyMap: DataTypes.STRING,
    type: DataTypes.STRING,
    valueEn: DataTypes.STRING,
    valueVi: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: 'AllCode',
  }
);

export default AllCode;
