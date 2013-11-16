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

        var dependencyPairs = _.pairs(_.extend(json.dependencies || {}, json.devDependencies || {}));
        var packagePairs = _.filter(dependencyPairs, isPackageInCache);

        _.each(packagePairs, function(packagePair) {
            var packageName = packagePair[0];
            var cached =  _.where(cache, { name: packageName })[0];
            var versionRange = _.find(packagePairs, function(pair) { return pair[0] === packageName; })[1];

            if(subscription.ignorePatch && isPatch(cached)) {
                return;
            }

            console.info('Sending email about ' + packageName);
            email.send(subscription.email, subscription.repourl, packageName, versionRange, cached.version);
		});
	};
}

function isPatch(package) {
    var regex = new RegExp('[0-9]+.[0-9]+.([0-9]+)');
    return package.version.match(regex)[0] !== '0';
}

function isPackageInCache(dependencyPair) {
    return _.where(cache, { name: dependencyPair[0] }).length > 0;
}
