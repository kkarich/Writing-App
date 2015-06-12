'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    _ = require('lodash'),
    Contact = mongoose.model('Contact');

/**
 * Create a Contact
 */
exports.create = function(req, res) {
        var contact = new Contact(req.body);
        
        Contact.findOne({email:contact.email}).sort('-created').exec(function(err, new_contact) {
		//If there is an error return the error
		if (err) {
            console.log(err);
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		//If no error check if a room was found 
		} else {
		    //If contact was found, send back message
            if(new_contact) {
                var data = {message:'We already have your email'};
                res.jsonp(data);
                
            }
            //If no room was found create a new one and use that room
            else{
                	contact.save(function(err) {
                    if (err) {
                        return res.status(400).send({
            				message: errorHandler.getErrorMessage(err)
            			});
            		} else {
            		    var data = {message: contact.email + ' was successfully added to our mailing list'};
            		    console.log(data)
            		    res.jsonp(data);
            		}
            	});
            }
		}
	});
    
	


};

/**
 * Show the current Contact
 */
exports.read = function(req, res) {

};

/**
 * Update a Contact
 */
exports.update = function(req, res) {

};

/**
 * Delete an Contact
 */
exports.delete = function(req, res) {

};

/**
 * List of Contacts
 */
exports.list = function(req, res) {
	Contact.find().sort('-created').exec(function(err, contacts) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(contacts);
		}
	});
};