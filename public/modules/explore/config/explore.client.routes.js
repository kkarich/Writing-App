'use strict';

//Setting up route
angular.module('explore').config(['$stateProvider',
	function($stateProvider) {
		// Explore state routing
		$stateProvider.
		state('explore', {
			url: '/explore',
			templateUrl: 'modules/explore/views/explore.client.view.html'
		});
	}
]);