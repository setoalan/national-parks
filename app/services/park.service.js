'use strict';

angular.module('national-parks')
  .factory('parkFactory', ['$http', function ($http) {
    const numPhotos = 10;
    let parkFactory = {};

    parkFactory.fetchPhotos = function (parkName) {
      let data = $http.get('/park/flickr?parkName=' + parkName + '&numPhotos=' + numPhotos)
        .then(function (response) {
          return response.data.body.photos.photo;
        }, function (error) {
          console.error('Error: ' + error);
        });
      return data;
    };

    return parkFactory;
  }]);
