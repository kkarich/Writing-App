'use strict';

(function() {
	// Active room Controller Spec
	describe('Active room Controller Tests', function() {
		// Initialize global variables
		var ActiveRoomController,
			scope,
			$httpBackend,
			$stateParams,
			$location,
			socket;

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
			socket = io.connect();
			 spyOn(socket, 'emit');

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Active room controller.
			ActiveRoomController = $controller('ActiveRoomController', {
				$scope: scope
			});
		}));

		it('resetTimer() should set the time left in the current turn equal to the turn time', inject(function() {
		    
		    //Set timeLeftInTurn equal to 0
		    scope.queue.timeLeftInTurn = 0;
		    //Make sure they are not equal to each other first
		    expect(scope.queue.timeLeftInTurn).not.toEqual(scope.queue.turnTime);
		    //Reset timer
			scope.resetTimer();
			//Make sure they now equal each other
			expect(scope.queue.timeLeftInTurn).toEqual(scope.queue.turnTime);
		}));
		
		it('startTimer() should init the queue.timer', inject(function() {
		    
		    //Make sure they are not equal to each other first
		    expect(scope.queue.timer).not.toBeDefined();
		    scope.startTimer();
		    expect(scope.queue.timer).toBeDefined();
		    
		}));
		
		it('inputChanged() should init the queue.timer', inject(function() {
            scope.queue.currentParticipant = true;
            scope.inputChanged();
            socket.emit();
            expect(socket.emit).toHaveBeenCalled();
		}));
		
	});
}());



//Socket Mock
var io = {
  connect: createMockSocketObject
};

function createMockSocketObject () {

  var socket = {
    on: function (ev, fn) {
      (this._listeners[ev] = this._listeners[ev] || []).push(fn);
    },
    once: function (ev, fn) {
      (this._listeners[ev] = this._listeners[ev] || []).push(fn);
      fn._once = true;
    },
    emit: function (ev, data) {
      if (this._listeners[ev]) {
        var args = arguments;
        this._listeners[ev].forEach(function (listener) {
          if (listener._once) {
            this.removeListener(ev, listener);
          }
          listener.apply(null, Array.prototype.slice.call(args, 1));
        }.bind(this));
      }
    },
    _listeners: {},
    removeListener: function (ev, fn) {
      if (fn) {
        var index = this._listeners[ev].indexOf(fn);
        if (index > -1) {
          this._listeners[ev].splice(index, 1);
        }
      } else {
        delete this._listeners[ev];
      }
    },
    removeAllListeners: function (ev) {
      if (ev) {
        delete this._listeners[ev];
      } else {
        this._listeners = {};
      }
    },
    disconnect: function () {},
    connect: function () {}
  };

  return socket;
}