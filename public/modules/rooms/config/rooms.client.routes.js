'use strict';

//Setting up route
angular.module('rooms').config(['$stateProvider',
	function($stateProvider) {
		// Rooms state routing
		$stateProvider.
		state('listRooms', {
			url: '/rooms',
			templateUrl: 'modules/rooms/views/list-rooms.client.view.html'
		}).
		state('createRoom', {
			url: '/rooms/create',
			templateUrl: 'modules/rooms/views/create-room.client.view.html'
		}).
		state('viewRoom', {
			url: '/rooms/:roomId',
			templateUrl: 'modules/rooms/views/view-room.client.view.html'
		}).
		state('editRoom', {
			url: '/rooms/:roomId/edit',
			templateUrl: 'modules/rooms/views/edit-room.client.view.html'
		});
	}
]);