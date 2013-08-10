var pg = require('pg');

pg.connect(process.env.DATABASE_URL, function(err, client) {
	if (err) {
		return;
	}

	client.query("CREATE TABLE IF NOT EXISTS subscriptions(email varchar(64), repourl varchar(64))");
	client.query("CREATE TABLE IF NOT EXISTS packages(name varchar(64), version varchar(16), updated DATE)");
	client.query("INSERT INTO subscriptions(email, repourl) values('seriema@gmail.com', 'https://github.com/seriema/npmalerts.git')");
});
