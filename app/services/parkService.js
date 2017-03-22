'use strict';

angular.module('national-parks')
  .factory('parkFactory', ($http) => {
    let parkFactory = {};

    parkFactory.fetchPhotos = (park) => {
      const data = $http.get(`/park/flickr?parkName=${park.fullName.split(' ').join('+')}`)
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
  })
  .filter('temperatureFilter', () => {
    return (input) => {
      return (1.8 * (input - 273) + 32).toFixed(1);
    };
  });
