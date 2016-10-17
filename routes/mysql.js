var ejs= require('ejs');//importing module ejs
var mysql = require('mysql');//importing module mysql
var encryption = require('./encryption');
var winston = require('winston');
var sess;

var config= require('./config');
var poolConfig= config.dbpool;
var pool =[];
var db=config.db;
function getConnection(){
	var connection= mysql.createConnection({
	    host     : db.host,
	    user     : db.user,
	    password : db.password,
	    database : db.database,
	    port	 : db.port
	});
	return connection;
}

exports.createConnectionPool= function createConnectionPool(){
	for(var i=0; i<poolConfig.maxsize;i++){
		pool.push(getConnection());
		//console.log(pool);
	}
};

function getConnectionFromPool(){
	if(pool.length<=0){
		console.log("Need to empty connection pool!");
		return null;
	}
	else{
		return pool.pop();
	}
}


exports.findone=function(req, res){
	var connection=getConnectionFromPool();
	winston.log('info', " "+req.session.email+" clicked on item "+req.params.productname);
	connection.query('select * from product_to_sell where productname="'+req.params.productname+'"', function(err, rows){
	console.log(rows[0].productid);
	console.log(rows);
	var data = {product:rows};
	console.log(JSON.stringify(data));
	res.render('product', data);
	pool.pushConnection();
	}); 
};

exports.addproducttocart=function(req, res){
	sess=req.session;
	if (sess.email){
	var connection=getConnectionFromPool();
	console.log("hi" + JSON.stringify(req.body));
	var email = req.session.email;
	var productid = req.body.productid;
	var productdescription = req.body.productdescription;
	var productquantity = req.body.productquantity;
	var productname = req.body.productname;
	var productprice = req.body.productprice;
	var data = {email: email,
				itemid: productid,
				itemname: productname,
				itemdescription: productdescription,
				itemprice: productprice,
				itemquantity: productquantity
				};
	connection.query("insert into cart set ?", data, function (err){
		if(err){
			pool.pushConnection();
			console.log("Error in adding data");
		}
		else{
			pool.pushConnection();
			console.log(data);
			winston.log('info', " "+req.session.email+" added "+JSON.stringify(req.params.productname)+"item to sell");
			res.redirect('back');
			connection.end();
		}
	});
	}
	else{
		pool.pushConnection();
		res.redirect("/login");
	}
};	

exports.profile= function(req, res){
	sess=req.session;
	if (sess.email){
	var connection=getConnectionFromPool();
	winston.log('info', ''+req.session.email +' viewed profile');
	connection.query('select * from userinfo where email = "'+ req.session.email +'"', function(err, rows1){
		connection.query('select * from product_to_sell where email = "'+ req.session.email +'"', function(err, rows2){
			connection.query('select * from bidding_product_to_sell where email = "'+ req.session.email +'"', function(err, rows3){
				connection.query('select * from purchasehistory where email = "'+ req.session.email +'"', function(err, rows4){
					var data1 = {productlist: rows2};
					console.log(data1);
					var data2 = {userlist: rows1};
					console.log(data2);
					var data3 = {bidlist: rows3};
					console.log(data3);
					var data4 = {list: rows4};
					console.log(data4);
					pool.pushConnection();
					res.render('profile', {bidlist: rows3, productlist: rows2, userlist: rows1, list: rows4 });
			});
		});
	});
	});
	}
	else{
		res.redirect("/login");
	}
};

exports.getcartdata= function(req,res){
	var connection=getConnectionFromPool();
		winston.log('info',''+ req.session.email +' viewed cart page');
		connection.query('select * from cart where email = "'+ req.session.email +'"', function(err, rows){
		var data={userlist:rows};
		console.log("From cart:" +JSON.stringify(data));
		pool.pushConnection();
		res.send(data);
	});
};

