'use strict';

//Setting up route
angular.module('writing-blocks').config(['$stateProvider',
	function($stateProvider) {
		// Writing blocks state routing
		$stateProvider.
		state('listWritingBlocks', {
			url: '/writing-blocks',
			templateUrl: 'modules/writing-blocks/views/list-writing-blocks.client.view.html'
		}).
		state('createWritingBlock', {
			url: '/writing-blocks/create',
			templateUrl: 'modules/writing-blocks/views/create-writing-block.client.view.html'
		}).
		state('viewWritingBlock', {
			url: '/writing-blocks/:writingBlockId',
			templateUrl: 'modules/writing-blocks/views/view-writing-block.client.view.html'
		}).
		state('editWritingBlock', {
			url: '/writing-blocks/:writingBlockId/edit',
			templateUrl: 'modules/writing-blocks/views/edit-writing-block.client.view.html'
		});
	}
]);