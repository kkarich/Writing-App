'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'popcorn';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',  'ui.router', 'ui.bootstrap', 'ui.utils','ngMaterial','btford.socket-io'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

angular.module(ApplicationConfiguration.applicationModuleName)
.config(["$mdThemingProvider", function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('deep-orange')
    .accentPalette('cyan');
}]);


//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('explore');

// declare a module
var myAppModule = angular.module('home', ['ngMaterial']);

angular.module('home')
.config(["$mdThemingProvider", function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('cyan')
    .accentPalette('cyan');
}]);
// configure the module.
// in this example we will create a greeting filter
myAppModule.controller('homeController', ["$scope", "$mdDialog", function($scope, $mdDialog) {
  $scope.showForm = function(ev) {
    $mdDialog.show({
      controller: DialogController,
      clickOutsideToClose :true,
      templateUrl: '/modules/home/mailingListForm.html',
      targetEvent: ev,
    });
  };
  
 
  
}]);

function DialogController($scope, $mdDialog,$http) {
  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };
  
   $scope.createContact = function(){
      $http.post('/contacts', $scope.contact).
          success(function(data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            $scope.message = data.message;
          }).
          error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status
            console.log('data')
          });
  };
}
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('rooms');
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('search');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('writing-blocks');
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/rooms/create');

	
		
	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		}
]);
'use strict';

angular.module('core').controller('ToolbarController', ['$scope','$mdSidenav','$mdUtil', '$log','$location','$state',
	function($scope,$mdSidenav,$mdUtil, $log,$location,$state) {
		// Toolbar controller logic
		// ...
		
    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
     
     console.log($state.current)
     
    function buildToggler(navID) {
      var debounceFn =  $mdUtil.debounce(function(){
            $mdSidenav(navID)
              .toggle()
              .then(function () {
                $log.debug('toggle ' + navID + ' is done');
              });
          },300);
      return debounceFn;
    }
	$scope.toggleLeft = buildToggler('search-panel');
 
		
	}
]);
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
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
'use strict';

angular.module('explore').controller('ExploreController', ['$scope','Rooms',
	function($scope,Rooms) {
		// Controller Logic
		// ...
		
			// Find a list of Rooms
		$scope.find = function() {
			$scope.stories = Rooms.query();
		};
		
	}
]);
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
			url: '/rooms/:roomId/view',
			templateUrl: 'modules/rooms/views/view-room.client.view.html'
		}).
		state('activeRoom', {
			url: '/rooms/:roomId',
			templateUrl: 'modules/rooms/views/active-room.client.view.html'
		}).
		state('editRoom', {
			url: '/rooms/:roomId/edit',
			templateUrl: 'modules/rooms/views/edit-room.client.view.html'
		});
	}
]);
'use strict';


