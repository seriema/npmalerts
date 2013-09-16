var pg = require('pg');


function executeQuery(query, callback) {
console.log('Connecting to db.');
    pg.connect(process.env.DATABASE_URL, function(err, client) {
	if (err) {
	    console.error('db:executeQuery:pg.connect ' + err);
	    callback('Could not connect to db.');
	    return;
	}
console.log('No db connect error...');

	client.query(query, function(error, result) {
	    if (error) {
		console.error('db:executeQuery:client.query ' + error);
		callback('Error executing query.');
	    } else {
console.log('QUERY RUN SUCCESFULLY?!');
		callback(null, result.rows);
	    }

	    client.end();
        });
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
console.log('Reached executeQuery. What now?');
    executeQuery("INSERT INTO packages VALUES ('" + name + "','" + version + "','" + updated+ "')", callback);
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
