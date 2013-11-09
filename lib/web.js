var express = require('express');
var path = require('path');
var expressValidator = require('express-validator');

var home = require('./routes/home.js');
var api = require('./routes/api.js');

var port = process.env.PORT || 5000;

var app = express();

app.configure(function () {
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.logger());
	app.use(express.urlencoded());
	app.use(express.json());
	app.use(express.methodOverride());
	app.use(express.static(path.join(__dirname, 'public')));
	app.use(express.static(path.join(__dirname, 'controllers')));
	app.use(expressValidator());
});

app.get('/', home.index);
app.put('/api/subscriptions', api.createSubscription);
app.get('/api/subscriptions', api.readSubscriptions);
app.del('/api/subscriptions', api.deleteSubscription);
app.get('/api/packages', api.readPackages);

app.listen(port);
