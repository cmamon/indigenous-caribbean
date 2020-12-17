import Place from '../entity/Place';

export default class MapController {
  static getBaseData = async () => {
    const places = await Place.find();

    return places;
  };
}
