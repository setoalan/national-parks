'use strict';

angular.module('national-parks')
  .directive('lazyLoader', ($timeout) => {
    return (scope) => {
      if (scope.$last) {
        $timeout(() => {
          new Blazy({src: 'data-blazy'});
        }, 0);
      }
    };
  });