// Rooms controller
angular.module('rooms').controller('ActiveRoomController', ['$scope', '$stateParams', '$location', 'Authentication', 'Rooms','WritingBlocks','Socket',
	function($scope, $stateParams, $location, Authentication, Rooms,WritingBlocks,Socket) {
		$scope.authentication = Authentication;
		
		$scope.prompt = 'The detective saw his opportunity. He grabbed the waitress’s arm and said';
		$scope.queue = {
            currentParticipant:false,
            turnTime:30000,
            timeLeftInTurn:30000,
		};
		$scope.queue.timer;
		
		$scope.roomStates = {
            WAITING:'waiting',
            READY:'ready',
            ACTIVE:'active',
            COMPLETED:'completed'
		};
		$scope.roomState = $scope.roomStates.WAITING;
		
		
	
		
        Socket.on('room.queue.change', function(position) {
            $scope.resetTimer();
            
            if ($scope.queue.currentParticipant){
                $scope.create_block();
                
            }
                
            $scope.text = '';
            if (position == 0){
                $scope.queue.currentParticipant = true;
            }
            else {
                $scope.queue.currentParticipant = false;
            }
            $scope.$apply();
            
        });
        
        Socket.on('room.queue.start', function(position) {
            $scope.startTimer();
            $scope.text = '';
            
             console.log($scope.queue,position);
            
            if (position == 0){
                $scope.queue.currentParticipant = true;
            }
            else {
                $scope.queue.currentParticipant = false;
            }
            $scope.$apply();
            
        });
        
         Socket.on('room.state', function(state) {
           $scope.roomState = state;
           $scope.$apply();
        });
        
        Socket.on('room.writing-block.created', function(writingBlock) {
            $scope.writingBlocks.push(writingBlock);
            $scope.text = '';
        });
        
        Socket.on('text.changed', function (text) {
            $scope.text = text;
        });
        
        $scope.ready = function(){
           
            Socket.emit('room.participant.ready',{user: $scope.authentication.user._id,room:$stateParams.roomId});
                
        };
        
        $scope.inputChanged = function(){
            if($scope.queue.currentParticipant){
                Socket.emit('room.text.changed',{room:$stateParams.roomId,text:$scope.text});
            }
                
        };
        // Create new writing Block
		$scope.create_block = function() {
            console.log($scope.queue.currentParticipant);
		    if($scope.queue.currentParticipant){
                console.log(this.text,$scope.room);
                var block = new WritingBlocks ({
                    text: $scope.text,
                    room:$stateParams.roomId
                });
                
                // Redirect after save
                block.$save(function(response) {
                    }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
		    }
		};

		// Find existing Room
		$scope.init = function() {
			$scope.room = Rooms.get({ 
				roomId: $stateParams.roomId
			}, function(room){
                if(room.completed){
                    console.log('room is completed');
                    $scope.roomState = $scope.roomStates.COMPLETED;
                }
                else{
                    Socket.emit('join', {user: $scope.authentication.user._id,room:$stateParams.roomId});
                    console.log('emit join');
                }
			});
			
			$scope.writingBlocks = Rooms.writingBlocks({ 
				roomId: $stateParams.roomId
			});
			
		};
		
		// Start timer
		$scope.startTimer = function() {
            $scope.queue.timer = setInterval(function(){
                $scope.queue.timeLeftInTurn-= 100;
                $scope.percentLeft = parseInt($scope.queue.timeLeftInTurn / $scope.queue.turnTime * 100);
                $scope.$apply();
            }, 100);  
		};
		
		// Reset Timer
		$scope.resetTimer = function() {
			$scope.queue.timeLeftInTurn = $scope.queue.turnTime;
		};
	}
]);
'use strict';

// Rooms controller
angular.module('rooms').controller('RoomsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Rooms','WritingBlocks',
	function($scope, $stateParams, $location, Authentication, Rooms,WritingBlocks) {
		$scope.authentication = Authentication;
        $scope.room = {
            prompt:'some random prompt',
            active:false,
            filled:false
        };
 
		// Create new Room
		$scope.create = function() {
			// Create new Room object
			var room = new Rooms ({
				prompt:$scope.room.prompt
			});

			// Redirect after save
			room.$save(function(response) {
				$location.path('rooms/' + response._id);
				// Clear form fields
				$scope.room.prompt = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
		
		//	join room
		$scope.join = function() {
			// Create new Room object
			var room = new Rooms ();
			console.log(room);

			// Redirect after save
			room.$join(function(response) {
				$location.path('rooms/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Room
		$scope.remove = function(room) {
			if ( room ) { 
				room.$remove();

				for (var i in $scope.rooms) {
					if ($scope.rooms [i] === room) {
						$scope.rooms.splice(i, 1);
					}
				}
			} else {
				$scope.room.$remove(function() {
					$location.path('rooms');
				});
			}
		};

		// Update existing Room
		$scope.update = function() {
			var room = $scope.room;

			room.$update(function() {
				$location.path('rooms/' + room._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Rooms
		$scope.find = function() {
			$scope.rooms = Rooms.query();
		};

		// Find existing Room
		$scope.findOne = function() {
			$scope.room = Rooms.get({ 
				roomId: $stateParams.roomId
			});
		
			
		};
	}
]);
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
'use strict';

//socket factory that provides the socket service
angular.module('core').factory('Socket', ['socketFactory',
    function(socketFactory) {
        return socketFactory({
            prefix: '',
            ioSocket: io.connect('http://uckk89a260b1.crowdsourcecreativity.koding.io:3000')
        });
    }
]);
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
'use strict';

angular.module('search').controller('SearchNavController', ['$scope',
	function($scope) {
		// Search nav controller logic
		// ...
	}
]);
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
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