'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	WritingBlock = mongoose.model('WritingBlock');

/**
 * Globals
 */
var user, writingBlock;

/**
 * Unit tests
 */
describe('Writing block Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			writingBlock = new WritingBlock({
				name: 'Writing block Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return writingBlock.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			writingBlock.name = '';

			return writingBlock.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		WritingBlock.remove().exec();
		User.remove().exec();

		done();
	});
});