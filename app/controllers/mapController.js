'use strict';

angular.module('national-parks')
  .controller('MapController', function ($scope, $window, $state, $compile, $timeout, toolBarFactory, parksFactory) {
    $scope.mapHeight = $window.innerHeight - document.getElementById('header').offsetHeight - 91;

    const center = new google.maps.LatLng(39.50, -98.35);

    const map = new google.maps.Map(document.getElementById('map'), {
      zoom: 3,
      center: center,
      scrollwheel: false
    });

    const resize = () => {
      map.setCenter(center);
      $scope.mapHeight = $window.innerHeight - document.getElementById('header').offsetHeight - 91;
      $scope.$apply();
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

      userMarker.addListener('click', () => {
        infoWindow.open(map, userMarker);
      });
    }

    parksFactory.getParks().forEach((park) => {
      const marker = new google.maps.Marker({
        position: { lat: park.latLong.lat, lng: park.latLong.lng },
        map: map
      });

      const infoContent =
        `<div>
           <h4><a ng-click="goToPark('${park.parkCode}')">${park.fullName}</a></h4>
           <p>${park.states}</p>
         </div>`;
      const compiledContent = $compile(infoContent)($scope);

      google.maps.event.addListener(marker, 'click', ((marker, content, scope) => {
        return () => {
          scope.infowindow.setContent(content);
          scope.infowindow.open(scope.map, marker);
        };
      })(marker, compiledContent[0], $scope));
    });

    $scope.infowindow = new google.maps.InfoWindow({
      content: ''
    });

    $scope.goToPark = (parkCode) => {
      $state.go(`app.park`, {id: parkCode});
    };

    google.maps.event.addDomListener(window, 'resize', resize);

    // fix for second render of map
    $timeout(() => {
      google.maps.event.trigger(map, 'resize');
      map.setCenter(center);
    });
  });
