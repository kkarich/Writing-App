'use strict';

angular.module('explore').controller('ExploreController', ['$scope','Rooms',
	function($scope,Rooms) {
		// Controller Logic
		// ...
		
			// Find a list of Rooms
		$scope.find = function() {
			$scope.stories = Rooms.query();
		};
		
	}
]);