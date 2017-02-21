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
            templateUrl: 'views/home.html',
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
            templateUrl: 'views/map.html',
            controller: 'MapController'
          }
        }
      });

    $urlRouterProvider.otherwise('/');
});
