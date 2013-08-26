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
    for(var subscription in subscriptions) {
        github.getPackageJson(subscription.repourl, function(error, json) {
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
    getLatestVersion(packageName, function(error, latestVersion, isNew) {
        if (error) {
            console.error(error);
            return;
        }

        if (isNew) {// && semver.gt(latestVersion, currentVersion)) {
            email.queue(email, repourl, packageName, currentVersion, latestVersion);
        }
    });
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
                cacheIt(packageName, version, timeStamp, false, callback);
            });
            return;
        }

        // TODO: is this needed, when there's a cache?
        var pack = packages[0];
        if (isStillValid(pack.timestamp)) {
            cacheIt(packageName, pack.version, pack.timeStamp, false, callback);
            return;
        }

        npm.getLatestVersion(packageName, function(error, version) {
            var timeStamp = new Date().toUTCString();
            db.updatePackage(packageName, version, timeStamp);
            var isNewRelease = semver.gt(version, pack.version);
            cacheIt(packageName, version, timeStamp, isNewRelease, callback);
        });
    });
}
