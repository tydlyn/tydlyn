// force the test environment to 'test'
process.env.NODE_ENV = 'test';

// get the application server module
var app = require('../../server/server');
var zombie = require('zombie');
var request = require('supertest');

describe('GET /', function(){
	before(function() {
		this.server = http.createServer(app).listen(3000);
		this.browser = new zombie({ site: 'http://localhost:3000' });
	});

	// load the main page before each test
	beforeEach(function(done) {
		this.browser.visit('/', done);
	});

	it('respond with plain text', function(done){
		request(app)
			.get('/')
			.expect(200, done);
	})

	after(function(done) {
		this.server.close(done);
	});
})