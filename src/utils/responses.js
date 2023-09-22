const httpStatus = require('http-status');

function sendSuccess(res, message = 'Success') {
  res.status(httpStatus.OK).json({ code: httpStatus[httpStatus.OK], message });
}

function sendCreated(res, message = 'Created Successfully') {
  res.status(httpStatus.CREATED).json({ code: httpStatus[httpStatus.CREATED], message });
}

module.exports = {
  sendSuccess,
  sendCreated,
};
