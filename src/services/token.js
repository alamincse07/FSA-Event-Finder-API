const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const config = require('../config/appConfig');
const userService = require('./user');
const { Token } = require('../models');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
const { getCurrentTimeStamp, addExpriedDateTime } = require('../utils/common');

const generateToken = (userId, expiresDateTime, type, secret = config.jwt.secret) => {
  const payload = {
    sub: userId,
    iat: getCurrentTimeStamp(),
    exp: expiresDateTime.valueOf() / 1000, // converting to seconds
    type,
  };
  return jwt.sign(payload, secret);
};

const deleteOldTokens = async (userId, tokenType) => {
  try {
    // Define the condition to match the documents you want to delete
    const condition = {
      user: userId.toString(),

      type: tokenType,
    };

    // Use the deleteMany method with await to delete matching documents
    const result = await Token.deleteMany(condition);
    return result;
  } catch (err) {
    console.error('Error deleting documents:', err);
    // Handle the error appropriately
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong with token regeneration');
  }
};

const saveToken = async (token, userId, expires, type, blacklisted = false) => {
  console.log(expires?.toISO());
  const tokenDoc = await Token.create({
    token,
    user: userId,
    expires: expires?.toISO(),
    type,
    blacklisted,
  });
  return tokenDoc;
};

const verifyToken = async (token, type) => {
  let tokenDoc;
  try {
    const payload = jwt.verify(token, config.jwt.secret);
    // no need to look for the access token in DB
    if (type === tokenTypes.ACCESS) {
      tokenDoc = { ...payload, user: payload.sub };
    } else {
      tokenDoc = await Token.findOne({ token, type, user: payload.sub });
      if (!tokenDoc) {
        throw new Error('Invalid Token request');
      }
    }
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new Error('Token Expired');
    }

    throw new Error(err.message);
  }

  return tokenDoc;
};

const generateAuthTokens = async (user) => {
  const accessTokenExpires = addExpriedDateTime({ minutes: config.jwt.accessExpirationMinutes });
  const accessToken = generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS);

  const refreshTokenExpires = addExpriedDateTime({ days: config.jwt.refreshExpirationDays });
  const refreshToken = generateToken(user.id, refreshTokenExpires, tokenTypes.REFRESH);
  await saveToken(refreshToken, user.id, refreshTokenExpires, tokenTypes.REFRESH);

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toISO(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toISO(),
    },
  };
};

const generateResetPasswordToken = async (email) => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email');
  }
  const expires = addExpriedDateTime({ minutes: config.jwt.resetPasswordExpirationMinutes });
  const resetPasswordToken = generateToken(user.id, expires, tokenTypes.RESET_PASSWORD);
  await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
  await saveToken(resetPasswordToken, user.id, expires, tokenTypes.RESET_PASSWORD);
  return resetPasswordToken;
};

const generateVerifyEmailToken = async (user) => {
  const expires = addExpriedDateTime({ minutes: config.jwt.verifyEmailExpirationMinutes });
  const verifyEmailToken = generateToken(user.id, expires, tokenTypes.VERIFY_EMAIL);
  // remove previus tokens
  const res = await deleteOldTokens(user.id, tokenTypes.VERIFY_EMAIL);
  await saveToken(verifyEmailToken, user.id, expires, tokenTypes.VERIFY_EMAIL);
  return verifyEmailToken;
};

module.exports = {
  generateToken,
  saveToken,
  deleteOldTokens,
  verifyToken,
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken,
};
