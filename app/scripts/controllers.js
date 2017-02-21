'use strict';

angular.module('national-parks')
  .controller('IndexController', ['$scope', '$http', 'toolBarFactory', 'parksFactory', function ($scope, $http, toolBarFactory, parksFactory) {
    $scope.states = toolBarFactory.getStates();
    $scope.stateText = $scope.states[0];
    $scope.stateField = undefined;
    $scope.sorts = toolBarFactory.getSorts();
    $scope.sortText = $scope.sorts[0];
    $scope.sortField = '+venue.name';

    $scope.stateSelected = function (state) {
      $scope.stateText = state;
      $scope.stateField = (state === 'All States') ? undefined : state.substring(0, 2);
    };

    $scope.sortSelected = function (sort) {
      $scope.sortText = sort;

      if (sort === 'Name A-Z') {
        $scope.sortField = '+venue.name';
      } else if (sort === 'Name Z-A') {
        $scope.sortField = '-venue.name';
      } else if (sort === 'Rating +') {
        $scope.sortField = '-venue.rating';
      } else if (sort === 'Rating -') {
        $scope.sortField = '+venue.rating';
      } else if (sort === 'Checkins +') {
        $scope.sortField = '-venue.stats.checkinsCount';
      } else if (sort === 'Checkins -') {
        $scope.sortField = '+venue.stats.checkinsCount';
      } else {
        $scope.sortField = '+venue.name';
      }
    };

    $scope.parkHasRating = function (park) {
      return ($scope.sortField.substring(1) === 'venue.rating' && !park.venue.rating) ? false : true;
    };

    $scope.getNumRows = function () {
      return new Array($scope.numRows);
    };

    let parks = parksFactory.getParks();
    if (parks) {
      $scope.parks = parks;
      $scope.numRows = Math.ceil(parks.length / 3);
    } else {
      parksFactory.fetchParks(true)
        .then(function (response) {
          $scope.parks = response;
          $scope.numRows = Math.ceil(response.length / 3);
        });
    }

  }])
  .controller('MapController', ['$scope', 'parksFactory', function ($scope, parksFactory) {
    const center = { lat:  26.7135539881, lng: -117.7395580925 };
    const map = new google.maps.Map(document.getElementById('map'), {
      zoom: 3,
      center: center,
      scrollwheel: false
    });
    parksFactory.getParks().forEach(park => {
      const latLng = { lat: park.venue.location.lat, lng: park.venue.location.lng };
      const marker = new google.maps.Marker({
        position: latLng,
        map: map
      });
      const infowindow = new google.maps.InfoWindow({
        content: `<h5>${park.venue.name}</h5>` +
          `<h6>${park.venue.location.city}, ${park.venue.location.cc}</h6>`
      });
      marker.addListener('click', function () {
        infowindow.open(map, marker);
      });
      google.maps.event.addListener(map, 'click', function() {
        infowindow.close();
      });
    });
  }])
  .controller('ParkController', ['$scope', '$stateParams', 'parksFactory', 'parkFactory', function ($scope, $stateParams, parksFactory, parkFactory) {
    $scope.park = parksFactory.getPark($stateParams.id);
    $scope.park.photos = [];

    parkFactory.fetchPhotos($scope.park.venue.name.split(' ').join('+'))
      .then(function (response) {
        response.forEach(function (photo) {
          $scope.park.photos.push({
            'src': `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`,
            'alt': photo.title
          });
          $('#parkCarousel').carousel({ interval: 2000 });
          $('#parkCarousel').carousel('cycle');
        });
      });
  }]);
