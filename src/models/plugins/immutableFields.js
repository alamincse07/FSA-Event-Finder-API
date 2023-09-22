const mongoose = require('mongoose');

module.exports = function immutableFields(schema, immutableFields = []) {
  // Define the _id field as immutable
  schema.path('_id', mongoose.Schema.Types.ObjectId).immutable(true);

  if (Array.isArray(immutableFields)) {
    immutableFields.forEach((fieldName) => {
      schema.path(fieldName).immutable(true);
    });
  }
};
