'use strict';


// Rooms controller
angular.module('rooms').controller('ActiveRoomController', ['$scope', '$stateParams', '$location', 'Authentication', 'Rooms','WritingBlocks','Socket',
	function($scope, $stateParams, $location, Authentication, Rooms,WritingBlocks,Socket) {
		$scope.authentication = Authentication;
		
		Socket.emit('join', $stateParams.roomId) ;
        		
		Socket.on('room.created', function(room) {
            console.log(room);
        });
        
        Socket.on('room.writing-block.created', function(writingBlock) {
            console.log(writingBlock);
            $scope.writingBlocks.push(writingBlock);
            $scope.text = '';
        });
        
        Socket.on('text.changed', function (text) {
            console.log(text)
            $scope.text = text;
        });
        
        $scope.inputChanged = function(){
            console.log('change')
            Socket.emit('room.text.changed',{room:$stateParams.roomId,text:$scope.text});
        };
        // Create new writing Block
		$scope.create_block = function() {
			console.log(this.text,$scope.room);
			var block = new WritingBlocks ({
				text: $scope.text,
				room:$stateParams.roomId
			});

			// Redirect after save
			block.$save(function(response) {
			    console.log(response)
			    	
			}, function(errorResponse) {
			    console.log(errorResponse)
				$scope.error = errorResponse.data.message;
			});
		};

		// Create new Room
		$scope.create = function() {
			// Create new Room object
			console.log(this.title)
			var room = new Rooms ({
				prompt:$scope.room.prompt
			});

			// Redirect after save
			room.$save(function(response) {
				$location.path('rooms/' + response._id);
                console.log(response)
				// Clear form fields
				$scope.name = '';
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
		$scope.init = function() {
			$scope.room = Rooms.get({ 
				roomId: $stateParams.roomId
			});
			$scope.writingBlocks = Rooms.writingBlocks({ 
				roomId: $stateParams.roomId
			});
			
		};
	}
]);