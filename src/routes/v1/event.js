const express = require('express');
const { auth, checkOwnership } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const eventValidation = require('../../validations/event');
const eventController = require('../../controllers/event');

const router = express.Router();

router.route('/participate/:eventId').post(auth(), validate(), eventController.createEventParticipation);

router.route('/decline/:eventId').post(auth(), validate(), eventController.deleteEventParticipation);

router.route('/created-events').get(auth(), eventController.getUserCreatedEvents);

router
  .route('/')
  .post(auth(), validate(eventValidation.createEvent), eventController.createEvent)
  .get(auth(), validate(eventValidation.getEvents), eventController.getEvents);

router
  .route('/:eventId')
  .get(auth(), validate(), eventController.getEvent)
  .put(auth(), validate(eventValidation.updateEvent), checkOwnership('Event', 'owner'), eventController.updateEvent)
  .delete(auth(['admin']), eventController.deleteEvent);

module.exports = router;
