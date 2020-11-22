const express = require('express');
const mapController = require('./controllers/mapController');

const router = express.Router();

router.get('/', async (req, res, next) => {
  mapController.getBaseData()
    .then((mapData) => {
      res.json(mapData);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
