// declare a module
var myAppModule = angular.module('home', ['ngMaterial']);

angular.module('home')
.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('deep-orange')
    .accentPalette('cyan');
});
// configure the module.
// in this example we will create a greeting filter
myAppModule.controller('homeController', function($scope, $mdDialog) {
  $scope.showForm = function(ev) {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: '/modules/home/mailingListForm.html',
      targetEvent: ev,
    })
    .then(function(answer) {
      $scope.alert = 'You said the information was "' + answer + '".';
     
    }, function() {
      $scope.alert = 'You cancelled the dialog.';

    });
  };
  
});

function DialogController($scope, $mdDialog) {
  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };
}