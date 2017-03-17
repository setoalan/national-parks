'use strict';

angular.module('national-parks')
  .factory('$localStorage', ($window) => {
    return {
      store: (key, value) => {
        $window.localStorage[key] = value;
      },
      get: (key, defaultValue) => {
        return $window.localStorage[key] || defaultValue;
      },
      storeObject: (key, value) => {
        $window.localStorage[key] = JSON.stringify(value);
      },
      getObject: (key, defaultValue) => {
        return JSON.parse($window.localStorage[key] || defaultValue);
      }
    };
  });
