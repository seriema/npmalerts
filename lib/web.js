var express = require("express");
var pg = require('pg');

var app = express();
app.use(express.logger());

pg.connect(process.env.DATABASE_URL, function(err, client) {
	if (err) {
		app.get('/', function(request, response) {
			response.send(err);
		});
		return;
	}

	var query = client.query("SELECT * FROM subscriptions");
	query.on('row', function(row) {
    	response.send(JSON.stringify(row));
	});
});

var app = express();
app.use(express.logger());


var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
