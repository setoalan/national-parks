'use strict';

angular.module('national-parks')
  .filter('temperatureFilter', () => {
    return (input) => {
      return (1.8 * (input - 273) + 32).toFixed(1);
    };
  });
