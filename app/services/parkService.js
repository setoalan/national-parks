'use strict';

angular.module('national-parks')
  .factory('parkFactory', ($http) => {
    let parkFactory = {};

    parkFactory.fetchPhotos = (park, parkName) => {
      const data = $http.get('/park/flickr?parkName=' + parkName)
        .then((response) => {
          let photo = response.data.body.photos.photo;
          photo.forEach((photo) => {
            park.flickrPhotos.push({
              'src': `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`,
              'alt': photo.title
            });
          });
          return photo;
        }, (error) => {
          console.error('Error: ' + error);
        });
      return data;
    };

    return parkFactory;
  });
