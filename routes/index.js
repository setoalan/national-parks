const express = require('express'),
  config = require('../config'),
  foursquare = require('node-foursquare')(config.foursquare),
  flickrSDK = require('flickr-sdk'),
  request = require('request'),
  indexRouter = express.Router();

indexRouter.get('/', function (req, res, next) {
  res.sendFile('../public/index.html');
});

indexRouter.get('/foursquare', function (req, res, next) {
  foursquare.Lists.getList('58955a1e44689a4313e87e7a', null, function (error, response, body) {
    if (error) throw error;
    res.json(response.list.listItems);
  });
});

indexRouter.get('/flickr', function (req, res, next) {
  const flickr = new flickrSDK({
    'apiKey': config.flickr.api_key,
    'apiSecret': config.flickr.secret
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
      'Authorization': config.nps.api_key,
      'User-Agent': req.headers['user-agent']
    }
  };

  request.get(options, function (error, response, body) {
    if (error) throw error;
    res.json(JSON.parse(response.body));
  });
});

module.exports = indexRouter;
