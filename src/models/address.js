const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const districtSchema = mongoose.Schema(
  {
    id: { type: String },
    // private: won't show in the response
    division_id: { type: String, private: true },

    name: { type: String },

    bn_name: { type: String, private: true },
    coordinates: {
      type: String,
      enum: ['Point'], // 'coordinates' must be 'Point'
      private: true,

      coordinates: [Number], // [longitude, latitude]
    },
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        // maintaing the original relation id from the csv dump
        ret['id'] = doc['id'];
      },
    },
  }
);
districtSchema.plugin(toJSON);
districtSchema.plugin(paginate);
const district = mongoose.model('District', districtSchema);

const upazillaSchema = mongoose.Schema(
  {
    id: { type: String, private: true },

    district_id: { type: String, private: true },

    name: { type: String },
    lat: { type: String, private: true },
    lon: { type: String, private: true },
    url: { type: String, private: true },
    bn_name: { type: String, private: true },
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        // maintaing the original relation id from the csv dump
        ret['id'] = doc['id'];
      },
    },
  }
);

upazillaSchema.plugin(toJSON);
upazillaSchema.plugin(paginate);
const upazilla = mongoose.model('Upazilla', upazillaSchema);

const unionSchema = mongoose.Schema(
  {
    id: { type: String },

    upazilla_id: { type: String, private: true },
    lat: { type: String, private: true },
    lon: { type: String, private: true },
    url: { type: String, private: true },
    name: { type: String },

    bn_name: { type: String, private: true },
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        // maintaing the original relation id from the csv dump
        ret['id'] = doc['id'];
      },
    },
  }
);
unionSchema.plugin(toJSON);
unionSchema.plugin(paginate);

const union = mongoose.model('Union', unionSchema);

module.exports = { union, upazilla, district };
