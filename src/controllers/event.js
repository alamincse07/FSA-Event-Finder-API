const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { eventService, eventParticipationService } = require('../services');

const createEvent = catchAsync(async (req, res) => {
  const eventDto = {
    name: req.body.name,
    description: req.body.description,
    eventType: req.body.eventType,
    owner: req.user.id,
    eventDate: req.body.eventDate,
    eventArea: {
      district: req.body?.eventArea?.district || '',
      upazilla: req.body?.eventArea?.upazilla || '',
      union: req.body?.eventArea?.union || '',
    },
  };

  const event = await eventService.createEvent(eventDto);
  res.status(httpStatus.CREATED).json(event);
});

const getEvents = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['eventType', 'status']);
  let addressFilter = pick(req.query, ['upazilla', 'union', 'district']);
  // make nested field query pattern for eventArea
  addressFilter = Object.keys(addressFilter).reduce((acc, oldKey) => {
    const newKey = `eventArea.${oldKey}`;
    acc[newKey] = addressFilter[oldKey];
    return acc;
  }, {});

  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await eventService.queryEvents({ ...filter, ...addressFilter }, options);
  res.send(result);
});

const getEvent = catchAsync(async (req, res) => {
  const event = await eventService.getEventById(req.params.eventId);

  if (Boolean(req?.query?.showParticipants === 'true')) {
    // Access the participated user names using the virtual method
    event['participants'] = [];
    const participatedUsers = await event.getParticipatedUsers();
    if (participatedUsers && participatedUsers.length) {
      event['participants'] = participatedUsers;
    }
  }

  if (!event) {
    throw new ApiError(httpStatus.NOT_FOUND, 'event not found');
  }

  res.status(httpStatus.OK).json(event);
});

const updateEvent = catchAsync(async (req, res) => {
  const event = await eventService.updateEventById(req.params.eventId, req.body);
  res.status(httpStatus.OK).json(event);
});

const deleteEvent = catchAsync(async (req, res) => {
  await eventService.deleteEventById(req.params.eventId);
  res.status(httpStatus.OK).json({ code: httpStatus.OK, message: 'Successfully deleted' });
});

//  eventParticipationService starts
const createEventParticipation = catchAsync(async (req, res) => {
  const status = await eventParticipationService.createEventParticipation(req.params.eventId, req.user.id);
  res.status(httpStatus.OK).json({ code: httpStatus.OK, message: 'Participation successfull' });
});

const deleteEventParticipation = catchAsync(async (req, res) => {
  await eventParticipationService.deleteEventParticipation(req.params.eventId, req.user.id);
  res.status(httpStatus.OK).json({ code: httpStatus.OK, message: 'Success' });
});

const getUserCreatedEvents = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const filter = { owner: req.user.id };
  const result = await eventService.queryEvents(filter, options);
  res.send(result);
});

module.exports = {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  getUserCreatedEvents,
  deleteEvent,
  createEventParticipation,
  deleteEventParticipation,
};

// participate oposite = decline
