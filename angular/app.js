angular.module('CrudApp', ['ui.router']).
  config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/')

    $stateProvider
      .state('list', {
        url: '/',
        templateUrl: 'assets/tpl/lists.html',
        controller: ListCtrl
      })
      .state('add', {
        url: '/add-user',
        templateUrl: 'assets/tpl/add-new.html',
        controller: AddCtrl
      })
      .state('edit', {
        url: '/edit/:id',
        templateUrl: 'assets/tpl/edit.html',
        controller: EditCtrl
      })

    // .
    //   when('/add-user', {templateUrl: 'assets/tpl/add-new.html', controller: AddCtrl}).
    //   when('/edit/:id', {templateUrl: 'assets/tpl/edit.html', controller: EditCtrl}).
    //   otherwise({redirectTo: '/'});
  }]);

var api_url = 'http://localhost:8008/'

function ListCtrl($scope, $http) {
  $http.get(api_url + 'users').
    then(function (data) {
      console.log('list', data)
      $scope.users = data.data;
    });
}

function AddCtrl($scope, $http, $location) {
  $scope.master = {};
  $scope.activePath = null;

  $scope.add_new = function (user, AddNewForm) {

    $http.post(api_url + 'add_user', user)
      .then(function () {
        $scope.reset();
        $scope.activePath = $location.path('/');
      });

    $scope.reset = function () {
      $scope.user = angular.copy($scope.master);
    };

    $scope.reset();

  };
}

function EditCtrl($scope, $http, $location, $stateParams, $state) {
  var id = $stateParams.id;
  $scope.activePath = null;

  $http.get(api_url + 'users/' + id).then(function (data) {
    $scope.users = data.data;
  });

  $scope.update = function (user) {
    $http.put(api_url + 'users/' + id, user).success(function (data) {
      $scope.users = data;
      $state.go('list')
    });
  };
  
  $scope.delete = function (user) {
    console.log(user);
    
    var deleteUser = confirm('Are you absolutely sure you want to delete?');
    if (deleteUser) {
      $http.delete(api_url + 'users/' + user.id);
      $state.go('list')
    }
  };
}