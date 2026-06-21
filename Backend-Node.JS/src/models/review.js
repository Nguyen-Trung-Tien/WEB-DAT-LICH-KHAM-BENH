import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/connectDB.js';

class Review extends Model {}

Review.init(
  {
    doctorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    patientName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Review',
  }
);

export default Review;
