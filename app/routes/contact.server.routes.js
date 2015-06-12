'use strict';

module.exports = function(app) {
	var contacts = require('../../app/controllers/contact.server.controller');
	
	// Rooms Routes
	app.route('/contacts')
	.get(contacts.list)
		.post( contacts.create);
};