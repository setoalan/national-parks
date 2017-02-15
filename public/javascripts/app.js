'use strict';

angular.module('national-parks-4sq', ['ui.router'])
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
      });

    $urlRouterProvider.otherwise('/');
});
