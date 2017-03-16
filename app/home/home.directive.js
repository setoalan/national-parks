'use strict';

angular.module('national-parks')
  .directive('lazyLoader', function ($timeout) {
    return (scope) => {
      if (scope.$last) {
        $timeout(() => {
          new Blazy({src: 'data-blazy'});
        }, 0);
      }
    };
  });
