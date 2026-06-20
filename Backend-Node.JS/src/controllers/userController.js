import userService from '../services/userService.js';

export const handleLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
      return res.status(400).json({
        errCode: 1,
        message: 'Missing input parameters!',
      });
    }

    const userData = await userService.handleUserLogin(email, password);
    return res.status(200).json({
      errCode: userData.errCode,
      message: userData.errMessage,
      user: userData.user ? userData.user : {},
    });
  } catch (error) {
    return res.status(500).json({
      errCode: -1,
      message: 'Internal server error',
    });
  }
};

export const handleGetAllUsers = async (req, res) => {
  try {
    const id = req.query.id;
    if (!id) {
      return res.status(400).json({
        errCode: 1,
        errMessage: 'Missing required parameters!',
        users: [],
      });
    }
    const users = await userService.getAllUsers(id);

    return res.status(200).json({
      errCode: 0,
      errMessage: 'OK',
      users,
    });
  } catch (error) {
    return res.status(500).json({
      errCode: -1,
      message: 'Internal server error',
    });
  }
};

export const handleCreateNewUser = async (req, res) => {
  try {
    const message = await userService.createNewUser(req.body);
    return res.status(200).json(message);
  } catch (error) {
    return res.status(500).json({
      errCode: -1,
      message: 'Internal server error',
    });
  }
};

export const handleEditUser = async (req, res) => {
  try {
    const message = await userService.updateUserData(req.body);
    return res.status(200).json(message);
  } catch (error) {
    return res.status(500).json({
      errCode: -1,
      message: 'Internal server error',
    });
  }
};

export const handleDeleteUser = async (req, res) => {
  try {
    if (!req.body.id) {
      return res.status(400).json({
        errCode: 1,
        message: 'Missing required parameters!',
      });
    }
    const message = await userService.deleteUser(req.body.id);
    return res.status(200).json(message);
  } catch (error) {
    return res.status(500).json({
      errCode: -1,
      message: 'Internal server error',
    });
  }
};

export const getAllCode = async (req, res) => {
  try {
    const data = await userService.getAllCodeService(req.query.type);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      errCode: -1,
      errMessage: 'Error from service',
    });
  }
};

export default {
  handleLogin,
  handleGetAllUsers,
  handleCreateNewUser,
  handleEditUser,
  handleDeleteUser,
  getAllCode,
};
