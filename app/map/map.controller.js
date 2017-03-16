'use strict';

angular.module('national-parks')
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
      const latLng = { lat: park.latLong.lat, lng: park.latLong.lng };
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
  }]);
