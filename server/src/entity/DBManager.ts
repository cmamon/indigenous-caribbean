import 'reflect-metadata';
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';

import Place from './Place';
import placesJson from './places.json';

export default class DBManager {
/* Using Mapbox to get data on the defaults places to be displayed on the font-end map. */

  // Create and save place in PostreSQL with base info combined with Mapbox data
  static createPlaceWithMapboxData = async (features: any, placeJson: any) => {
    const region = await Place.create({
      name: features.place_name,
      indigenousNames: placeJson.indigenousNames,
      indigenousPeople: placeJson.indigenousPeople,
      indigenousNameMeaning: placeJson.indigenousNameMeaning,
      latitude: features.center[0],
      longitude: features.center[1],
    }).save();

    return region;
  };

  static createPlaces = async () => {
    const geocodingClient = mbxGeocoding({ accessToken: process.env.MAPBOX_ACCESS_TOKEN || '' });

    placesJson.forEach((placeJson: any) => {
      geocodingClient
        .forwardGeocode({
          query: placeJson.name,
          types: ['country', 'region'],
          mode: 'mapbox.places',
        })
        .send()
        .then(async (res) => {
          if (res.body.features.length === 0) {
            throw new Error(`Unable to find location '${placeJson.name}'.`);
          }
          const features = res.body.features[0];
          await DBManager.createPlaceWithMapboxData(features, placeJson);
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.error(err.message);
        });
    });
  };
}
