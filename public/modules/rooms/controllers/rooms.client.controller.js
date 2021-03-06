'use strict';

// Rooms controller
angular.module('rooms').controller('RoomsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Rooms','WritingBlocks',
	function($scope, $stateParams, $location, Authentication, Rooms,WritingBlocks) {
		$scope.authentication = Authentication;
        $scope.room = {
            prompt:'some random prompt',
            active:false,
            filled:false
        };
 
		// Create new Room
		$scope.create = function() {
			// Create new Room object
			var room = new Rooms ({
				prompt:$scope.room.prompt
			});

			// Redirect after save
			room.$save(function(response) {
				$location.path('rooms/' + response._id);
				// Clear form fields
				$scope.room.prompt = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
		
		//	join room
		$scope.join = function() {
			// Create new Room object
			var room = new Rooms ();
			console.log(room);

			// Redirect after save
			room.$join(function(response) {
				$location.path('rooms/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Room
		$scope.remove = function(room) {
			if ( room ) { 
				room.$remove();

				for (var i in $scope.rooms) {
					if ($scope.rooms [i] === room) {
						$scope.rooms.splice(i, 1);
					}
				}
			} else {
				$scope.room.$remove(function() {
					$location.path('rooms');
				});
			}
		};

		// Update existing Room
		$scope.update = function() {
			var room = $scope.room;

			room.$update(function() {
				$location.path('rooms/' + room._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Rooms
		$scope.find = function() {
			$scope.rooms = Rooms.query();
		};

		// Find existing Room
		$scope.findOne = function() {
			$scope.room = Rooms.get({ 
				roomId: $stateParams.roomId
			});
		
			
		};
	}
]);