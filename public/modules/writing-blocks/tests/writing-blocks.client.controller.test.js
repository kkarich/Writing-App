'use strict';

(function() {
	// Writing blocks Controller Spec
	describe('Writing blocks Controller Tests', function() {
		// Initialize global variables
		var WritingBlocksController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Writing blocks controller.
			WritingBlocksController = $controller('WritingBlocksController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Writing block object fetched from XHR', inject(function(WritingBlocks) {
			// Create sample Writing block using the Writing blocks service
			var sampleWritingBlock = new WritingBlocks({
				name: 'New Writing block'
			});

			// Create a sample Writing blocks array that includes the new Writing block
			var sampleWritingBlocks = [sampleWritingBlock];

			// Set GET response
			$httpBackend.expectGET('writing-blocks').respond(sampleWritingBlocks);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.writingBlocks).toEqualData(sampleWritingBlocks);
		}));

		it('$scope.findOne() should create an array with one Writing block object fetched from XHR using a writingBlockId URL parameter', inject(function(WritingBlocks) {
			// Define a sample Writing block object
			var sampleWritingBlock = new WritingBlocks({
				name: 'New Writing block'
			});

			// Set the URL parameter
			$stateParams.writingBlockId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/writing-blocks\/([0-9a-fA-F]{24})$/).respond(sampleWritingBlock);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.writingBlock).toEqualData(sampleWritingBlock);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(WritingBlocks) {
			// Create a sample Writing block object
			var sampleWritingBlockPostData = new WritingBlocks({
				name: 'New Writing block'
			});

			// Create a sample Writing block response
			var sampleWritingBlockResponse = new WritingBlocks({
				_id: '525cf20451979dea2c000001',
				name: 'New Writing block'
			});

			// Fixture mock form input values
			scope.name = 'New Writing block';

			// Set POST response
			$httpBackend.expectPOST('writing-blocks', sampleWritingBlockPostData).respond(sampleWritingBlockResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Writing block was created
			expect($location.path()).toBe('/writing-blocks/' + sampleWritingBlockResponse._id);
		}));

		it('$scope.update() should update a valid Writing block', inject(function(WritingBlocks) {
			// Define a sample Writing block put data
			var sampleWritingBlockPutData = new WritingBlocks({
				_id: '525cf20451979dea2c000001',
				name: 'New Writing block'
			});

			// Mock Writing block in scope
			scope.writingBlock = sampleWritingBlockPutData;

			// Set PUT response
			$httpBackend.expectPUT(/writing-blocks\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/writing-blocks/' + sampleWritingBlockPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid writingBlockId and remove the Writing block from the scope', inject(function(WritingBlocks) {
			// Create new Writing block object
			var sampleWritingBlock = new WritingBlocks({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Writing blocks array and include the Writing block
			scope.writingBlocks = [sampleWritingBlock];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/writing-blocks\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleWritingBlock);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.writingBlocks.length).toBe(0);
		}));
	});
}());