exports.deletebidproduct = function(req,res){  
	var sess= req.session;
	if(sess.email){
		console.log("from delete product from mysql");
		console.log(JSON.stringify(req.body));
    var itemid = req.params.bidproductid;
    console.log(itemid);
    console.log(req.session.email);
    var connection =getConnection();
       connection.query("DELETE FROM bidding_product_to_sell WHERE bidproductid = '"+req.params.bidproductid+"' and email= '"+req.session.email+"'", function(err, rows)
       {
            if(err){
            	pool.pushConnection();
                console.log("Error deleting : %s ",err );
            }
            pool.pushConnection();
            res.redirect('/profile');
            winston.log('info',''+ req.session.email +' deleted '+req.params.bidproductid+' from bid products');
       });
	}
	else{
		res.redirect('/login');
	}
};

exports.deleteproductfromcart = function(req,res){  
	var sess= req.session;
	if(sess.email){
		console.log("from delete product from mysql");
		console.log(JSON.stringify(req.body));
    var itemid = req.params.itemid;
    console.log(req.params.itemid);
    console.log(req.session.email);
    winston.log('info',''+ req.session.email +' deleted '+JSON.stringify(req.params.itemid)+' from cart');
    var connection =getConnectionFromPool();
       connection.query("DELETE FROM cart WHERE itemid = '"+req.params.itemid+"' and email= '"+req.session.email+"'", function(err, rows)
       {
            if(err){
            	pool.pushConnection();
                console.log("Error deleting : %s ",err );
            }
            pool.pushConnection();
            res.render('homepage');
       });
	}
	else{
		res.redirect('/login');
	}
};

exports.checkoutdata = function(req,res){
	console.log("this is the cart data from proceed to checkout"+ JSON.stringify(req.body.cartdata));
	var connection=getConnectionFromPool();
	var cartdata = req.body.cartdata;
	connection.query('delete from cart where email="' + req.session.email +'"');
	for(var i=0;i<cartdata.length;i++){
		var data = {
				email: cartdata[i].email,
				itemid: cartdata[i].itemid,
				itemname: cartdata[i].itemname,
				itemdescription: cartdata[i].itemdescription,
				itemprice: cartdata[i].itemprice,
				itemquantity: cartdata[i].itemquantity,
				quantityneeded:cartdata[i].quantityneeded
				};
		winston.log('info',''+ req.session.email +' checked out '+JSON.stringify(req.params.itemid)+' item');
		console.log("checking the variables of data:---" + JSON.stringify(data));
		connection.query("insert into cart set ?", data);
		pool.pushConnection();
		console.log("i m rendering checkout");
	}
	res.send("hi");
};

exports.checkoutdisplay=function(req,res){
	var connection= getConnectionFromPool();
	console.log("i m in node checkoutdispay");
	winston.log('info',''+ req.session.email +' checking out items');
	connection.query('select * from cart where email="'+ req.session.email+'"',function(error,rows1){
		connection.query('select * from userinfo where email= "' + req.session.email + '"', function(error,rows2){
			console.log("I m in display to checkout");
			var data1={itemlist:rows1};
			console.log(data1);
			var data2={user:rows2};
			console.log(data2);
			var data={itemlist:rows1,user:rows2};
			res.send(data);
			pool.pushConnection();
		});
	});
};

exports.checkout= function(req,res){
	res.render('checkout');
};

exports.complete = function(req,res){
	var connection=getConnectionFromPool();
		connection.query('select * from cart where email = "'+ req.session.email +'"',function(err,rows){
			console.log("This is current cart status" + JSON.stringify(rows));
			for(var i=0;i<rows.length;i++){
				var data={
					email:rows[i].email,
					itemid:rows[i].itemid,
					itemname:rows[i].itemname,
					quantity:rows[i].quantityneeded,
					itemprice:rows[i].itemprice
				};
				connection.query('insert into purchasehistory set ?',data);
				pool.pushConnection();
				var query = 'update product_to_sell set productquantity =' +
				'greatest(0,productquantity-' + rows[i].quantityneeded+') where '+
				'productid="'+rows[i].itemid+'"';
				console.log(query);
				connection.query(query,function(error,row){
				console.log(row);
			});
			}
			connection.query('delete * from cart where email = "'+ req.session.email +'"', function(err, rows){
				if(err){
					pool.pushConnection();
					console.log("error in deletion from cart after checkout");
				}
			});
		});
		res.redirect('profile');
};

