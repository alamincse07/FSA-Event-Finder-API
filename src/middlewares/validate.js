const Joi = require('joi');
const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');

const validate = (schema) => (req, res, next) => {
  if (schema) {
    const validSchema = pick(schema, ['params', 'query', 'body']);
    const object = pick(req, Object.keys(validSchema));

    const { value, error } = Joi.compile(validSchema)
      .prefs({
        errors: { label: 'key' },
        abortEarly: false,
        stripUnknown: true,
      })
      .validate(object);

    if (error) {
      const errorMessage = error.details.map((details) => `${details.message} in ${details.path[0]}`).join(', ');
      return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
    }
    Object.assign(req, value);
  }

  return next();
};

module.exports = validate;
