const { DateTime } = require('luxon');

const getCurrentTimeStamp = () => {
  return DateTime.now().toUTC().valueOf();
};

const getCurrentDateTime = () => {
  return DateTime.now().toUTC();
};

const addExpriedDateTime = (duration = { minutes: 0 }) => {
  return DateTime.now().toUTC().plus(duration);
};

module.exports = {
  getCurrentTimeStamp,
  getCurrentDateTime,
  addExpriedDateTime,
};
