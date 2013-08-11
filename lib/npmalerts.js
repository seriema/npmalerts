'use strict';

var github = require('./github');
var npm = require('./npm');

var semver = require('semver');
var pg = require('pg');

var user = 'seriema@gmail.com';

pg.connect(process.env.DATABASE_URL, function(error, client) {

	if (error) {
		console.error(error);
		return;
	}

	var query = client.query('SELECT * FROM subscriptions');

	query.on('row', function(subscription) {
		repoManager.getPackageInfo(subscription.repourl, function(error, json) {
			for (var packageName in json.dependencies) {
				var currentVersion = json.dependencies[packageName];
				packManager.getLatestVersion(packageName, function(error, latestVersion, isNew) {
					if (isNew && semver.gt(latestVersion, currentVersion)) {
						email.queue(subscription.email, packageName, currentVersion, latestVersion);
					}
				});
			}
		});
	});
});


packManager.getLatestVersion = function(packageName, callback) {
	client.query('SELECT * FROM packages WHERE name = ' + packageName, function(error, result) {
		done();

		if (error) {
			// lägg till packageName i db
			client.query('INSERT INTO packages (name) VALUES ' + packageName);
		}

		var pack = result.rows[0];
		if (pack.updated < timeLimit) {
			callback(null, pack.version, false);
		} else {
			npm.getLatestVersion(pack.name, function(error, version) {
				// updatera pack.updated timestamp
				if (semver.gt(version, pack.version)) {
					// spara nya versionen i db
					// lista ut major/minor/patch
					callback(null, version, true);
				} else {
					callback(null, version, false);
				}
			});
		}
	});
}
