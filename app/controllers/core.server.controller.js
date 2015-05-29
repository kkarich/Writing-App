'use strict';

/**
 * Module dependencies.
 */
exports.index = function(req, res) {
	res.render('index', {
		user: req.user || null,
		request: req
	});
};

exports.home = function(req, res) {
	res.render('home', {
		user: req.user || null,
		request: req
	});
};