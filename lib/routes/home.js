var pg = require('pg');
var data = 'unknown data!';

pg.connect(process.env.DATABASE_URL, function(err, client) {
	if (err) {
		data = err;
		return;
	}

	client.query("SELECT * FROM subscriptions", function(error, result) {
		data = JSON.stringify(result.rows);
	});
});


exports.index = function (req, res) {
    res.render('home/index', { title: data });
//	res.send(data);
};
