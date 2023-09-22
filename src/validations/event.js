const Joi = require('joi');
const { objectId } = require('./custom');

const eventTypes = ['Sports', 'Social Work', 'Donation', 'Tour', 'Picnic', 'Party', 'Concert', 'Others'];
const eventStatus = ['cancelled', 'completed', 'created'];
const eventProperties = {
  name: Joi.string().required(),
  description: Joi.string().required(),
  eventDate: Joi.string().required(),

  eventArea: Joi.object().keys({
    district: Joi.string().required(),
    upazilla: Joi.string().when('union', {
      is: Joi.exist(),
      then: Joi.required().messages({
        'any.required': 'upazilla is required when union is provided.',
      }),
      otherwise: Joi.optional(),
    }),
    union: Joi.string(),
  }),
  eventType: Joi.string()
    .required()
    .valid(...eventTypes),
};
const createEvent = {
  body: Joi.object().keys(eventProperties),
};

const getEvents = {
  query: Joi.object().keys({
    eventType: Joi.string().valid(...eventTypes),
    status: Joi.string().valid(...eventStatus),
    district: Joi.string(),
    upazilla: Joi.string().empty(''),
    union: Joi.string().empty(''),

    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};
const updateEvent = {
  body: Joi.object().keys({
    ...eventProperties,
    status: Joi.string().valid(...eventStatus),
  }),
};

const deleteEvent = {
  params: Joi.object().keys({
    eventId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createEvent,
  getEvents,
  updateEvent,
};
