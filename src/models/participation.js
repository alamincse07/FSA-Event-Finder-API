const mongoose = require('mongoose');

const { toJSON, paginate } = require('./plugins');

const participationSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      immutable: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      immutable: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
participationSchema.plugin(toJSON);
participationSchema.plugin(paginate);

// Define a compound unique index on eventId and userId//
// participationSchema.index({ eventId: 1, userId: 1 }, { unique: true });

const Participation = mongoose.model('Participation', participationSchema);

module.exports = Participation;
