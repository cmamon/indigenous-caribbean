const axios = require('axios');
const fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');

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
  await place.save((err, savedPlace) => {
    if (err) {
      throw err;
    }

    console.log(savedPlace);
    return null;
  });
};

const createPlaces = async () => {
  const places = JSON.parse(fs.readFileSync(path.join(__dirname, 'places.json')));
  const geocodingAPIUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

  places.forEach((place) => {
    const url = `${geocodingAPIUrl}/${encodeURIComponent(place)}.json?types=country,region&access_token=${process.env.MAPBOX_ACCESS_TOKEN}&limit=1`;

    axios.get(url)
      .then((res) => {
        if (res.data.features.length === 0) {
          throw new Error('Unable to find location. Try to search another location.');
        }

        const features = res.data.features[0];
        const region = createPlaceWithMapboxData(features);

        savePlace(region);
      })
      .catch((err) => {
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
