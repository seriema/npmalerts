var express = require('express');
var path = require('path');
var expressValidator = require('express-validator');

var home = require('./routes/home.js');
var api = require('./routes/api.js');

var port = process.env.PORT || 5000;

var app = express();

var allowCrossDomain = function(req, res, next) {
	res.header('Access-Control-Allow-Origin', 'http://seriema.github.io');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

	// intercept OPTIONS method
	if ('OPTIONS' === req.method) {
		res.send(200);
	}
	else {
		next();
	}
};

app.configure(function () {
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(allowCrossDomain);
	app.use(express.logger());
	app.use(express.urlencoded());
	app.use(express.json());
	app.use(express.methodOverride());
	app.use(express.static(path.join(__dirname, 'public')));
	app.use(express.static(path.join(__dirname, 'controllers')));
	app.use(express.static(path.join(__dirname, 'services')));
	app.use(expressValidator());
});

app.get('/', home.index);
app.put('/api/subscriptions', api.createSubscription);
app.get('/api/subscriptions', api.readSubscriptions);
app.del('/api/subscriptions', api.deleteSubscription);
app.get('/api/updates', api.readUpdates);
app.get('/api/cron', api.startCron);
app.get('api/wake', api.wakeUp);

app.listen(port);
