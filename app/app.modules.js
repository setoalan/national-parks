'use strict';

angular.module('national-parks', ['slickCarousel', 'ngSanitize', 'angular-google-analytics'])
  .config(['AnalyticsProvider', (analyticsProvider) => {
    analyticsProvider.setAccount('UA-80190481-4');
  }])
  .run(['Analytics', () => { }]);
