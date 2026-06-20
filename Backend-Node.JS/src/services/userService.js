import db from '../models/index.js';
import bcrypt from 'bcryptjs';

const salt = bcrypt.genSaltSync(10);

const hashUserPassword = async (password) => {
  return await bcrypt.hash(password, salt);
};

export const checkUserEmail = async (userEmail) => {
  const user = await db.User.findOne({
    where: { email: userEmail },
  });
  return !!user;
};

export const handleUserLogin = async (email, password) => {
  try {
    const userData = {};
    const isExist = await checkUserEmail(email);
    
    if (isExist) {
      const user = await db.User.findOne({
        attributes: ['id', 'email', 'roleId', 'password', 'firstName', 'lastName'],
        where: { email: email },
        raw: true,
      });

      if (user) {
        const check = await bcrypt.compare(password, user.password);
        if (check) {
          userData.errCode = 0;
          userData.errMessage = 'OK';
          delete user.password;
          userData.user = user;
        } else {
          userData.errCode = 3;
          userData.errMessage = 'Wrong password!';
        }
      } else {
        userData.errCode = 2;
        userData.errMessage = `User not found!`;
      }
    } else {
      userData.errCode = 1;
      userData.errMessage = "Your Email doesn't exist in our system. Please try another email!";
    }
    return userData;
  } catch (error) {
    throw error;
  }
};

export const getAllUsers = async (userId) => {
  try {
    let users = '';
    if (userId === 'All') {
      users = await db.User.findAll({
        attributes: {
          exclude: ['password'],
        },
      });
    } else if (userId && userId !== 'All') {
      users = await db.User.findAll({
        where: { id: userId },
        attributes: {
          exclude: ['password'],
        },
      });
    }
    return users;
  } catch (error) {
    throw error;
  }
};

export const createNewUser = async (data) => {
  try {
    const checkEmail = await checkUserEmail(data.email);
    if (checkEmail === true) {
      return {
        errCode: 1,
        errMessage: 'Your Email is already in use! Please try another email!',
      };
    }

    const hashPasswordFromBcrypt = await hashUserPassword(data.password);
    await db.User.create({
      email: data.email,
      password: hashPasswordFromBcrypt,
      firstName: data.firstName,
      lastName: data.lastName,
      address: data.address,
      phoneNumber: data.phoneNumber,
      gender: data.gender,
      roleId: data.roleId,
      positionId: data.positionId,
      image: data.avatar,
    });

    return {
      errCode: 0,
      errMessage: 'OK',
    };
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const foundUser = await db.User.findOne({
      where: { id: userId },
    });

    if (!foundUser) {
      return {
        errCode: 2,
        errMessage: "The user doesn't exist",
      };
    }

    await db.User.destroy({
      where: { id: userId },
    });

    return {
      errCode: 0,
      errMessage: 'The user is deleted!',
    };
  } catch (error) {
    throw error;
  }
};

export const updateUserData = async (data) => {
  try {
    if (!data.id || !data.roleId || !data.positionId || !data.gender) {
      return {
        errCode: 2,
        errMessage: 'Missing required parameters!',
      };
    }

    const user = await db.User.findOne({
      where: { id: data.id },
      raw: false,
    });

    if (user) {
      user.firstName = data.firstName;
      user.lastName = data.lastName;
      user.address = data.address;
      user.phoneNumber = data.phoneNumber;
      user.roleId = data.roleId;
      user.gender = data.gender;
      user.positionId = data.positionId;
      if (data.avatar) {
        user.image = data.avatar;
      }
      await user.save();

      return {
        errCode: 0,
        errMessage: 'Update the user succeeded!',
      };
    } else {
      return {
        errCode: 1,
        errMessage: "User's not found!",
      };
    }
  } catch (error) {
    throw error;
  }
};

export const getAllCodeService = async (typeInput) => {
  try {
    if (!typeInput) {
      return {
        errCode: 1,
        errMessage: 'Missing required parameters!',
      };
    }

    const allCode = await db.AllCode.findAll({
      where: { type: typeInput },
    });

    return {
      errCode: 0,
      data: allCode,
    };
  } catch (error) {
    throw error;
  }
};

export default {
  handleUserLogin,
  getAllUsers,
  createNewUser,
  deleteUser,
  updateUserData,
  getAllCodeService,
};
