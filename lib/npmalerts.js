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

        github.getPackageJson(user, repo, function(error, json) {
            if (error) {
                console.error(error);
                return;
            }

            for (var packageName in json.dependencies) {
                checkPackage(subscription.email, subscription.repourl, packageName, json.dependencies[packageName]);
            }
            for (var packageName in json.devDependencies) {
                checkPackage(subscription.email, subscription.repourl, packageName, json.devDependencies[packageName]);
            }
        });
    }
});

function cacheIt(packageName, version, timeStamp, isNewRelease, callback) {
    cache[packageName] = {
        version: version,
        timeStamp: timeStamp,
        isNewRelease: isNewRelease
    };
    callback(null, version, isNewRelease);
}

function checkPackage(email, repourl, packageName, currentVersion) {
console.log('Checking package ' + packageName);
    getLatestVersion(packageName, function(error, latestVersion, isNew) {
        if (error) {
            console.error(error);
            return;
        }
console.log('Latest version for ' + packageName + ' is ' + latestVersion + ' and its new: ' + isNew);
        if (isNew) {// && semver.gt(latestVersion, currentVersion)) {
            email.queue(email, repourl, packageName, currentVersion, latestVersion);
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
console.log(packageName + ' Before checking packages length ' + packages.length);
        if (packages.length === 0) {
console.log(packageName + ' Expected to be here, now trying to get latest version');
            npm.getLatestVersion(packageName, function(error, version) {
                var timeStamp = new Date().toUTCString();
console.log(packageName + ' Got latest version, trying to create package in db with ' + packageName + ' ' + version + ' ' + timeStamp + '.');
                db.createPackage(packageName, version, timeStamp);
                cacheIt(packageName, version, timeStamp, false, callback);
            });
            return;
        }
        // TODO: is this needed, when there's a cache?
        var pack = packages[0];
console.log(packageName + ' Before checking package timestamp ' + pack.timestamp);
        if (isStillValid(pack.timestamp)) {
            cacheIt(packageName, pack.version, pack.timeStamp, false, callback);
            return;
        }
console.log(packageName + ' Before final step');
        npm.getLatestVersion(packageName, function(error, version) {
            var timeStamp = new Date().toUTCString();
            db.updatePackageByName(packageName, version, timeStamp);
            var isNewRelease = semver.gt(version, pack.version);
            cacheIt(packageName, version, timeStamp, isNewRelease, callback);
        });
    });
}
