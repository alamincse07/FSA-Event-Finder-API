const httpStatus = require('http-status');
const { Participation } = require('../models');
const ApiError = require('../utils/ApiError');

const createEventParticipation = async (eventId, userId) => {
  try {
    const status = await Participation.create({ eventId, userId });
    return status;
  } catch (error) {
    if (error.code === 11000 || error.code === 11001) {
      // Handle duplicate key error
      throw new ApiError(httpStatus.CONFLICT, 'User Already Participated for this Event');
    } else {
      // Handle other errors
      console.error(error);
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong');
    }
  }
};

const queryEventParticipation = async (filter, options) => {
  const participations = await Participation.paginate(filter, options);
  return participations;
};

const deleteEventParticipation = async (eventId, userId) => {
  const participation = await Participation.findOneAndDelete({ eventId, userId });
  if (!participation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Event participation for User not found');
  }
  return participation;
};

module.exports = {
  queryEventParticipation,
  deleteEventParticipation,
  createEventParticipation,
};
