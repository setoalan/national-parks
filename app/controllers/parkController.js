'use strict';

angular.module('national-parks')
  .controller('ParkController', function ($scope, $stateParams, parksFactory, parkFactory) {
    $scope.park = parksFactory.getPark($stateParams.id);
    $scope.park.flickrPhotos = [];

    console.log($scope.park);

    parkFactory.fetchPhotos($scope.park.fullName.split(' ').join('+'))
      .then((response) => {
        response.forEach((photo) => {
          $scope.park.flickrPhotos.push({
            'src': `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`,
            'alt': photo.title
          });
        });
      });

    $('#parkCarousel').carousel({interval: 5000});
    $('#parkCarousel').carousel('cycle');

    $('#parkMap').append(`<iframe width="100%" height="100%" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/place?key=AIzaSyD1trrr2iGJkn3xWwKZzGoxsQ8pnJLYSrg&q=${$scope.park.fullName}&zoom=9" allowfullscreen</iframe>`);
  });
