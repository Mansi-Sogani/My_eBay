var ejs = require("ejs");
var mysql = require('./mysql');
var encryption = require('./encryption');
var winston = require('winston');
var sess;

exports.index= function(req,res){
	winston.log('info', " "+req.session.email+" went to home page");
	res.render('homepage');
};

exports.signin= function(req,res) {
	winston.log('info', " Signin page rendered");
	res.render('signin');
};
exports.save= function(req,res) {
	console.log('from add button index file');
	winston.log('info', "data saved");
	res.render('addproduct');
};
exports.addbidproduct= function(req,res) {
	console.log('from add button index file');
	res.render('addbidproduct');
};
exports.afterSignIn= function(req, res){
	var email = req.body.username;
	var password = req.body.password;
	req.session.email=email;
	var encrypted_password=encryption.encrypt(password);
	console.log("hi " + encrypted_password);
	var sess= req.session;
	console.log("Session:"+ JSON.stringify(sess));
	//var output;
	//console.log(JSON.stringify(req.body));
	var getuser = "SELECT * FROM userinfo WHERE email = '"+ email +"' and password = '"+ encrypted_password +"'";
	mysql.fetchdata(function(err, results){
		if(err){
			throw err;
		}
		else{
			if(results.length > 0){
				sess.email = results[0].email;
				console.log(JSON.stringify(sess.email));
				
				res.send({status:200});
			}
			else{
				res.send({status:400});
			}
		}
	},getuser);
};
exports.homepage=function(req,res){			//checked
	sess=req.session;
	if(sess.email){
		res.render('homepage');
	}
	else{
		res.render('signin'); // could add res.redirect('/login');
	}
};
exports.logout = function(req,res){
	console.log(JSON.stringify(req.session.email));
	req.session.destroy();
	//console.log("Destroyed session:" + JSON.stringify(a));
	//console.log(JSON.stringify(req.session.email));
	res.render('homepage');
};