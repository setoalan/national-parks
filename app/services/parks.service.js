'use strict';

angular.module('national-parks')
  .factory('parksFactory', ['$window', '$http', '$localStorage', function ($window, $http, $localStorage) {
    const parksFactory = {};
    let parks = [];

    function fixParkData(response) {
      // filter parks that are national parks
      parks = response.data.data.filter(function (park) {
        return park.designation.includes('National Park') || park.parkCode === 'npsa';
      });

      // Congaree National Park duplicate
      parks.splice(11, 1);

      // fix Haleakalā National Park name
      parks[27].fullName = 'Haleakalā National Park';

      // fix Hawaiʻi Volcanoes National Park name
      parks[28].fullName = 'Hawaiʻi Volcanoes National Park';

      // add missing Kings Canyon National Park data
      parks[34].url = 'https://www.nps.gov/seki/index.htm';
      parks[34].description = 'This dramatic landscape testifies to nature\'s size, beauty, and diversity--huge mountains, rugged foothills, deep canyons, vast caverns, and the world\'s largest trees. These two parks lie side by side in the southern Sierra Nevada east of the San Joaquin Valley. Weather varies a lot by season and elevation, which ranges from 1,370\' to 14,494\'. Sequoias grow at 5,000 - 7,000\', above usual snowline.';

      // add missing Redwood National Park
      const redwoodNationalPark = {
        states: 'CA',
        url: 'https://www.nps.gov/redw/index.htm',
        latLong: 'lat:41.275871335023865, lng:-124.02997970581055',
        description: 'Most people know Redwood as home to the tallest trees Earth. The parks also protect prairies, oak woodlands, riverways, and nearly 40 miles of rugged coastline. For thousands years people have lived this verdant landscape. Together, National Park Service and California State Parks manage these lands the inspiration, enjoyment, and education of all.',
        parkCode: 'redw',
        fullName: 'Redwood National Park'

      };
      parks.splice(46, 0, redwoodNationalPark);
    }

    function fetchPhotos(park, parkName) {
      const XS_DEVICE_MAX_WIDTH = 768;
      const SM_DEVICE_MAX_WIDTH = 992;

      $http.get('/flickr?parkName=' + parkName)
        .then(function (response) {
          let photo = response.data.body.photos.photo[1];
          if ($window.innerWidth < XS_DEVICE_MAX_WIDTH) {
            photo.size = '_n';
          } else if ($window.innerWidth < SM_DEVICE_MAX_WIDTH) {
            photo.size = '_m';
          } else {
            photo.size = '';
          }
          park.photoUrl = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}${photo.size}.jpg`;
          $localStorage.storeObject('parks', parks);
          bLazy.revalidate();
          return photo;
        }, function (error) {
          console.error('Error: ' + error);
        });
    }

    function fetchFoursquareData() {
      $http.get('/foursquare')
        .then(function (response) {
          parks.forEach((park, index) => {
            park.foursquare = response.data.items[index];
            park.latLong = { lat: parseFloat(park.latLong.split(/:|,/g)[1]), lng: parseFloat(park.latLong.split(/:|,/g)[3]) };
            fetchPhotos(park, park.fullName.split(' ').join('+'));
            if (Object.is(park.latLong.lat, NaN)) {
              [park.latLong.lat, park.latLong.lng] = [park.foursquare.venue.location.lat, park.foursquare.venue.location.lng];
            }
            if (!park.foursquare.venue.rating) {
              park.foursquare.venue.rating = -1;
            }
          });
        }, function (error) {
          console.error('Error: ' + error);
        });
    }

    parksFactory.fetchParks = function () {
      const data = $http.get('/nps')
        .then(function (response) {
          fixParkData(response);
          fetchFoursquareData();
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
  }]);
