'use strict';

angular.module('national-parks')
  .factory('parkFactory', ($http) => {
    let parkFactory = {};

    parkFactory.fetchPhotos = (parkName) => {
      let data = $http.get('/park/flickr?parkName=' + parkName)
        .then((response) => {
          return response.data.body.photos.photo;
        }, (error) => {
          console.error('Error: ' + error);
        });
      return data;
    };

    return parkFactory;
  });
