'use strict';

angular.module('national-parks')
  .controller('IndexController', ['$scope', '$http', 'toolBarFactory', 'parkFactory', function ($scope, $http, toolBarFactory, parkFactory) {
    $scope.locationText = 'Get Location';
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
      } else if (sort === 'Distance') {
        $scope.parks.forEach(park => {
          park.venue.location.distanceTo = google.maps.geometry.spherical
            .computeDistanceBetween($scope.userCord, new google.maps.LatLng(park.venue.location.lat, park.venue.location.lng));
        });
        $scope.sortField = '+venue.location.distanceTo';
      } else {
        $scope.sortField = '+venue.name';
      }
    };

    $scope.getLocation = function () {
       navigator.geolocation.getCurrentPosition(function (position) {
         $scope.userCord = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
         new google.maps.Geocoder().geocode({'latLng': $scope.userCord}, function(results, status) {
           if (status === 'OK') {
             $scope.locationText = `${results[3].address_components[0].short_name}, ${results[3].address_components[2].short_name}`;
             $scope.sorts.unshift('Distance');
             $scope.$apply();
           } else {
             console.log('Error ' + status);
           }
         })
       }, function (error) {
         console.log('Error' + error);
       });
    };

    $scope.parkHasRating = function (park) {
      return ($scope.sortField.substring(1) === 'venue.rating' && !park.venue.rating) ? false : true;
    };

    $scope.getNumRows = function () {
      return new Array($scope.numRows);
    };

    let parks = parkFactory.getParks();
    if (parks) {
      $scope.parks = parks;
      $scope.numRows = Math.ceil(parks.length / 3);
    } else {
      parkFactory.fetchParks(true)
        .then(function (response) {
          $scope.parks = response;
          $scope.numRows = Math.ceil(response.length / 3);
        });
    }

  }])
  .controller('MapController', ['$scope', 'parkFactory', function ($scope, parkFactory) {
    const center = { lat:  26.7135539881, lng: -117.7395580925 };
    const map = new google.maps.Map(document.getElementById('map'), {
      zoom: 3,
      center: center,
      scrollwheel: false
    });
    parkFactory.getParks().forEach(park => {
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
  }]);
