'use strict';

//Rooms service used to communicate Rooms REST endpoints
angular.module('rooms').factory('Rooms', ['$resource',
	function($resource) {
		return $resource('rooms/:roomId', { roomId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
			writingBlocks:{
			    url: '/rooms/:roomId/writing-blocks',
			    method: 'GET',
			    isArray:true,
			},
			join:{
			    url: '/rooms/join',
			    method: 'POST'
			}
		});
	}
]);