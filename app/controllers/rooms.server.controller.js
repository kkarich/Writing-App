'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Room = mongoose.model('Room'),
	WritingBlock = mongoose.model('WritingBlock'),
	_ = require('lodash');

/**
 * Create a Room
 */
 
exports.update = function(room){
    console.log('test')
    Room.findById(room._id).populate('user', 'displayName').exec(function(err, roomObj) {
        
		roomObj = _.extend(roomObj , room);
        
    	roomObj.save(function(err) {
    		if (err) {
    			return err
    		} else {
    			console.log(roomObj)
    		}
    	});
	});
    
	
};

 
exports.create = function(req, res) {
	var room = new Room(req.body);
	room.user = req.user;

	room.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
		
            var socketio = req.app.get('socketio'); // tacke out socket instance from the app container
            socketio.sockets.emit('room.created', room); // emit an event for all connected clients
			res.jsonp(room);
		}
	});
};

/**
 * Join/create room
 */
exports.join = function(req, res) {
    
    Room.findOne({full:false,completed:false}).sort('-created').populate('user', 'displayName').exec(function(err, room) {
		//If there is an error return the error
		if (err) {
            console.log(err);
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		//If no error check if a room was found 
		} else {
		    //If room was found, use that room
            if(room) {
                
                res.jsonp(room);
                
            }
            //If no room was found create a new one and use that room
            else{
                var new_room = new Room(req.body);
                new_room.user = req.user;

                new_room.save(function(err) {
                    if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    } else {
                        res.jsonp(new_room);
                    }
                });
            }
		}
	});
    
	
};

/**
 * Show the current Room
 */
exports.read = function(req, res) {
	res.jsonp(req.room);
};

/**
 * Update a Room

exports.update = function(req, res) {
	var room = req.room ;

	room = _.extend(room , req.body);

	room.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(room);
		}
	});
};
 */
/**
 * Delete an Room
 */
exports.delete = function(req, res) {
	var room = req.room ;

	room.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(room);
		}
	});
};

/**
 * List of Rooms
 */
exports.list = function(req, res) { 
	Room.find().sort('-created').populate('user', 'displayName').exec(function(err, rooms) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(rooms);
		}
	});
};

/**
 * List of Writing blocks for room
 */
exports.writingBlocks = function(req, res) { 
	WritingBlock.find({room:req.room}).sort('created').populate('user', 'displayName').exec(function(err, writingBlocks) {
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
 * Room middleware
 */
exports.roomByID = function(req, res, next, id) { 
	Room.findById(id).populate('user', 'displayName').exec(function(err, room) {
		if (err) return next(err);
		if (! room) return next(new Error('Failed to load Room ' + id));
		req.room = room ;
		next();
	});
};

/**
 * Room authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.room.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
