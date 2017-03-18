describe('HomeController', () => {
  let $controller, $scope;

  beforeEach(() => {
    module('national-parks');

    inject((_$controller_) => {
      $controller = _$controller_;
    });

    $scope = {};
    controller = $controller('HomeController', { $scope });
  });

  it('should have 29 states in state filter dropdown', () => {
    expect($scope.states.length).toEqual(29);
  });

  it('should initially have 6 options in sort dropdown', () => {
    expect($scope.sorts.length).toEqual(6);
  });

});
