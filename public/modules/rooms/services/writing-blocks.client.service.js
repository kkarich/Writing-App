'use strict';

angular.module('rooms').factory('WritingBlocks', ['$resource',
	function($resource) {
		return $resource('writing-blocks/:writingBlockId', { writingBlockId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);