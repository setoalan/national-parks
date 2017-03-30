'use strict';

angular.module('national-parks')
  .directive('cacheScroll', ($rootScope, $window, $timeout, $location, $anchorScroll, $state) => {
  let scrollPosCache = {};

  return (scope, element, attrs) => {
    scope.$on('$stateChangeStart', (toState, fromState) => {
      if (fromState.name !== 'app') {
        scrollPosCache[$location.path()] = [$window.pageXOffset, $window.pageYOffset];
      }
    });

    scope.$on('$stateChangeSuccess', () => {
      if ($location.url() !== '/') {
        $anchorScroll();
      } else {
        const prevScrollPos = scrollPosCache[$location.path()] || [0, 0];
        $timeout(() => {
          $window.scrollTo(prevScrollPos[0], prevScrollPos[1]);
        }, 0);
      }
    });
  };
});
