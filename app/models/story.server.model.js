'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Story Schema
 */
var StorySchema = new Schema({
	// Story model fields   
	// ...
	prompt: {
		type: String,
		default: '',
		trim: true
	},
	category: {
		type: String,
		default: '',
		trim: true
	},
	writing_blocks: [{
        text: {
            type: String,
            default: '',
            trim: true
        },
        user: {
            type: Schema.ObjectId,
            ref: 'User'
            
        }
    }],
    completed: {
		type: Date,
		default: Date.now
	},
	creator: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Story', StorySchema);