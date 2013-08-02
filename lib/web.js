var express = require("express");
var pg = require('pg');
var home = require('./routes/home.js');
var subscriptions = require('./api/subscriptions.js');

var port = process.env.PORT || 5000;

var app = express();

app.configure(function () {
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.static(path.join(__dirname, 'public')));
	app.use(express.logger());
});

app.get('/', home.index);
app.post('/api/subscriptions', subscriptions.create);
// app.delete('/api/subscriptions/:email:git', subscriptions.delete);

app.listen(port);
