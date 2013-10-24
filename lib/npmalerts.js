'use strict';

var github = require('./github');
var npm = require('./npm');
var db = require('./db');
var email = require('./email');

var semver = require('semver');

var cache = {};


db.readSubscriptions(function(error, subscriptions) {
	if (error) {
		console.error(error);
		return;
	}

	cache = {};
	for(var i = 0, n = subscriptions.length; i < n; i++) {
		var subscription = subscriptions[i];

		var user = github.getUserFromUrl(subscription.repourl);
		var repo = github.getRepoFromUrl(subscription.repourl);
		if (!user) {
			console.error('db:readSubscriptions user invalid for ' + subscription.repourl);
		} else if (!repo) {
			console.error('db:readSubscriptions repo invalid for ' + subscription.repourl);
		} else {
			github.getPackageJson(user, repo, processPackage.bind(null, subscription));
		}
	}
});

function cacheIt(packageName, version, timeStamp, isNewRelease) {
	cache[packageName] = {
		version: version,
		timeStamp: timeStamp,
		isNewRelease: isNewRelease
	};
}

function checkPackage(emailAdress, repourl, packageName, currentVersion) {
	getLatestVersion(packageName, function(error, latestVersion, isNew) {
		if (error) {
			console.error(error);
			return;
		}
		if (isNew && semver.gt(latestVersion, semver.clean(currentVersion))) {
			email.send(emailAdress, repourl, packageName, currentVersion, latestVersion);
		}
	});
}

function isStillValid(timeStamp) {
	return new Date(timeStamp) >= new Date().setDate(-1);
}

function getLatestVersion(packageName, callback) {
	var cached = cache[packageName];
	if (cached) {
		callback(null, cached.version, cached.isNewRelease);
		return;
	}

	db.getPackageByName(packageName, function(error, packages) {
		if (error) {
			console.error(error);
			callback(error);
			return;
		}
		if (packages.length === 0) {
			npm.getLatestVersion(packageName, function(error, version) {
				var timeStamp = new Date().toUTCString();
				db.createPackage(packageName, version, timeStamp);
				cacheIt(packageName, version, timeStamp, false);
				callback(null, version, false);
			});
			return;
		}
		// TODO: is this needed, when there's a cache?
		var pack = packages[0];
		if (isStillValid(pack.timestamp)) {
			cacheIt(packageName, pack.version, pack.timeStamp, false);
			callback(null, pack.version, false);
			return;
		}

		npm.getLatestVersion(packageName, function(error, version) {
			var timeStamp = new Date().toUTCString();
			db.updatePackageByName(packageName, version, timeStamp);
			var isNewRelease = semver.gt(version, semver.clean(pack.version));
			cacheIt(packageName, version, timeStamp, isNewRelease);
			callback(null, version, isNewRelease);
		});
	});
}

function processPackage(subscription, error, json) {
	if (error) {
		console.error(error);
		return;
	}

	var packageName;
	for (packageName in json.dependencies) {
		checkPackage(subscription.email, subscription.repourl, packageName, json.dependencies[packageName]);
	}
	for (packageName in json.devDependencies) {
		checkPackage(subscription.email, subscription.repourl, packageName, json.devDependencies[packageName]);
	}
}