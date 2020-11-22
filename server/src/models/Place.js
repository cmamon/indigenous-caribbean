const mongoose = require('mongoose');

const requiredNumber = {
  type: Number,
  required: true,
};

const requiredString = {
  type: String,
  required: true,
};

const placeSchema = new mongoose.Schema(
  {
    name: requiredString,
    indigenousNames: {
      type: [String],
      required: true,
    },
    description: requiredString,
    latitude: requiredNumber,
    longitude: requiredNumber,
  },
  { timestamps: true },
);

const Place = mongoose.model('Place', placeSchema);
module.exports = Place;
