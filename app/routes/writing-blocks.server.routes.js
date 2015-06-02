'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var writingBlocks = require('../../app/controllers/writing-blocks.server.controller');

	// Writing blocks Routes
	app.route('/writing-blocks')
		.get(writingBlocks.list)
		.post( writingBlocks.create);

	app.route('/writing-blocks/:writingBlockId')
		.get(writingBlocks.read)
		.put(users.requiresLogin, writingBlocks.hasAuthorization, writingBlocks.update)
		.delete(users.requiresLogin, writingBlocks.hasAuthorization, writingBlocks.delete);

	// Finish by binding the Writing block middleware
	app.param('writingBlockId', writingBlocks.writingBlockByID);
};
