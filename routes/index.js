'user strict';

import express from 'express';
import flickrSDK from 'flickr-sdk';
import request from 'request';

const foursquareSecrets = {
  secrets: {
    clientId: process.env.FOURSQUARE_CLIENT_ID,
    clientSecret: process.env.FOURSQUARE_CLIENT_SECRET,
    redirectUrl: process.env.FOURSQUARE_REDIRECT_URL
  }
};
const foursquare = require('node-foursquare')(foursquareSecrets);

const indexRouter = express.Router();

indexRouter.get('/', function (req, res, next) {
  res.sendFile('../public/index.html');
});

indexRouter.get('/foursquare', function (req, res, next) {
  const FOURSQUARE_LIST_ID = '58955a1e44689a4313e87e7a';
  foursquare.Lists.getList(FOURSQUARE_LIST_ID, null, function (error, response, body) {
    if (error) throw error;
    res.json(response.list.listItems);
  });
});

indexRouter.get('/flickr', function (req, res, next) {
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
      per_page: 2,
      sort: 'interestingness-desc'
    })
    .then(function (response) {
      res.json(response);
    });
});

indexRouter.get('/nps', function (req, res, next) {
  const options = {
    url: 'https://developer.nps.gov/api/v0/parks?q=national%20park&fields=images&limit=62',
    headers: {
      'Authorization': process.env.NPS_API_KEY,
      'User-Agent': req.headers['user-agent']
    }
  };

  request.get(options, function (error, response, body) {
    if (error) throw error;
    res.json(JSON.parse(response.body));
  });
});

module.exports = indexRouter;
