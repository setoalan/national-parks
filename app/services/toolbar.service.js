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
        'WY - Wyoming',
        'VI - Virgin Islands',
        'AS - American Samoa'
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
  }]);
