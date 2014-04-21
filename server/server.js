// Setup Dependencies
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var debug = require('debug')('{name}');
var express = require('express');
var favicon = require('static-favicon');
var logger = require('morgan');
var path = require('path');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.set('port', process.env.PORT || 3000);

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// route setup
app.use('/', routes);

if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

var server = app.listen(app.get('port'), function() {
	debug('Express app listening on port ' + server.address().port);
});