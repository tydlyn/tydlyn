// force the test environment to 'test'
process.env.NODE_ENV = 'test';

// get the application server module
var app = require('../../server');
var assert = require('assert');

describe('contact page', function() {
	it('should show contact a form');
	it('should refuse empty submissions');
	it('should refuse partial submissions');
	it('should keep values on partial submissions');
	it('should refuse invalid emails');
	it('should accept complete submissions');
});