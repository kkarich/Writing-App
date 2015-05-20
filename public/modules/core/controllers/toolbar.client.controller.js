'use strict';

angular.module('core').controller('ToolbarController', ['$scope','$mdSidenav','$mdUtil', '$log','$location',
	function($scope,$mdSidenav,$mdUtil, $log,$location) {
		// Toolbar controller logic
		// ...
		
    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildToggler(navID) {
      var debounceFn =  $mdUtil.debounce(function(){
            $mdSidenav(navID)
              .toggle()
              .then(function () {
                $log.debug('toggle ' + navID + ' is done');
              });
          },300);
      return debounceFn;
    }
	$scope.toggleLeft = buildToggler('search-panel');
 
		
	}
]);