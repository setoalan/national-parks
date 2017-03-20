'use strict';

angular.module('national-parks', ['ui.router', 'slickCarousel'])
  .config(($stateProvider, $urlRouterProvider) => {
    $stateProvider
      .state('app', {
        url: '/',
        views: {
          'header': {
            templateUrl: 'views/header.html'
          },
          'content': {
            templateUrl: 'views/home.html',
            controller: 'HomeController'
          },
          'footer': {
            templateUrl: 'views/footer.html'
          }
        }
      })
      .state('app.map', {
        url: 'map',
        views: {
          'content@': {
            templateUrl: 'views/map.html',
            controller: 'MapController'
          }
        }
      })
      .state('app.park', {
        url: 'park/:id',
        views: {
          'content@':  {
            templateUrl: 'views/park.html',
            controller: 'ParkController'
          }
        }
      });

    $urlRouterProvider.otherwise('/');
});
