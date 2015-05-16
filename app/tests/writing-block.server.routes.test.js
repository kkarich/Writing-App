'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	WritingBlock = mongoose.model('WritingBlock'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, writingBlock;

/**
 * Writing block routes tests
 */
describe('Writing block CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Writing block
		user.save(function() {
			writingBlock = {
				name: 'Writing block Name'
			};

			done();
		});
	});

	it('should be able to save Writing block instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Writing block
				agent.post('/writing-blocks')
					.send(writingBlock)
					.expect(200)
					.end(function(writingBlockSaveErr, writingBlockSaveRes) {
						// Handle Writing block save error
						if (writingBlockSaveErr) done(writingBlockSaveErr);

						// Get a list of Writing blocks
						agent.get('/writing-blocks')
							.end(function(writingBlocksGetErr, writingBlocksGetRes) {
								// Handle Writing block save error
								if (writingBlocksGetErr) done(writingBlocksGetErr);

								// Get Writing blocks list
								var writingBlocks = writingBlocksGetRes.body;

								// Set assertions
								(writingBlocks[0].user._id).should.equal(userId);
								(writingBlocks[0].name).should.match('Writing block Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Writing block instance if not logged in', function(done) {
		agent.post('/writing-blocks')
			.send(writingBlock)
			.expect(401)
			.end(function(writingBlockSaveErr, writingBlockSaveRes) {
				// Call the assertion callback
				done(writingBlockSaveErr);
			});
	});

	it('should not be able to save Writing block instance if no name is provided', function(done) {
		// Invalidate name field
		writingBlock.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Writing block
				agent.post('/writing-blocks')
					.send(writingBlock)
					.expect(400)
					.end(function(writingBlockSaveErr, writingBlockSaveRes) {
						// Set message assertion
						(writingBlockSaveRes.body.message).should.match('Please fill Writing block name');
						
						// Handle Writing block save error
						done(writingBlockSaveErr);
					});
			});
	});

	it('should be able to update Writing block instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Writing block
				agent.post('/writing-blocks')
					.send(writingBlock)
					.expect(200)
					.end(function(writingBlockSaveErr, writingBlockSaveRes) {
						// Handle Writing block save error
						if (writingBlockSaveErr) done(writingBlockSaveErr);

						// Update Writing block name
						writingBlock.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Writing block
						agent.put('/writing-blocks/' + writingBlockSaveRes.body._id)
							.send(writingBlock)
							.expect(200)
							.end(function(writingBlockUpdateErr, writingBlockUpdateRes) {
								// Handle Writing block update error
								if (writingBlockUpdateErr) done(writingBlockUpdateErr);

								// Set assertions
								(writingBlockUpdateRes.body._id).should.equal(writingBlockSaveRes.body._id);
								(writingBlockUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Writing blocks if not signed in', function(done) {
		// Create new Writing block model instance
		var writingBlockObj = new WritingBlock(writingBlock);

		// Save the Writing block
		writingBlockObj.save(function() {
			// Request Writing blocks
			request(app).get('/writing-blocks')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Writing block if not signed in', function(done) {
		// Create new Writing block model instance
		var writingBlockObj = new WritingBlock(writingBlock);

		// Save the Writing block
		writingBlockObj.save(function() {
			request(app).get('/writing-blocks/' + writingBlockObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', writingBlock.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Writing block instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Writing block
				agent.post('/writing-blocks')
					.send(writingBlock)
					.expect(200)
					.end(function(writingBlockSaveErr, writingBlockSaveRes) {
						// Handle Writing block save error
						if (writingBlockSaveErr) done(writingBlockSaveErr);

						// Delete existing Writing block
						agent.delete('/writing-blocks/' + writingBlockSaveRes.body._id)
							.send(writingBlock)
							.expect(200)
							.end(function(writingBlockDeleteErr, writingBlockDeleteRes) {
								// Handle Writing block error error
								if (writingBlockDeleteErr) done(writingBlockDeleteErr);

								// Set assertions
								(writingBlockDeleteRes.body._id).should.equal(writingBlockSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Writing block instance if not signed in', function(done) {
		// Set Writing block user 
		writingBlock.user = user;

		// Create new Writing block model instance
		var writingBlockObj = new WritingBlock(writingBlock);

		// Save the Writing block
		writingBlockObj.save(function() {
			// Try deleting Writing block
			request(app).delete('/writing-blocks/' + writingBlockObj._id)
			.expect(401)
			.end(function(writingBlockDeleteErr, writingBlockDeleteRes) {
				// Set message assertion
				(writingBlockDeleteRes.body.message).should.match('User is not logged in');

				// Handle Writing block error error
				done(writingBlockDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		WritingBlock.remove().exec();
		done();
	});
});