const config = require('../../src/config/appConfig');
const { tokenTypes } = require('../../src/config/tokens');
const tokenService = require('../../src/services/token');
const { userOne, admin } = require('./user.fixture');

const accessTokenExpires = ''; // todo: moment().add(config.jwt.accessExpirationMinutes, 'minutes');
const userOneAccessToken = tokenService.generateToken(userOne._id, accessTokenExpires, tokenTypes.ACCESS);
const adminAccessToken = tokenService.generateToken(admin._id, accessTokenExpires, tokenTypes.ACCESS);

module.exports = {
  userOneAccessToken,
  adminAccessToken,
};
