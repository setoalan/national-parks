'user strict';

import express from 'express';
import flickr from 'flickr-sdk';

const parkRouter = express.Router();

parkRouter.get('/flickr', (req, res, next) => {
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
      .then((response) => {
        res.json(response);
      });
});

module.exports = parkRouter;
