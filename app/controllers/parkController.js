'use strict';

angular.module('national-parks')
  .controller('ParkController', function ($scope, $stateParams, parksFactory, parkFactory) {
    $scope.park = parksFactory.getPark($stateParams.id);
    $scope.isPhotosFetched = false;
    $scope.park.flickrPhotos = [];

    console.log($scope.park);

    parkFactory.fetchPhotos($scope.park, $scope.park.fullName.split(' ').join('+'))
      .then(() => $scope.isPhotosFetched = true);

    $scope.slickConfig = {
      arrows: false,
      autoplay: true,
      autoplaySpeed: 1000,
      dots: true,
      draggable: true,
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1
    };

    $('#parkMap').append(`<iframe width="100%" height="100%" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/place?key=AIzaSyD1trrr2iGJkn3xWwKZzGoxsQ8pnJLYSrg&q=${$scope.park.fullName}&zoom=9" allowfullscreen</iframe>`);
  });
