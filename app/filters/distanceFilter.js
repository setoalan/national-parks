'use strict';

angular.module('national-parks')
  .filter('distanceFilter', () => {
    return (input) => {
      return (input * 0.621).toFixed(0);
    };
  });
