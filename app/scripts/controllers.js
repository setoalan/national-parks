'use strict';

angular.module('national-parks')
  .controller('IndexController', ['$scope', '$http', '$localStorage', 'toolBarFactory', 'parkFactory', function ($scope, $http, $localStorage, toolBarFactory, parkFactory) {
    $scope.locationText = 'Get Location';
    $scope.locationSuccess = undefined;
    $scope.locationDisable = false;
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
            .computeDistanceBetween(new google.maps.LatLng($scope.userLocation.lat, $scope.userLocation.lng), new google.maps.LatLng(park.venue.location.lat, park.venue.location.lng));
        });
        $scope.sortField = '+venue.location.distanceTo';
      } else {
        $scope.sortField = '+venue.name';
      }
    };

    const fetchLocation = function () {
      new google.maps.Geocoder().geocode({'latLng': $scope.userLocation}, function (results, status) {
        if (status === 'OK') {
          $scope.locationText = `${results[3].address_components[0].short_name}, ${results[3].address_components[2].short_name}`;
          $scope.locationSuccess = 'success';
          $scope.locationDisable = true;
          $scope.sorts.unshift('Distance');
          $scope.$apply();
        } else {
          $scope.locationText = 'Error';
          $scope.locationSuccess = 'error';
          $scope.$apply();
          console.error('Error: ' + status);
        }
      });
    };

    $scope.getLocation = function () {
      $scope.locationText = 'Locating...';
      $scope.locationSuccess = undefined;

      const userLocation = toolBarFactory.getUserLocation();
      if (userLocation) {
        $scope.userLocation = userLocation;
        fetchLocation($scope.userLocation);
      } else {
        toolBarFactory.fetchUserLocation()
          .then(function (userLocation) {
            $scope.userLocation = userLocation;
            fetchLocation($scope.userlocation);
          }, function (error) {
            $scope.locationText = 'Error';
            $scope.locationSuccess = 'error';
            $scope.$apply();
            console.error('Error: ' + error);
          });
      }
    };

    $scope.parkHasRating = function (park) {
      return ($scope.sortField.substring(1) === 'venue.rating' && !park.venue.rating) ? false : true;
    };

    $scope.getNumRows = function () {
      return new Array($scope.numRows);
    };

    const parks = parkFactory.getParks();
    if (parks) {
      $scope.parks = parks;
      $scope.numRows = Math.ceil(parks.length / 3);
    } else {
      parkFactory.fetchPark()
        .then(function (response) {
          $scope.parks = response;
          $scope.numRows = Math.ceil(response.length / 3);
          $localStorage.storeObject('parks', response);
        }, function (error) {
          console.error('Error: ' + error);
        });
    }
  }])
  .controller('MapController', ['$scope', 'toolBarFactory', 'parkFactory', function ($scope, toolBarFactory, parkFactory) {
    const map = new google.maps.Map(document.getElementById('map'), {
      zoom: 3,
      center: { lat: 26.7135539881, lng: -117.7395580925 },
      scrollwheel: false
    });

    const addMapListeners = function (marker, infoWindow) {
      marker.addListener('click', function () {
        infoWindow.open(map, marker);
      });
      google.maps.event.addListener(map, 'click', function() {
        infoWindow.close();
      });
    };

    const userLocation = toolBarFactory.getUserLocation();
    if (userLocation) {
      const userMarker = new google.maps.Marker({
        position: userLocation,
        map: map
      });
      userMarker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
      const infoWindow = new google.maps.InfoWindow({
        content: '<h5>Your Location</h5>'
      });
      addMapListeners(userMarker, infoWindow);
    }

    parkFactory.getParks().forEach(park => {
      const latLng = { lat: park.venue.location.lat, lng: park.venue.location.lng };
      const marker = new google.maps.Marker({
        position: latLng,
        map: map
      });
      const infoWindow = new google.maps.InfoWindow({
        content: `<h5>${park.venue.name}</h5>` +
          `<h6>${park.venue.location.city}, ${park.venue.location.cc}</h6>`
      });
      addMapListeners(marker, infoWindow);
    });
  }]);
