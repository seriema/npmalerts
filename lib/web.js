var express = require("express");
var pg = require('pg');

var app = express();
app.use(express.logger());

var data = 'unknown data!';

pg.connect(process.env.DATABASE_URL, function(err, client) {
	if (err) {
		data = err;
		return;
	}

	var query = client.query("SELECT * FROM subscriptions", function(error, result) {
		data = JSON.stringify(result);
	});
});

app.get('/', function(request, response) {
	response.send(data);
});


var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
