'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var rooms = require('../../app/controllers/rooms.server.controller');

	// Rooms Routes
	app.route('/rooms')
		.get(rooms.join)
		.post( rooms.create);
	app.route('/rooms/join')
		.post( rooms.join);

	app.route('/rooms/:roomId')
		.get(rooms.read)
		.put(users.requiresLogin, rooms.hasAuthorization, rooms.update)
		.delete(users.requiresLogin, rooms.hasAuthorization, rooms.delete);
	app.route('/rooms/:roomId/writing-blocks')
		.get(rooms.writingBlocks);

	// Finish by binding the Room middleware
	app.param('roomId', rooms.roomByID);
};
