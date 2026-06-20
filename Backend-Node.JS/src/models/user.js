import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/connectDB.js';

class User extends Model {}

User.init(
  {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    address: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    gender: DataTypes.STRING,
    image: DataTypes.BLOB,
    roleId: DataTypes.STRING,
    positionId: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: 'User',
  }
);

export default User;
