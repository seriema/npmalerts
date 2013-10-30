var npm = require('npm');
var _ = require('underscore');

exports.getLatestVersion = function(packageName, callback) {
	npm.load({}, function() {
		npm.commands.show([packageName, 'versions'], true, function(error, result) {
			if (error) {
				return callback(error);
			}

			var versions = result[Object.keys(result)[0]].versions;
			if (versions.length === 0) {
				callback('No versions found for ' + packageName);
			} else {
				callback(null, versions[versions.length-1]);
			}
		});
	});
};

exports.getLatestPackages = function(timestamp, callback) {
	npm.load({}, function() {
        npm.commands.search([], true, function(error, result) {
            if (error) {
                return callback(error);
            }

            timestamp = new Date(timestamp);
            var newPackages = _.filter(result, function(package) {
               return new Date(package.time) >= timestamp;
            });

            callback(null, newPackages);
        });
    });
};