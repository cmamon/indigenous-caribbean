const axios = require('axios');
const dotenv = require('dotenv');
const fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');

const config = dotenv.config();

if (config.error) {
  throw config.error;
}

const places = JSON.parse(fs.readFileSync(path.join(__dirname, 'places.json')));

/* Using Mapbox to get data on the defaults places to be displayed on the font-end map. */

const geocodingAPIUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

// places.forEach((place) => {
  const url = `${geocodingAPIUrl}/${encodeURIComponent('Martinique')}.json?types=country&access_token=${process.env.MAPBOX_ACCESS_TOKEN}&limit=1`;

  axios.get(url)
    .then((res) => {
      if (res.data.features.length === 0) {
        throw new Error('Unable to find location. Try to search another location.');
      }

      const features = res.data.features[0];

      console.log(features);

      // Store data in mongoDB
      const Place = mongoose.model('Place');
      const region = new Place({
        name: features.place_name,
        indigenousNames: [],
        description: '',
        latitude: features.center[0],
        longitude: features.center[1],
      });

      region.save((err, savedRegion) => {
        if (err) {
          throw err;
        }

        console.log(savedRegion);
        return null;
      });
    })
    .catch((err) => {
      throw new Error(err.message);
    });
// });
