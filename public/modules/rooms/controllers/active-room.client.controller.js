'use strict';


// Rooms controller
angular.module('rooms').controller('ActiveRoomController', ['$scope', '$stateParams', '$location', 'Authentication', 'Rooms','WritingBlocks','Socket',
	function($scope, $stateParams, $location, Authentication, Rooms,WritingBlocks,Socket) {
		$scope.authentication = Authentication;
		
		$scope.queue = {};
		$scope.queue.currentParticipant = false;
		
		var timer;
		$scope.maxTime = 30000;
		$scope.timeLeft = $scope.maxTime;
		$scope.roomStates = {
            WAITING:'waiting',
            READY:'ready',
            ACTIVE:'active',
            COMPLETED:'completed'
		};
		$scope.roomState = $scope.roomStates.WAITING;
		
		
		Socket.emit('join', {user: $scope.authentication.user._id,room:$stateParams.roomId});
		
		
        Socket.on('room.queue.change', function(position) {
            $scope.startTimer();
            console.log('block create',position)
           
            
            if ($scope.queue.currentParticipant){
                console.log('create block')
                $scope.create_block();}
                
            $scope.text = '';
            if (position == 0){
                $scope.queue.currentParticipant = true;
            }
            else {
                $scope.queue.currentParticipant = false;
            }
            $scope.$apply();
            
        });
        
        Socket.on('room.queue.start', function(position) {
            $scope.startTimer();
            $scope.text = '';
            
             console.log($scope.queue,position)
            
            if (position == 0){
                $scope.queue.currentParticipant = true;
            }
            else {
                $scope.queue.currentParticipant = false;
            }
            $scope.$apply();
            
        });
        
         Socket.on('room.state', function(state) {
           $scope.roomState = state;
           $scope.$apply();
        });
        
        Socket.on('room.writing-block.created', function(writingBlock) {
            $scope.writingBlocks.push(writingBlock);
            $scope.text = '';
        });
        
        Socket.on('text.changed', function (text) {
            $scope.text = text;
        });
        
        $scope.ready = function(){
           
            Socket.emit('room.participant.ready',{user: $scope.authentication.user._id,room:$stateParams.roomId});
                
        };
        
        $scope.inputChanged = function(){
            if($scope.queue.currentParticipant){
                Socket.emit('room.text.changed',{user: $scope.authentication.user._id,room:$stateParams.roomId,text:$scope.text});
            }
                
            };
        // Create new writing Block
		$scope.create_block = function() {
		    console.log($scope.queue.currentParticipant)
		    if($scope.queue.currentParticipant){
                console.log(this.text,$scope.room);
                var block = new WritingBlocks ({
                    text: $scope.text,
                    room:$stateParams.roomId
                });
                
                // Redirect after save
                block.$save(function(response) {
                    }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
		    }
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
		
		// Find existing Room
		$scope.startTimer = function() {
			$scope.timeLeft = $scope.maxTime;
			
			if ( angular.isDefined(timer) ) return;
			
            timer = setInterval(function(){
                $scope.timeLeft-= 100;
                $scope.percentLeft = parseInt($scope.timeLeft / $scope.maxTime * 100);
                $scope.$apply();
            }, 100);  
		};
	}
]);