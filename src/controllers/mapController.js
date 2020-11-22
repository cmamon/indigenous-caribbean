const Place = require('../models/Place');

const getBaseData = () => {
  Place.find({}, (err, places) => {
    if (err) {
      throw err;
    } else {
      return places;
    }
  });
};

module.exports = { getBaseData };
