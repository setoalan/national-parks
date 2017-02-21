var express = require('express');
var config = require('../config');
var Flickr = require('flickr-sdk');
var parkRouter = express.Router();

parkRouter.get('/flickr', function (req, res, next) {
  const flickr = new Flickr({
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
      per_page: req.query.numPhotos,
      sort: 'interestingness-desc'
    })
    .then(function (response) {
      res.json(response);
    });
});

module.exports = parkRouter;
