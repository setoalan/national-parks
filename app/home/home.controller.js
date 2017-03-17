'use strict';

angular.module('national-parks')
  .controller('IndexController', ['$scope', '$http', 'toolBarFactory', 'parksFactory', function ($scope, $http, toolBarFactory, parksFactory) {
    $scope.loading = true;
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

      switch (sort) {
      case'Name A-Z':
        $scope.sortField = '+fullName';
        break;
      case 'Name Z-A':
        $scope.sortField = '-fullName';
        break;
      case 'Rating +':
        $scope.sortField = '-foursquare.venue.rating';
        break;
      case 'Rating -':
        $scope.sortField = '+foursquare.venue.rating';
        break;
      case 'Checkins +':
        $scope.sortField = '-foursquare.venue.stats.checkinsCount';
        break;
      case 'Checkins -':
        $scope.sortField = '+foursquare.venue.stats.checkinsCount';
        break;
      case 'Distance':
        $scope.sortField = '+distanceTo';
        break;
      default:
        $scope.sortField = '+fillName';
      }
    };

    const fetchLocation = function () {
      new google.maps.Geocoder().geocode({'latLng': $scope.userLocation}, function (results, status) {
        if (status === 'OK') {
          $scope.locationText = `${results[2].address_components[1].short_name}, ${results[2].address_components[3].short_name}`;
          $scope.locationSuccess = 'success';
          $scope.sorts.unshift('Distance');
          if ($scope.parks) {
            $scope.parks.forEach(park => {
              park.distanceTo = google.maps.geometry.spherical
                .computeDistanceBetween(new google.maps.LatLng($scope.userLocation.lat, $scope.userLocation.lng), new google.maps.LatLng(park.latLong.lat, park.latLong.lng)) / 1000;
            });
          }
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
      if ($scope.sorts.includes('Distance')) {
        $scope.sorts.shift();
      }
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
    };

    $scope.getNumRows = function () {
      return new Array($scope.numRows);
    };

    const userLocation = toolBarFactory.getUserLocation();
    if (userLocation) {
      $scope.userLocation = userLocation;
      fetchLocation($scope.userLocation);
    }

    const parks = parksFactory.getParks();
    if (parks) {
      $scope.parks = parks;
      $scope.numRows = Math.ceil(parks.length / 3);
      $scope.loading = false;
    } else {
      parksFactory.fetchParks()
        .then(function (response) {
          $scope.parks = response;
          $scope.numRows = Math.ceil(response.length / 3);
          $scope.loading = false;
        }, function (error) {
          console.error('Error: ' + error);
        });
    }
  }]);
