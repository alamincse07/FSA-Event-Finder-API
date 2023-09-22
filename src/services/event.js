const httpStatus = require('http-status');
const { Event } = require('../models');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/responses');

const createEvent = async (eventBody) => {
  return Event.create(eventBody);
};

const queryEvents = async (filter, options) => {
  const data = await Event.paginate(filter, options);
  return data;
};

const getEventById = async (id) => {
  return Event.findById(id);
};

const updateEventById = async (eventId, updateBody) => {
  const event = await getEventById(eventId);
  if (!event) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Event not found');
  }

  Object.assign(event, updateBody);
  await event.save();
  return event;
};

const deleteEventById = async (eventId) => {
  try {
    const event = await Event.findByIdAndDelete(eventId);
    if (!event) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Event not found');
    }

    return event;
  } catch (event) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Event not found');
  }
};

module.exports = {
  createEvent,
  queryEvents,
  getEventById,
  updateEventById,
  deleteEventById,
};
