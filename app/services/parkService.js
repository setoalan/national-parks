'use strict';

angular.module('national-parks')
  .factory('parkFactory', ($http) => {
    const numPhotos = 10;
    let parkFactory = {};

    parkFactory.fetchPhotos = (parkName) => {
      let data = $http.get('/park/flickr?parkName=' + parkName + '&numPhotos=' + numPhotos)
        .then((response) => {
          return response.data.body.photos.photo;
        }, (error) => {
          console.error('Error: ' + error);
        });
      return data;
    };

    return parkFactory;
  });
