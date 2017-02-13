'use strict';

angular.module('national-parks-4sq')
  .controller('IndexController', ['$scope', '$http', 'indexFactory', function ($scope, $http, indexFactory) {
    $scope.states = indexFactory.getStates();
    $scope.stateText = $scope.states[0];
    $scope.stateField = undefined;
    $scope.sorts = indexFactory.getSorts();
    $scope.sortText = $scope.sorts[0];
    $scope.sortField = '+venue.name';

    $scope.getNumRows = function () {
      return new Array($scope.numRows);
    };

    $scope.parkHasRating = function (park) {
      return ($scope.sortField.substring(1) === 'venue.rating' && !park.venue.rating) ? false : true;
    };

    $http.get('/api')
      .then(function (response) {
        $scope.parkList = response.data.items;
        $scope.numRows = Math.ceil(response.data.items.length / 3);

        $scope.parkList.forEach(park => {
          var parkName = park.venue.name.split(' ').join('+');
          $http.get('/flickr?parkName=' + parkName)
            .then(function (response) {
              var photo = response.data.body.photos.photo[0];
              park.photoUrl = (photo) ?
                `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg` :
                // Voyageurs National Park does not have any photos on Flickr search
                'https://upload.wikimedia.org/wikipedia/commons/b/bd/Voyageurs_National_Park.jpg';
            }, function (error) {
              console.log('Error: ' + error);
            });
        })
      }, function (error) {
        console.log('Error: ' + error);
      });

    $scope.stateSelected = function (state) {
      $scope.stateText = state;
      $scope.stateField = (state === 'All States') ? undefined : state.substring(0, 2);
    };

    $scope.sortSelected = function (sort) {
      $scope.sortText = sort;

      if (sort === 'Name A-Z') {
        $scope.sortField = '+venue.name';
      } else if (sort === 'Name Z-A') {
        $scope.sortField = '-venue.name';;
      } else if (sort === 'Rating +') {
        $scope.sortField = '-venue.rating';
      } else if (sort === 'Rating -') {
        $scope.sortField = '+venue.rating';
      } else if (sort === 'Checkins +') {
        $scope.sortField = '-venue.stats.checkinsCount';
      } else if (sort === 'Checkins -') {
        $scope.sortField = '+venue.stats.checkinsCount';
      } else {
        $scope.sortField = '+venue.name';
      }
    };

  }]);
