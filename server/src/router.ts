import { Request, Response, Router } from 'express';
import MapController from './controllers/MapController';

const router = Router();

router.get('/', async (req : Request, res : Response, next) => {
  MapController.getBaseData()
    .then((mapData) => {
      res.json(mapData);
    })
    .catch((err) => {
      next(err);
    });
});

export default router;
