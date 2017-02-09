'use strict';

angular.module('national-parks-4sq', [])
  .controller('IndexController', ['$scope', '$http', function ($scope, $http) {

    $scope.getNumRows = function() {
      return new Array($scope.numRows);
    }

    $http.get('/api')
      .then(function (response) {
        $scope.parkList = response.data.items;
        $scope.numRows = Math.ceil(response.data.items.length / 3);
      }, function (error) {
        console.log(error);
      });

  }]);
