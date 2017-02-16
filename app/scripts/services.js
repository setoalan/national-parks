'use strict';

angular.module('national-parks')
  .factory('toolBarFactory', [function () {
    var toolBar = {};

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
  .factory('parkFactory', ['$http', function ($http) {
    var park = {};

    function fetchPhotos(park, parkName) {
      $http.get('/flickr?parkName=' + parkName)
        .then(function (response) {
          var photo = response.data.body.photos.photo[0];
          park.photoUrl = (photo) ?
            `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg` :
            // Voyageurs National Park does not return any photos on Flickr search
            'https://upload.wikimedia.org/wikipedia/commons/b/bd/Voyageurs_National_Park.jpg';
          park.show = true;
        }, function (error) {
          console.error('Error: ' + error);
        });
    }

    park.fetchParks = function () {
      var data = $http.get('/api')
        .then(function (response) {
          var parks = response.data.items;
          parks.forEach(park => fetchPhotos(park, park.venue.name.split(' ').join('+')));
          return parks;
        }, function (error) {
          console.error('Error: ' + error);
        });
      return data;
    };

    return park;
  }]);
