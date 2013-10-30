'use strict';

var github = require('./github');
var npm = require('./npm');
var db = require('./db');
var email = require('./email');

var semver = require('semver');
var _ = require('underscore');


var cache = {};

var yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

npm.getLatestPackages(yesterday, function(error, packages) {
	if (error) {
		return console.error(error);
	}

	cache = packages;
    console.info('There are ' + cache.length + ' package updates.');

	db.readSubscriptions(function(error, subscriptions) {
		if (error) {
			return console.error(error);
		}

        _.each(subscriptions, function(subscription) {
            var user = github.getUserFromUrl(subscription.repourl);
            var repo = github.getRepoFromUrl(subscription.repourl);
            github.getPackageJson(user, repo, processPackageJson(subscription));
        });
	});
});

function processPackageJson(subscription) {
	return function(error, json) {
		if (error) {
			return console.error(error);
		}

        var packages = _.filter(_.extend(json.dependencies, json.devDependencies), isPackageInCache);

        _.each(packages, function(packageName) {
            var cached = cache[packageName];
            var versionRange = packages[packageName];

            email.send(subscription.email, subscription.repourl, packageName, versionRange, cached.version);
		});
	};
}

function isPackageInCache(dependency) {
    return !!cache[dependency];
}
