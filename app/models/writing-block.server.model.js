'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Writing block Schema
 */
var WritingBlockSchema = new Schema({
	text: {
		type: String,
		default: '',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	room: {
		type: Schema.ObjectId,
		ref: 'Room'
	}
});

mongoose.model('WritingBlock', WritingBlockSchema);