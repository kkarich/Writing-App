'use strict';

// Writing blocks controller
angular.module('writing-blocks').controller('WritingBlocksController', ['$scope', '$stateParams', '$location', 'Authentication', 'WritingBlocks',
	function($scope, $stateParams, $location, Authentication, WritingBlocks) {
		$scope.authentication = Authentication;

		// Create new Writing block
		$scope.create = function() {
			// Create new Writing block object
			var writingBlock = new WritingBlocks ({
				name: this.name
			});

			// Redirect after save
			writingBlock.$save(function(response) {
				$location.path('writing-blocks/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Writing block
		$scope.remove = function(writingBlock) {
			if ( writingBlock ) { 
				writingBlock.$remove();

				for (var i in $scope.writingBlocks) {
					if ($scope.writingBlocks [i] === writingBlock) {
						$scope.writingBlocks.splice(i, 1);
					}
				}
			} else {
				$scope.writingBlock.$remove(function() {
					$location.path('writing-blocks');
				});
			}
		};

		// Update existing Writing block
		$scope.update = function() {
			var writingBlock = $scope.writingBlock;

			writingBlock.$update(function() {
				$location.path('writing-blocks/' + writingBlock._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Writing blocks
		$scope.find = function() {
			$scope.writingBlocks = WritingBlocks.query();
		};

		// Find existing Writing block
		$scope.findOne = function() {
			$scope.writingBlock = WritingBlocks.get({ 
				writingBlockId: $stateParams.writingBlockId
			});
		};
	}
]);