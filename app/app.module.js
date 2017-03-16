'use strict';

angular.module('national-parks', ['ui.router'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app', {
        url: '/',
        views: {
          'header': {
            templateUrl: 'views/header.html'
          },
          'content': {
            templateUrl: 'home/home.html',
            controller: 'IndexController'
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
            templateUrl: 'map/map.html',
            controller: 'MapController'
          }
        }
      })
      .state('app.park', {
        url: 'park/:id',
        views: {
          'content@':  {
            templateUrl: 'park/park.html',
            controller: 'ParkController'
          }
        }
      });

    $urlRouterProvider.otherwise('/');
});
