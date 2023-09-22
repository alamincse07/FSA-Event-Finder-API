const mongoose = require('mongoose');

const { Participation } = require('./participation');
const { toJSON, paginate } = require('./plugins');
const eventAddressSchema = new mongoose.Schema(
  {
    district: {
      type: String,
      required: true,
    },
    upazilla: {
      type: String,
    },
    union: {
      type: String,
    },
  },
  { _id: false }
);

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 5,
      maxlength: 250,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },
    eventDate: {
      type: Date,
      required: true,
      min: Date.now,
    },

    eventArea: eventAddressSchema,

    eventType: {
      type: String,
      enum: ['Sports', 'Donation', 'Tour', 'Picnic', 'Party', 'Concert', 'Others'],
      required: true,
    },
    status: {
      type: String,
      enum: ['cancelled', 'completed', 'created'],
      default: 'created',
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      immutable: true,
    },
  },
  {
    toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
    toObject: { virtuals: true },
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
eventSchema.plugin(toJSON);
eventSchema.plugin(paginate);

eventSchema.virtual('participants', {
  ref: 'Participation',
  localField: '_id',
  foreignField: 'eventId',
});

eventSchema.methods.getParticipatedUsers = async function () {
  await this.populate({
    path: 'participants',
    populate: {
      path: 'userId',
      model: 'User',
      select: 'name phone',
      transform: function (doc) {
        if (!doc?.name) {
          return null;
        }
        return { name: doc.name, phone: doc.phone };
      },
    },
  });
  return this.participants.map((participant) => {
    return participant.userId;
  });
};

// Set up a pre middleware for user deletion
eventSchema.pre('remove', async function (next) {
  // Remove all event participation created with this user
  await Participation.deleteMany({ eventId: this._id });
  next();
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
