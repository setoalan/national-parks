'use strict';

angular.module('national-parks')
  .factory('parkFactory', ($window, $http) => {
    let parkFactory = {};

    parkFactory.fetchPhotos = (park) => {
      const data = $http.get(`/park/flickr?parkName=${park.fullName.split(' ').join('+')}`)
        .then((response) => {
          const SM_DEVICE_MAX_WIDTH = 992;
          let photo = response.data.body.photos.photo;
          let photoSize = '';
          if ($window.innerWidth > SM_DEVICE_MAX_WIDTH) {
            photoSize = '_c';
          }
          photo.forEach((photo) => {
            park.flickrPhotos.push({
              'src': `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}${photoSize}.jpg`,
              'alt': photo.title
            });
          });
          return photo;
        }, (error) => {
          console.error('Error: ' + error);
        });
      return data;
    };

    parkFactory.fetchWeather = (park) => {
      const data = $http.get(`/park/weather?lat=${park.latLong.lat}&lon=${park.latLong.lng}`)
        .then((response) => {
          let weather = response.data.list;
          weather.forEach((day, index) => {
            if (index % 8 === 0) {
              park.weather.push(day);
            }
          });
          return weather;
        }, (error) => {
          console.error('Error: ' + error);
        });
      return data;
    };

    return parkFactory;
  });
