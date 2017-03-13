'use strict';

angular.module('national-parks')
  .factory('toolBarFactory', ['$localStorage', '$window', '$q', '$rootScope', function ($localStorage, $window, $q, $rootScope) {
    const toolBar = {};

    toolBar.getSorts = function () {
      return [
        'Name A-Z',
        'Name Z-A',
        'Rating +',
        'Rating -',
        'Checkins +',
        'Checkins -'
      ];
    };

    toolBar.getStates = function () {
      return [
        'All States',
        'AK - Alaska',
        'AZ - Arizona',
        'AR - Arkansas',
        'CA - California',
        'CO - Colorado',
        'FL - Florida',
        'HI - Hawaii',
        'KY - Kentucky',
        'ME - Maine',
        'MI - Michigan',
        'MN - Minnesota',
        'MT - Montana',
        'NV - Nevada',
        'NM - New Mexico',
        'NC - North Carolina',
        'ND - North Dakota',
        'OH - Ohio',
        'OR - Oregon',
        'SC - South Carolina',
        'SD - South Dakota',
        'TN - Tennessee',
        'TX - Texas',
        'UT - Utah',
        'VA - Virgina',
        'WA - Washington',
        'WY - Wyoming'
      ];
    };

    toolBar.fetchUserLocation = function () {
      const location = $q.defer();
      if (!$window.navigator) {
        console.log('Error: Geolocation is not supported');
      } else {
        $window.navigator.geolocation.getCurrentPosition(function (position) {
          $localStorage.storeObject('userLocation', new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
          $rootScope.$apply(function () {
            location.resolve({'lat': position.coords.latitude, 'lng': position.coords.longitude});
          });
        }, function (error) {
          $rootScope.$apply(function() {
            location.reject(error);
          });
        });
      }

      return location.promise;
    };

    toolBar.getUserLocation = function () {
      return $localStorage.getObject('userLocation', false);
    };

    return toolBar;
  }])
  .factory('parksFactory', ['$http', '$localStorage', function ($http, $localStorage) {
    const parksFactory = {};
    let parks = [];

    function fetchPhotos(park, parkName) {
      $http.get('/flickr?parkName=' + parkName)
        .then(function (response) {
          let photo = response.data.body.photos.photo[1];
          park.photoUrl = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`;
          $localStorage.storeObject('parks', parks);
          return photo;
        }, function (error) {
          console.error('Error: ' + error);
        });
    }

    parksFactory.fetchParks = function () {
      const data = $http.get('/nps')
        .then(function (response) {
          parks = response.data.data.filter(function (park) {
            return park.designation.includes('National Park') || park.parkCode === 'npsa';
          });
          parks.forEach(park => fetchPhotos(park, park.fullName.split(' ').join('+')));
          return parks;
        }, function (error) {
          console.log('Error: ' + error);
        });
      return data;
    };

    parksFactory.getParks = function () {
      return $localStorage.getObject('parks', false);
    };

    parksFactory.getPark = function (id) {
      return $localStorage.getObject('parks').find(function (park) {
        return park.id === id;
      });
    };

    return parksFactory;
  }])
  .factory('parkFactory', ['$http', function ($http) {
    const numPhotos = 10;
    let parkFactory = {};

    parkFactory.fetchPhotos = function (parkName) {
      let data = $http.get('/park/flickr?parkName=' + parkName + '&numPhotos=' + numPhotos)
        .then(function (response) {
          return response.data.body.photos.photo;
        }, function (error) {
          console.error('Error: ' + error);
        });
      return data;
    };

    return parkFactory;
  }])

  .factory('$localStorage', ['$window', function ($window) {
    return {
      store: function (key, value) {
        $window.localStorage[key] = value;
      },
      get: function (key, defaultValue) {
        return $window.localStorage[key] || defaultValue;
      },
      storeObject: function (key, value) {
        $window.localStorage[key] = JSON.stringify(value);
      },
      getObject: function (key, defaultValue) {
        return JSON.parse($window.localStorage[key] || defaultValue);
      }
    };
  }]);
