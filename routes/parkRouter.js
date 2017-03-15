const express = require('express');
const Flickr = require('flickr-sdk');
const parksRouter = express.Router();

parksRouter.get('/flickr', function (req, res, next) {
    const flickr = new Flickr({
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
        per_page: Number(req.query.numPhotos),
        sort: 'interestingness-desc'
      })
      .then(function (response) {
        res.json(response);
      });
});

module.exports = parksRouter;
