const db = require("../models");
const helpers = require("../utils/helper");
const { Op } = require("sequelize");

const HttpStatus = require("../enums/httpStatusCode.enum");
const ResponseMessages = require("../enums/responseMessages.enum");

const authController = {};

// REGISTER
authController.register = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    // validation
    if (!name || !email || !password) {
      return res.error(
        HttpStatus.BAD_REQUEST,
        false,
        ResponseMessages.INSUFFICIENT_DATA,
      );
    }

    // check existing user
    const existingUser = await db.User.findOne({
      where: { email },
    });

    if (existingUser) {
      return res.error(
        HttpStatus.CONFLICT,
        false,
        ResponseMessages.EMAIL_EXISTS,
      );
    }

    // hash password
    const hashedPassword = helpers.hash(password);

    // create user
    const user = await db.User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: role || "user",
    });

    return res.success(HttpStatus.CREATED, true, ResponseMessages.SAVE, user);
  } catch (error) {
    console.log(error);

    return res.error(
      HttpStatus.INTERNAL_SERVER_ERROR,
      false,
      ResponseMessages.INTERNAL_SERVER_ERROR,
      error.message,
    );
  }
};

// LOGIN
authController.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res.error(
        HttpStatus.BAD_REQUEST,
        false,
        ResponseMessages.INSUFFICIENT_DATA,
      );
    }

    // check user
    const user = await db.User.findOne({
      where: { email },
    });

    if (!user) {
      return res.error(
        HttpStatus.NOT_FOUND,
        false,
        ResponseMessages.LOGIN_FAILED,
      );
    }

    // compare password
    const hashedPassword = helpers.hash(password);

    if (hashedPassword !== user.password) {
      return res.error(
        HttpStatus.BAD_REQUEST,
        false,
        ResponseMessages.PASSWORD_NOT_MATCH,
      );
    }

    // generate token
    const token = helpers.generateToken({
      id: user.id,
      role: user.role,
    });

    return res.success(HttpStatus.OK, true, ResponseMessages.LOGIN_SUCCESS, {
      token,
      user,
    });
  } catch (error) {
    console.log(error);

    return res.error(
      HttpStatus.INTERNAL_SERVER_ERROR,
      false,
      ResponseMessages.INTERNAL_SERVER_ERROR,
      error.message,
    );
  }
};

// GET PROFILE
authController.getProfile = async (req, res) => {
  try {
    return res.success(
      HttpStatus.OK,
      true,
      ResponseMessages.DATA_RETRIEVED_SUCCESSFULLY,
      req.user,
    );
  } catch (error) {
    return res.error(
      HttpStatus.INTERNAL_SERVER_ERROR,
      false,
      ResponseMessages.INTERNAL_SERVER_ERROR,
      error.message,
    );
  }
};

module.exports = authController;
