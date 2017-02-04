var express = require('express');
var config = require('../config');
var foursquare = require('node-foursquare')(config);
var indexRouter = express.Router();

indexRouter.get('/', function (req, res, next) {
  foursquare.Lists.getList('58955a1e44689a4313e87e7a', null, function (error, data) {
    if (error) throw error;
    res.send(data);
  });
});

module.exports = indexRouter;