exports.loadcarddetails=function(req,res){
	console.log("i m in load card details mysql file");
	var connection= getConnectionFromPool();
	var data;
	winston.log('info',' card details loaded of '+req.session.email+'');
	connection.query("select * from creditcard where email='" + req.session.email +"'", function(error, rows){
		if(rows.length>0){
			pool.pushConnection();
			data={card:rows};
			console.log(data);
			res.send(data);
		}
		else{
			pool.pushConnection();
			data="Enter credit card details";
			res.send(data);
		}	
	});	
};

exports.addcarddetails= function(req,res){
	console.log("card details:"+ JSON.stringify(req.body));
	var data=req.body;
	var number= data.cardnumber;
	var date=data.expirationdate;
	var cvv= data.securitycode;
	console.log("I m in add card details ");
	var value1=/^([1-9]{1}[0-9]{15})$/.test(number);
	var value2=/^(20)([1][789]|[2-9]\d)[- /.](0[1-9]|1[012])$/.test(date);
	var value3=/^([1-9]{1}[0-9]{2})$/.test(cvv);
	var msg=" ";
	var data1={
		email:req.session.email,
		cardnumber:number,
		date:date,
		cvv:cvv
	};
	var connection=getConnectionFromPool();
		if(value1 && value2 && value3){
		connection.query('insert into creditcard set ?',data1);
		pool.pushConnection();
		console.log(data1);	
		res.send({msg:"successful"});
		}
		else{
			msg="Wrong Credit card information";
			res.send({msg: msg});
		}
		winston.log('info', 'card details of'+req.sessions.email+'added in DB');
};

exports.cart=function(req, res){
	sess=req.session;
	if (sess.email){
	var connection=getConnectionFromPool();
	var itemid = req.params.itemid;
	connection.query('select * from cart where email = "'+ req.session.email +'"', function(err, rows){
		pool.pushConnection();
		var data = {userlist: rows};
		console.log(JSON.stringify(data));
		res.render('cart', data);
	});
	}
	else{
		res.redirect("/login");
	}
};

exports.findall= function(req, res){
	sess=req.session;
	if (sess.email){
	var connection=getConnectionFromPool();
	winston.log('info', ''+req.session.email+'viewed all the items');
	connection.query('select * from product_to_sell where email = "'+ req.session.email +'"', function(err, rows){
		pool.pushConnection();
		var data = {productlist: rows};
		console.log(JSON.stringify(data));
		res.render('table', data);
	});
	}
	else{
		res.redirect("/login");
	}
};

exports.womenfashion=function(req, res){
	var connection=getConnectionFromPool();
	winston.log('info', ''+req.session.email+'viewed women clothing');
	connection.query('select * from product_to_sell where category = "Women Fashion" AND email <> "'+req.session.email+'"', function(err, rows){
		pool.pushConnection();
		var data = {productlist: rows};
		console.log(JSON.stringify(data));
		res.render('womenfashion', data);
	});
};

exports.electronicauction=function electronicauction(req, res){
	var connection=getConnectionFromPool();
	winston.log('info', ''+req.session.email+'viewed Bidding Products');
	connection.query('select *,DATE_ADD(biddateposted,INTERVAL 4 DAY) AS BidCloses from bidding_product_to_sell where bidcategory = "Electronics" AND email <> "'+req.session.email+'"', function(err, rows){
		pool.pushConnection();
		var data = {productlist: rows};
		winston.log('info','ho gaya'+JSON.stringify(data));
		console.log("maayaaa"+JSON.stringify(data));
		res.render('electronicauction', data);
	});
};

