'use strict';

angular.module('national-parks')
  .factory('parksFactory', ($window, $http, $localStorage) => {
    const parksFactory = {};
    let parks = [];

    const fixParkData = (response) => {
      // filter parks that are national parks
      parks = response.data.data.filter((park) => {
        return park.designation.includes('National Park') || park.parkCode === 'npsa';
      });

      // Congaree National Park duplicate
      parks.splice(11, 1);

      // fix Haleakalā National Park name
      parks[27].fullName = 'Haleakalā National Park';

      // fix Hawaiʻi Volcanoes National Park name
      parks[28].fullName = 'Hawaiʻi Volcanoes National Park';

      // add missing Kings Canyon National Park data
      parks[34].addresses = parks[48].addresses;
      parks[34].entranceFees = parks[48].entranceFees;
      parks[34].entrancePasses = parks[48].entrancePasses;
      parks[34].description = parks[48].description;
      parks[34].directionsInfo = parks[48].directionsInfo;
      parks[34].directionsUrl = parks[48].directionsUrl;
      parks[34].operatingHours = parks[48].operatingHours;
      parks[34].url = parks[48].url;
      parks[34].weatherInfo = parks[48].weatherInfo;

      // add missing Redwood National Park
      const redwoodNationalPark = {
        addresses: [
          {
            city: 'Crescent City',
            line1: '1111 Second Street',
            postalCode: 95531,
            stateCode: 'CA',
            type: 'Physical'
          },
          {
            city: 'Crescent City',
            line1: '1111 Second Street',
            postalCode: 95531,
            stateCode: 'CA',
            type: 'Mailing'
          }
        ],
        contacts: {
          phoneNumbers: [
            {
              phoneNumber: '7074657335'
            }
          ]
        },
        description: 'Most people know Redwood as home to the tallest trees Earth. The parks also protect prairies, oak woodlands, riverways, and nearly 40 miles of rugged coastline. For thousands years people have lived this verdant landscape. Together, National Park Service and California State Parks manage these lands the inspiration, enjoyment, and education of all.',
        directionsInfo: 'Redwood National and State Parks is located in northernmost coastal California - almost on the Oregon border. The parks are about 60-miles long, with four visitor centers from north to south. We are a six to seven-hour drive (325 miles) north of San Francisco, a six-hour drive (330 miles) south of Portland, OR and a four-hour drive (170 miles) west of Redding, CA.',
        directionsUrl: 'https://www.nps.gov/redw/planyourvisit/directions.htm',
        entranceFees: [
          {
            cost: 0,
            description: 'There are no entrance stations in the National Park. The only entrance fee is to the Gold Bluffs Beach section of Prairie Creek Redwoods State Park.',
            title: 'Redwood National Park Entrance Fee'
          },
          {
            cost: 0,
            description: 'Entry fee for one vehicle, valid for one day.',
            title: 'Gold Bluffs Beach - Day Use'
          }
        ],
        entrancePasses: [
          {
            cost: 0,
            description: 'There are no fees, or entrance stations to enter Redwood National Park. We do not sell the federal passes. You can use your federal "Senior", or "Access" passes for a 50% discount on camping at Jedediah Smith Redwood, Del Norte Coast Redwood, and Prairie Creek Redwood State Parks.',
            title: 'America the Beautiful Pass'
          },
          {
            cost: 0,
            description: 'This will get you into Gold Bluff Beach for free. The pass is also honored at most parks throughout the state that are operated by California State Parks and charge a vehicle day use fee.',
            title: 'California Explorer Vehicle Day Use Annual Pass'
          }
        ],
        fullName: 'Redwood National Park',
        latLong: 'lat:41.275871335023865, lng:-124.02997970581055',
        operatingHours: [
          {
            description: 'The national and state parks are always open to enjoy. Roads, trails and public access remain open year round. Some facilities are closed in the winter season (November-May)',
            standardHours: {
              friday: 'Open 24 hours',
              monday: 'Open 24 hours',
              saturday: 'Open 24 hours',
              sunday: 'Open 24 hours',
              thursday: 'Open 24 hours',
              tuesday: 'Open 24 hours',
              wednesday: 'Open 24 hours'
            }
          }
        ],
        parkCode: 'redw',
        states: 'CA',
        url: 'https://www.nps.gov/redw/index.htm',
        weatherInfo: 'Visitors should be prepared for cooler and damp weather. Dress in layers and expect to get wet. Year-round temperatures along California\'s redwood coast: mid-40s°F (7°C) to mid-60s°F (18°C). Summer can be foggy, with highs occasionally reaching low 70s°F (20°C). Winters are cooler with considerable rain. October through April averages 60-80 inches of rain over the region.'
      };
      parks.splice(46, 0, redwoodNationalPark);
    };

    const fetchPhotos = (park, parkName) => {
      const XS_DEVICE_MAX_WIDTH = 768;
      const SM_DEVICE_MAX_WIDTH = 992;

      $http.get('/flickr?parkName=' + parkName)
        .then((response) => {
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
        }, (error) => {
          console.error('Error: ' + error);
        });
    };

    const fetchFoursquareData = () => {
      $http.get('/foursquare')
        .then((response) => {
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
        }, (error) =>{
          console.error('Error: ' + error);
        });
    };

    parksFactory.fetchParks = () => {
      const data = $http.get('/nps')
        .then((response) => {
          fixParkData(response);
          fetchFoursquareData();
          return parks;
        }, (error) => {
          console.log('Error: ' + error);
        });
      return data;
    };

    parksFactory.getParks = () => {
      return $localStorage.getObject('parks', false);
    };

    parksFactory.getPark = (parkCode) => {
      return $localStorage.getObject('parks').find((park) => {
        return park.parkCode === parkCode;
      });
    };

    return parksFactory;
  });
