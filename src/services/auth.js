const httpStatus = require('http-status');
const tokenService = require('./token');
const userService = require('./user');
const emailService = require('./email');
const Token = require('../models/token');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
const appConfig = require('../config/appConfig');

const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid email or password');
  }
  if (!user.verified) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Account not verified');
  }
  return user;
};

const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOneAndDelete({
    token: refreshToken,
    type: tokenTypes.REFRESH,
    blacklisted: false,
  });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
};

const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await userService.getUserById(refreshTokenDoc.user);

    if (!user) {
      throw new Error('Invalid Refresh Token Request');
    }
    // delete this token
    await tokenService.deleteOldTokens(refreshTokenDoc.user, tokenTypes.REFRESH);
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid Refresh Token');
  }
};

const resetPassword = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
    const user = await userService.getUserById(resetPasswordTokenDoc.user);
    if (!user) {
      throw new Error('User not found');
    }
    await userService.updateUserById(user.id, { password: newPassword });
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
  } catch (error) {
    console.log(error);
    throw new ApiError(httpStatus.UNAUTHORIZED, error.message);
  }
};

const verifyEmail = async (verifyEmailToken) => {
  const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);

  if (verifyEmailTokenDoc.blacklisted) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Inactive Token Request');
  }
  try {
    const user = await userService.getUserById(verifyEmailTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await Token.findByIdAndUpdate(verifyEmailTokenDoc.id, { blacklisted: true });
    await userService.updateUserById(user.id, { verified: true });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};

const sendVerificationEmail = async (req) => {
  const user = await userService.getUserByEmail(req.query.email);
  if (!user || user?.verified) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid email verification attempt');
  }
  let verification;
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(user);
  if (appConfig?.env !== 'production') {
    verification = `${verifyEmailToken}`;
  } else {
    try {
      verification = `Verification email  sent`;
      await emailService.sendVerificationEmail(user.email, verifyEmailToken);
    } catch (e) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Sorry Something went wrong, verification email can't be sent`);
    }
  }

  return verification;
};

module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail,
  sendVerificationEmail,
};
