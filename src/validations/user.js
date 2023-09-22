const Joi = require('joi');
const { objectId } = require('./custom');

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    verified: Joi.boolean(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      phone: Joi.string(),
      name: Joi.string(),
    })
    .min(1),
};
const updateUserRole = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    role: Joi.string().required().valid('admin', 'user'),
  }),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  getUsers,
  getUser,
  updateUserRole,
  updateUser,
  deleteUser,
};
