'use strict';


// Rooms controller
angular.module('rooms').controller('ActiveRoomController', ['$scope', '$stateParams', '$location', 'Authentication', 'Rooms','WritingBlocks','Socket',
	function($scope, $stateParams, $location, Authentication, Rooms,WritingBlocks,Socket) {
		$scope.authentication = Authentication;
		
		$scope.prompt = 'The detective saw his opportunity. He grabbed the waitress’s arm and said';
		$scope.queue = {
            currentParticipant:false,
            turnTime:30000,
            timeLeftInTurn:30000,
		};
		$scope.queue.timer;
		
		$scope.roomStates = {
            WAITING:'waiting',
            READY:'ready',
            ACTIVE:'active',
            COMPLETED:'completed'
		};
		$scope.roomState = $scope.roomStates.WAITING;
		
		
	
		
        Socket.on('room.queue.change', function(position) {
            $scope.resetTimer();
            
            if ($scope.queue.currentParticipant){
                $scope.create_block();
                
            }
                
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
            
             console.log($scope.queue,position);
            
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
                Socket.emit('room.text.changed',{room:$stateParams.roomId,text:$scope.text});
            }
                
        };
        // Create new writing Block
		$scope.create_block = function() {
            console.log($scope.queue.currentParticipant);
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

		// Find existing Room
		$scope.init = function() {
			$scope.room = Rooms.get({ 
				roomId: $stateParams.roomId
			}, function(room){
                if(room.completed){
                    console.log('room is completed');
                    $scope.roomState = $scope.roomStates.COMPLETED;
                }
                else{
                    Socket.emit('join', {user: $scope.authentication.user._id,room:$stateParams.roomId});
                    console.log('emit join');
                }
			});
			
			$scope.writingBlocks = Rooms.writingBlocks({ 
				roomId: $stateParams.roomId
			});
			
		};
		
		// Start timer
		$scope.startTimer = function() {
            $scope.queue.timer = setInterval(function(){
                $scope.queue.timeLeftInTurn-= 100;
                $scope.percentLeft = parseInt($scope.queue.timeLeftInTurn / $scope.queue.turnTime * 100);
                $scope.$apply();
            }, 100);  
		};
		
		// Reset Timer
		$scope.resetTimer = function() {
			$scope.queue.timeLeftInTurn = $scope.queue.turnTime;
		};
	}
]);