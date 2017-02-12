'use strict';

angular.module('national-parks-4sq', [])
  .controller('IndexController', ['$scope', '$http', function ($scope, $http) {
    $scope.sorts = ['Name A-Z', 'Name Z-A', 'Rating +', 'Rating -', 'Checkins +', 'Checkins -'];
    $scope.currentSort = $scope.sorts[0];
    $scope.filtText = 'Name A-Z';

    $scope.getNumRows = function () {
      return new Array($scope.numRows);
    }

    $http.get('/api')
      .then(function (response) {
        $scope.parkList = response.data.items;
        $scope.numRows = Math.ceil(response.data.items.length / 3);

        $scope.parkList.forEach(park => {
          var parkName = park.venue.name.split(' ').join('+');
          $http.get('/flickr?parkName=' + parkName)
            .then(function (response) {
              var photo = response.data.body.photos.photo[0];
              if (photo) {
                park.photoUrl = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`
              } else {
                // Voyageurs National Park does not have any photos on Flickr search
                park.photoUrl = 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Voyageurs_National_Park.jpg';
              }
            }, function (error) {
              console.log(error);
            });
        })

      }, function (error) {
        console.log(error);
      });

    $scope.sortSelected = function (sort) {
      $scope.currentSort = sort;

      if (sort === 'Name A-Z') {
        $scope.sortText = '+venue.name';
      } else if (sort === 'Name Z-A') {
        $scope.sortText = '-venue.name';;
      } else if (sort === 'Rating +') {
        $scope.sortText = '-venue.rating';
      } else if (sort === 'Rating -') {
        $scope.sortText = '+venue.rating';
      } else if (sort === 'Checkins +') {
        $scope.sortText = '-venue.stats.checkinsCount';
      } else if (sort === 'Checkins -') {
        $scope.sortText = '+venue.stats.checkinsCount';
      } else {
        $scope.sortText = '+venue.name';
      }
    };

  }]);
