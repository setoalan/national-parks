'use strict';

angular.module('national-parks-4sq', [])
  .controller('IndexController', ['$scope', '$http', function ($scope, $http) {
    $scope.parkList = {};

    $http.get('/api')
      .then(function (data) {
        $scope.parkList = data.data.items;
      }, function (error) {
        console.log(error);
      });

  }]);
