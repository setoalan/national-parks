'use strict';

angular.module('national-parks')
  .controller('IndexController', ['$scope', '$http', 'toolBarFactory', 'parksFactory', function ($scope, $http, toolBarFactory, parksFactory) {
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
        $scope.parks.forEach(park => {
          park.distanceTo = google.maps.geometry.spherical
            .computeDistanceBetween(new google.maps.LatLng($scope.userLocation.lat, $scope.userLocation.lng), new google.maps.LatLng(park.latLong.lat, park.latLong.lng));
        });
        $scope.sortField = '+distanceTo';
        break;
      default:
        $scope.sortField = '+fillName';
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
      return ($scope.sortField.substring(1) === 'foursquare.venue.rating' && !park.foursquare.venue.rating) ? false : true;
    };

    $scope.getNumRows = function () {
      return new Array($scope.numRows);
    };

    const parks = parksFactory.getParks();
    if (parks) {
      $scope.parks = parks;
      $scope.numRows = Math.ceil(parks.length / 3);
    } else {
      parksFactory.fetchParks()
        .then(function (response) {
          $scope.parks = response;
          $scope.numRows = Math.ceil(response.length / 3);
        }, function (error) {
          console.error('Error: ' + error);
        });
    }
  }])
  .controller('MapController', ['$scope', 'toolBarFactory', 'parksFactory', function ($scope, toolBarFactory, parksFactory) {
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

    parksFactory.getParks().forEach(park => {
      const latLng = { lat: parseFloat(park.latLong.split(/:|,/g)[1]), lng: parseFloat(park.latLong.split(/:|,/g)[3]) };
      const marker = new google.maps.Marker({
        position: latLng,
        map: map
      });
      const infoWindow = new google.maps.InfoWindow({
        content: `<h5>${park.fullName}</h5>` +
          `<h6>${park.foursquare.venue.location.city}, ${park.foursquare.venue.location.cc}</h6>`
      });
      addMapListeners(marker, infoWindow);
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
          // $('#parkCarousel').carousel({ interval: 2000 });
          // $('#parkCarousel').carousel('cycle');
        });
      });
  }]);
