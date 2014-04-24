// Setup Dependencies
var bodyParser		= require('body-parser');
var cookieParser	= require('cookie-parser');
var debug			= require('debug')('{name}');
var express			= require('express');
var favicon			= require('static-favicon');
var fs				= require('fs');
var http			= require('http');
var https			= require('https');
var logger			= require('morgan');
var path			= require('path');

// setup a SSL certificate
var privateKey = fs.readFileSync(__dirname + '/config/cert/privatekey.pem').toString();
var certificate = fs.readFileSync(__dirname + '/config/cert/certificate.pem').toString();
var credentials = {key: privateKey, cert: certificate};

var routes = require('./routes/index');

var app = express();
var secureServer = https.createServer(credentials, app);
var server = http.createServer(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// use ejs-locals for all ejs templates:
app.engine('ejs', require('ejs-locals'));

app.set('port', process.env.PORT || 3000);

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use('/static', express.static(__dirname + '/public'));

// route setup
app.use('/', routes);

if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('500', {
			title: 'Internal error',
			message: err.message,
			error: err
		});
	});
}

// Start up the server on the port specified in the config
server.listen(app.get('port'), '0.0.0.0', 511);
console.log('Angular App Server - listening on port: ' + app.get('port'));
secureServer.listen(4433);
console.log('Angular App Server - listening on secure port: ' + 4433);