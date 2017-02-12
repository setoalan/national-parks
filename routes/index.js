var express = require('express');
var config = require('../config');
var foursquare = require('node-foursquare')(config.foursquare);
var Flickr = require('flickr-sdk');
var indexRouter = express.Router();

indexRouter.get('/', function (req, res, next) {
  res.sendFile('../public/index.html');
});

indexRouter.get('/api', function (req, res, next) {
  foursquare.Lists.getList('58955a1e44689a4313e87e7a', null, function (error, data) {
    if (error) throw error;
    res.json(data.list.listItems);
  });
});

indexRouter.get('/flickr', function (req, res, next) {
    var flickr = new Flickr({
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
        per_page: 1,
        sort: 'interestingness-desc'
      })
      .then(function (response) {
        res.json(response);
      });
});

module.exports = indexRouter;
