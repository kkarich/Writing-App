'use strict';

(function() {
	// Rooms Controller Spec
	describe('Rooms Controller Tests', function() {
		// Initialize global variables
		var RoomsController,
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

			// Initialize the Rooms controller.
			RoomsController = $controller('RoomsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Room object fetched from XHR', inject(function(Rooms) {
			// Create sample Room using the Rooms service
			var sampleRoom = new Rooms({
				name: 'New Room'
			});

			// Create a sample Rooms array that includes the new Room
			var sampleRooms = [sampleRoom];

			// Set GET response
			$httpBackend.expectGET('rooms').respond(sampleRooms);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.rooms).toEqualData(sampleRooms);
		}));

		it('$scope.findOne() should create an array with one Room object fetched from XHR using a roomId URL parameter', inject(function(Rooms) {
			// Define a sample Room object
			var sampleRoom = new Rooms({
				name: 'New Room'
			});

			// Set the URL parameter
			$stateParams.roomId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/rooms\/([0-9a-fA-F]{24})$/).respond(sampleRoom);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.room).toEqualData(sampleRoom);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Rooms) {
			// Create a sample Room object
			var sampleRoomPostData = new Rooms({
				name: 'New Room'
			});

			// Create a sample Room response
			var sampleRoomResponse = new Rooms({
				_id: '525cf20451979dea2c000001',
				name: 'New Room'
			});

			// Fixture mock form input values
			scope.name = 'New Room';

			// Set POST response
			$httpBackend.expectPOST('rooms', sampleRoomPostData).respond(sampleRoomResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Room was created
			expect($location.path()).toBe('/rooms/' + sampleRoomResponse._id);
		}));

		it('$scope.update() should update a valid Room', inject(function(Rooms) {
			// Define a sample Room put data
			var sampleRoomPutData = new Rooms({
				_id: '525cf20451979dea2c000001',
				name: 'New Room'
			});

			// Mock Room in scope
			scope.room = sampleRoomPutData;

			// Set PUT response
			$httpBackend.expectPUT(/rooms\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/rooms/' + sampleRoomPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid roomId and remove the Room from the scope', inject(function(Rooms) {
			// Create new Room object
			var sampleRoom = new Rooms({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Rooms array and include the Room
			scope.rooms = [sampleRoom];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/rooms\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleRoom);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.rooms.length).toBe(0);
		}));
	});
}());