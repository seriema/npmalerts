var express = require('express');
var path = require('path');

var home = require('./routes/home.js');
var api = require('./routes/api.js');

var port = process.env.PORT || 5000;

var app = express();

app.configure(function () {
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
    app.use(express.bodyParser());
	app.use(express.static(path.join(__dirname, 'public')));
	app.use(express.logger());
});

app.get('/', home.index);
app.post('/api/subscriptions', api.createSubscription);
app.get('/api/subscriptions', api.readSubscriptions);
app.delete('/api/subscriptions/:email:repourl', api.deleteSubscription);
app.get('/api/packages', api.readPackages);

app.listen(port);
