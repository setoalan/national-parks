'use strict';

angular.module('national-parks')
  .factory('toolBarFactory', [function () {
    let toolBar = {};

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

    return toolBar;
  }])
  .factory('parksFactory', ['$http', '$localStorage', function ($http, $localStorage) {
    let parksFactory = {};
    let parks = [];

    function fetchPhotos(park, parkName) {
      $http.get('/flickr?parkName=' + parkName + '&numPhotos=1')
        .then(function (response) {
          let photo = response.data.body.photos.photo[0];
          park.photoUrl = (photo) ?
            `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg` :
            // Voyageurs National Park does not return any photos on Flickr search
            'https://upload.wikimedia.org/wikipedia/commons/b/bd/Voyageurs_National_Park.jpg';
          park.show = true;
          $localStorage.storeObject('parks', parks);
        }, function (error) {
          console.error('Error: ' + error);
        });
    }

    parksFactory.fetchParks = function (requestPhotos) {
      let data = $http.get('/api')
        .then(function (response) {
          parks = response.data.items;
          if (requestPhotos) {
            parks.forEach(park => fetchPhotos(park, park.venue.name.split(' ').join('+')));
          }
          $localStorage.storeObject('parks', parks);
          return parks;
        }, function (error) {
          console.error('Error: ' + error);
        });
      return data;
    };

    parksFactory.getParks = function () {
      return $localStorage.getObject('parks');
    };

    parksFactory.getPark = function (id) {
      return $localStorage.getObject('parks').find(function (park) {
        return park.id === id;
      });
    };

    return parksFactory;
  }])

  .factory('parkFactory', ['$http', '$localStorage', function ($http, $localStorage) {
    let parkFactory = {};
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
