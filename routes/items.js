var ejs = require("ejs");

exports.profile= function(req,res) {
	res.render('profile');
};

exports.menfootwear= function(req,res) {
	res.render('menfootwear');
};

exports.electronics= function(req,res) {
	res.render('electronics');
};

exports.sportinggoods= function(req,res) {
	res.render('sportinggoods');
};