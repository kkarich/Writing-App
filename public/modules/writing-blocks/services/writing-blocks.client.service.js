'use strict';

//Writing blocks service used to communicate Writing blocks REST endpoints
angular.module('writing-blocks').factory('WritingBlocks', ['$resource',
	function($resource) {
		return $resource('writing-blocks/:writingBlockId', { writingBlockId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);