var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var winston = require('winston');

var mysql = require('./routes/mysql');
var routes = require('./routes/index');
var items = require('./routes/items');
var abc = require('./routes/logfile');
//var product = require('./routes/product');

var app = express();

winston.add(winston.transports.File,{
			filename:'./logs/abc.log',
			level:'info',
			json: true,
			maxsize: 5242880, //5MB
			colorize: false
});
 
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', routes);
app.use(session({
	  secret: 'my_secret',
	  resave: false,
	  saveUninitialized: true
	}));
app.use(function(req, res, next) {
	  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	  next();
	});


app.get('/', routes.index);
app.get('/homepage', routes.homepage);
app.get('/login', routes.signin);
app.get('/cart', mysql.cart);
app.get('/logout', routes.logout);
app.get('/saveproduct', routes.save);
app.get('/savebidproduct', routes.addbidproduct);
app.get('/findone/:productname', mysql.findone);
app.get('/findall', mysql.findall);
app.get('/delete/:productname', mysql.deleteproduct);
app.get('/delete2/:bidproductid', mysql.deletebidproduct);
app.get('/profile', mysql.profile);
app.get('/womenfashion', mysql.womenfashion);
app.get('/electronicauction', mysql.electronicauction);
app.post('/addproducttocart', mysql.addproducttocart);
//app.get('/delete1/:itemid', mysql.deleteproductfromcart);

app.post('/savetoproduct', mysql.save);
app.post('/savetobidproduct', mysql.savebid);
app.post('/postbid', mysql.postbid);
app.post('/aftersignin', routes.afterSignIn);
app.post('/save', mysql.insert);

//app.get('/cart', mysql.cart);
app.post('/getcartdata',mysql.getcartdata);
//app.post('/getdata',mysql.getdata);
app.get('/checkout',mysql.checkout);
app.get('/transactioncomplete',mysql.complete);
app.post('/checkoutdata',mysql.checkoutdata);
app.post('/checkoutdisplay',mysql.checkoutdisplay);
app.get('/loadcarddetails',mysql.loadcarddetails);
app.post('/addcarddetails', mysql.addcarddetails);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
