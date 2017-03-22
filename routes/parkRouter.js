'user strict';

import express from 'express';
import flickrSDK from 'flickr-sdk';
import request from 'request';

const parkRouter = express.Router();

parkRouter.get('/flickr', (req, res, next) => {
  const flickr = new flickrSDK({
    'apiKey': process.env.FLICKR_API_KEY,
    'apiSecret': process.env.FLICKR_SECRET
  });

  flickr
    .request()
    .media()
    .search(req.query.parkName)
    .get({
      safe_search: 1,
      media: 'photos',
      page: 1,
      per_page: 5,
      sort: 'interestingness-desc'
    })
    .then((response) => {
      res.json(response);
    });
});

parkRouter.get('/weather', (req, res, next) => {
  const options = {
    url: `http://api.openweathermap.org/data/2.5/forecast?lat=${req.query.lat}&lon=${req.query.lon}&appid=${process.env.OPEN_WEATHER_MAP_API_KEY}`
  };

  request.get(options, (error, response, body) => {
    if (error) throw error;
    res.json(JSON.parse(response.body));
  });
});

module.exports = parkRouter;
