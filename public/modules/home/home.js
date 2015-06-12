// declare a module
var myAppModule = angular.module('home', ['ngMaterial']);

angular.module('home')
.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('cyan')
    .accentPalette('cyan');
});
// configure the module.
// in this example we will create a greeting filter
myAppModule.controller('homeController', function($scope, $mdDialog) {
  $scope.showForm = function(ev) {
    $mdDialog.show({
      controller: DialogController,
      clickOutsideToClose :true,
      templateUrl: '/modules/home/mailingListForm.html',
      targetEvent: ev,
    });
  };
  
 
  
});

function DialogController($scope, $mdDialog,$http) {
  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };
  
   $scope.createContact = function(){
      $http.post('/contacts', $scope.contact).
          success(function(data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            $scope.message = data.message;
          }).
          error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status
            console.log('data')
          });
  };
}