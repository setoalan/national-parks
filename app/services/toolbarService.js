'use strict';

angular.module('national-parks')
  .factory('toolBarFactory', ($rootScope, $window, $q, $localStorage) => {
    const toolBar = {};

    toolBar.getSorts = () => {
      return [
        'Name A-Z',
        'Name Z-A',
        'Rating +',
        'Rating -',
        'Checkins +',
        'Checkins -'
      ];
    };

    toolBar.getStates = () => {
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

    toolBar.fetchUserLocation = () => {
      const location = $q.defer();
      if (!$window.navigator) {
        console.error('Error: Geolocation is not supported');
      } else {
        $window.navigator.geolocation.getCurrentPosition((position) => {
          $localStorage.storeObject('userLocation', new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
          $rootScope.$apply(() => {
            location.resolve({'lat': position.coords.latitude, 'lng': position.coords.longitude});
          });
        }, (error) => {
          $rootScope.$apply(() => {
            location.reject(error);
          });
        });
      }

      return location.promise;
    };


    toolBar.getUserLocation = () => {
      return $localStorage.getObject('userLocation', false);
    };

    return toolBar;
  });
