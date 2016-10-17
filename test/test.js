var request = require('request')
, express = require('express')
,assert = require("assert")
,http = require("http");

describe('http tests', function(){

	it('should return the homepage if the url is correct', function(done){
		http.get('http://localhost:3000/', function(res) {
			assert.equal(200, res.statusCode);
			done();
		});
	});
	
	it('testing with correct credentials', function(done){
		request.post('http://localhost:3000/aftersignin',
				{form:{email:'vishal.gangrade@accenture.com',password:'vishal123'}}, function(error,response,body) {
			assert.equal(200, response.statusCode);
			done();
		})
	});
	
	it('will goto Women Fashion page', function(done){
		request.get('http://localhost:3000/womenfashion',function(error,response,body) {
			assert.equal(200, response.statusCode);
			done();
		})
	});
	
	it('will goto Cart Page', function(done){
				request.get('http://localhost:3000/cart',function(error,response,body) {
			assert.equal(200, response.statusCode);
			done();
		})
	});

	
	it('will go to Electronic Auction page', function(done){
		request.get('http://localhost:3000/electronicauction', function(error,response,body) {
			assert.equal(200, response.statusCode);
			done();
		})
	});
	
});