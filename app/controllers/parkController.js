'use strict';

angular.module('national-parks')
  .controller('ParkController', function ($rootScope, $scope, $stateParams, $sce, $document, parksFactory, parkFactory) {
    $scope.park = parksFactory.getPark($stateParams.id);
    $rootScope.pageTitle = `${$scope.park.fullName} | U.S. National Parks`;
    $scope.isPhotosFetched = false;
    $scope.mapIsClicked = false;
    $scope.park.flickrPhotos = [];
    $scope.park.weather = [];

    $scope.sanitizeSnippet = (snippit) => {
      return $sce.trustAsHtml(snippit);
    };

    parkFactory.fetchPhotos($scope.park)
      .then(() => $scope.isPhotosFetched = true);

    $scope.slickConfig = {
      arrows: false,
      autoplay: true,
      autoplaySpeed: 5000,
      dots: true,
      draggable: true,
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1
    };

    $scope.mapClick = () => {
      $scope.mapIsClicked = true;
    };

    $document.find('.park-map').append(`<iframe width="100%" height="100%" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/place?key=AIzaSyD1trrr2iGJkn3xWwKZzGoxsQ8pnJLYSrg&q=${$scope.park.fullName.replace('&', 'and')}&zoom=9" allowfullscreen></iframe>`);

    parkFactory.fetchWeather($scope.park);
  });
