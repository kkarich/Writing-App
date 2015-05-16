'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	WritingBlock = mongoose.model('WritingBlock'),
	_ = require('lodash');

/**
 * Create a Writing block
 */
exports.create = function(req, res) {
	var writingBlock = new WritingBlock(req.body);
	writingBlock.user = req.user;
	console.log(writingBlock);

	writingBlock.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
		     var socketio = req.app.get('socketio'); // tacke out socket instance from the app container
            socketio.sockets.to(writingBlock.room).emit('room.writing-block.created', writingBlock); // emit an event for all connected clients
		
			res.jsonp(writingBlock);
		}
	});
};

/**
 * Show the current Writing block
 */
exports.read = function(req, res) {
	res.jsonp(req.writingBlock);
};

/**
 * Update a Writing block
 */
exports.update = function(req, res) {
	var writingBlock = req.writingBlock ;

	writingBlock = _.extend(writingBlock , req.body);

	writingBlock.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(writingBlock);
		}
	});
};

/**
 * Delete an Writing block
 */
exports.delete = function(req, res) {
	var writingBlock = req.writingBlock ;

	writingBlock.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(writingBlock);
		}
	});
};

/**
 * List of Writing blocks
 */
exports.list = function(req, res) { 
	WritingBlock.find().sort('-created').populate('user', 'displayName').exec(function(err, writingBlocks) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(writingBlocks);
		}
	});
};

/**
 * Writing block middleware
 */
exports.writingBlockByID = function(req, res, next, id) { 
	WritingBlock.findById(id).populate('user', 'displayName').exec(function(err, writingBlock) {
		if (err) return next(err);
		if (! writingBlock) return next(new Error('Failed to load Writing block ' + id));
		req.writingBlock = writingBlock ;
		next();
	});
};

/**
 * Writing block authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.writingBlock.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
