'use strict';

angular.module('national-parks')
  .controller('ParkController', function ($scope, $stateParams, parksFactory, parkFactory) {
    $scope.park = parksFactory.getPark($stateParams.id);
    $scope.park.photos = [];

    parkFactory.fetchPhotos($scope.park.venue.name.split(' ').join('+'))
      .then((response) => {
        response.forEach((photo) => {
          $scope.park.photos.push({
            'src': `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`,
            'alt': photo.title
          });
          // $('#parkCarousel').carousel({ interval: 2000 });
          // $('#parkCarousel').carousel('cycle');
        });
      });
  });