exports.postbid=function(req, res){
	var sess=req.session;
	if(sess.email){
	var connection=getConnectionFromPool();
	console.log("hi" + JSON.stringify(req.body));
	var email = req.session.email;
	var bidvalue = req.body.bidvalue;
	var data = {email: req.session.email,
				bidvalue: req.body.bidvalue,
				bidproductid: req.body.bidproductid,
				};
	winston.log('info', ''+req.session.email+'bids for the product'+JSON.stringify(req.body.bidproductid)+'');
	connection.query('select bidvalue from bidding_product_to_sell where bidproductid ="'+ req.body.bidproductid+'"', function(err, rows){
	pool.pushConnection();
	var value={values:rows};
	console.log("value " +JSON.stringify(value.values[0].bidvalue));
	if(req.body.bidvalue > value.values[0].bidvalue){
		console.log("aaya idhar");
		connection.query('update bidding_product_to_sell set bidtakenby= "'+ req.session.email +'", bidvalue= "'+req.body.bidvalue+'" where bidproductid= "'+req.body.bidproductid+'"');
		console.log(data);
		console.log("ho gaya");
		res.redirect('back');
		connection.end();
	}
	else{
		console.log("ni hua");
		res.redirect('back');
	}
	});
	}
	else{
		res.redirect("/login");
	}
};

exports.fetchdata=function(callback,sqlQuery){
	var connection=getConnectionFromPool();
	connection.query(sqlQuery, function(err, rows, fields) {
		if(err){
			console.log("ERROR: ", err.message);
			pool.pushConnection();
		}
		else{
			pool.pushConnection();
			console.log("DB Results:", rows);
			callback(err, rows);
		}
	});
	console.log("\nConnection closed..");
	connection.end();
};

exports.insert=function(req, res){
	var connection=getConnectionFromPool();
	console.log("hi" + JSON.stringify(req.body));
	var password = req.body.password;
	var encrypted_password = encryption.encrypt(password);
	console.log(encrypted_password);
	var data = {email: req.body.email,
				firstname: req.body.firstname,
				lastname: req.body.lastname,
				password: encrypted_password,
				birthday: "1992-12-12",
				address: 'san jose',
				contactno: req.body.mobile
				};
    connection.query("insert into userinfo set ?", data, function(err,rows){
    	winston.log('info','ho gaya'+JSON.stringify(data));
		if(!err){
			req.session.firstname=data.firstname;  //for displaying hi "name" on homepage
			pool.pushConnection();
			res.send({status:200, firstname: req.session.firstname});
		}
		else{
			pool.pushConnection();
			res.send({status:400});
		}
	});
};

exports.deleteproduct = function(req,res){  
	var sess= req.session;
	if(sess.email){
    var productname = req.params.productname; 
    var connection =getConnectionFromPool();
       connection.query("DELETE FROM product_to_sell  WHERE productname = ? ",[productname], function(err, rows)
       {
            if(err){
                console.log("Error deleting : %s ",err );
                pool.pushConnection();
            }
            pool.pushConnection();
            res.redirect('back');
       });
	}
	else{
		res.redirect("/login");
	}
};

exports.save=function(req, res){
	var sess= req.session;
	if(sess.email){
	var connection=getConnectionFromPool();
	console.log("hi mansi hello" +req.session.email);
	var data = {email: req.session.email ,productid: req.body.productid, productname: req.body.productname, productdescription: req.body.productdescription, productprice: req.body.productprice, productquantity: req.body.productquantity, category: req.body.category};
	console.log(data);
	connection.query('insert into product_to_sell set ?', data);
	pool.pushConnection();
	res.redirect('profile');
	}
	else{
		res.redirect("/login");
	}
};

exports.savebid=function(req, res){
	var sess= req.session;
	if(sess.email){
	var connection=getConnectionFromPool();
	console.log("hi mansi hello" +req.session.email);
	var data = {email: req.session.email ,bidproductid: req.body.productid, bidproductname: req.body.productname, bidproductdescription: req.body.productdescription, bidproductprice: req.body.productprice, bidtakenby: req.session.email, bidcategory: req.body.category};
	console.log(data);
	var hi= JSON.stringify(req.body.productid);
	connection.query('insert into bidding_product_to_sell set ?', data);
	pool.pushConnection();
	res.redirect('profile');
	}
	else{
		res.redirect("/login");
	}
};