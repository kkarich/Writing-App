'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication','$element',
	function($scope, Authentication,$element) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		
	window.onload = function() {
    
    };
    
    $scope.focusText = function(){
        document.getElementById("text").focus();
    console.log('test')
   
    };
    
}
]);