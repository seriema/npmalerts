var pg = require('pg');

var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/';
var client = new pg.Client(connectionString);
client.connect();


function executeQuery(query, callback) {
	if (!client) {
		callback('Could not connect to db.');
		return;
	}

	client.query(query, function(error, result) {
		if (error) {
			callback('Error executing query. ' + error);
		} else if (callback) {
			callback(null, result.rows);
		}
	});
}

// Subscriptions

exports.createSubscription = function(email, repo, callback) {
	executeQuery("INSERT INTO subscriptions VALUES ('" + email + "','" + repo + "')", callback);
};

exports.readSubscriptions = function(callback) {
	executeQuery('SELECT * FROM subscriptions', callback);
};

exports.deleteSubscription = function(email, repo, callback) {
	executeQuery("DELETE FROM subscriptions WHERE email='" + email + "' AND repourl='" + repo + "'", callback);
};

// Packages

exports.createPackage = function(name, version, updated, callback) {
	executeQuery("INSERT INTO packages VALUES ('" + name + "','" + version + "','" + updated + "')", callback);
};

exports.readPackages = function(callback) {
	executeQuery('SELECT * FROM packages', callback);
};

exports.getPackageByName = function(name, callback) {
	executeQuery("SELECT * FROM packages WHERE name='" + name + "'", callback);
};

exports.updatePackageByName = function(name, version, updated, callback) {
	executeQuery("UPDATE packages SET name='" + name + "',version='" + version + "',updated='" + updated + "' WHERE name='" + name + "'", callback);
};
