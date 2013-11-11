var _ = require('underscore');

var github = require('./github');
var npm = require('./npm');
var db = require('./db');
var email = require('./email');


var cache = {};


db.getUpdate(function(error, oldTimestamp) {
    if (error) {
        return console.error(error);
    }

    npm.getLatestPackages(oldTimestamp, function(error, packages, newTimestamp) {
        if (error) {
            return console.error(error);
        }

        db.setUpdate(oldTimestamp, newTimestamp, function(error) {
            if (error) {
                console.error(error);
            }
        });

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
});

function processPackageJson(subscription) {
	return function(error, json) {
		if (error) {
			return console.error(error);
		}

        var packages = _.filter(_.extend(json.dependencies || {}, json.devDependencies || {}), isPackageInCache);

        _.each(packages, function(packageName) {
            var cached = cache[packageName];
            var versionRange = packages[packageName];

            console.info('Sending email about ' + packageName);
            email.send(subscription.email, subscription.repourl, packageName, versionRange, cached.version);
		});
	};
}

function isPackageInCache(dependency) {
    return !!cache[dependency];
}
