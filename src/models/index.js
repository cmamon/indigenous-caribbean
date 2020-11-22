const fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');

const Place = require('./Place');

const connectToDB = () => mongoose.connect(
  process.env.DATABASE_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
);

/* Using Mapbox to get data on the defaults places to be displayed on the font-end map. */

const createPlaceWithMapboxData = (features) => {
  const region = new Place({
    name: features.place_name,
    indigenousNames: [],
    description: 'test',
    latitude: features.center[0],
    longitude: features.center[1],
  });

  return region;
};

// Save place in mongoDB
const savePlace = async (place) => {
  await place.save((err) => {
    if (err) {
      throw err;
    }
  });
};

const createPlaces = async () => {
  const places = JSON.parse(fs.readFileSync(path.join(__dirname, 'places.json')));
  const geocodingClient = mbxGeocoding({ accessToken: process.env.MAPBOX_ACCESS_TOKEN });

  places.forEach((place) => {
    geocodingClient
      .forwardGeocode({
        query: place,
        types: ['country', 'region'],
      })
      .send()
      .then((res) => {
        if (res.body.features.length === 0) {
          throw new Error(`Unable to find location '${place}'. Try to search another location.`);
        }
        const features = res.body.features[0];
        const region = createPlaceWithMapboxData(features);

        savePlace(region);
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error(err.message);
      });
  });
};

// Clear the database from all of its data
const eraseDB = async () => {
  await Promise.all([
    Place.deleteMany({}),
  ]);
};

module.exports = { connectToDB, createPlaces, eraseDB };
