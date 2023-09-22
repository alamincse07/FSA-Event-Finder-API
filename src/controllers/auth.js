const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService } = require('../services');
const appConfig = require('../config/appConfig');
const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  if (!user) {
    res.status(httpStatus.BAD_REQUEST).json({ message: 'Failed to register', code: httpStatus.BAD_REQUEST });
  }

  res.status(httpStatus.CREATED).json({
    code: httpStatus.CREATED,
    user,
  });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.OK).json({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.status(httpStatus.OK).send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  let message = resetPasswordToken;
  if (appConfig?.env === 'production') {
    message = 'Please check email for the next instruction';
    await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  }
  res.status(httpStatus.OK).send({ message });
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.OK).send({ message: 'Password reset success' });
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verification = await authService.sendVerificationEmail(req);
  res.status(httpStatus.OK).send({
    verification,
  });
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.OK).json({ code: httpStatus.OK, message: 'Verification completed' });
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
  sendVerificationEmail,
};
