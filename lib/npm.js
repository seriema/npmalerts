var npm = require('npm');

exports.getLatestVersion = function(packageName, callback) {
	npm.load({}, function() {
		npm.commands.show([packageName, 'versions'], true, function(error, result) {
			if (error) {
				callback(error);
				return;
			}

			var versions = result[Object.keys(result)[0]].versions;
			if (versions.length > 0) {
				callback(null, versions[versions.length-1]);				
			}
		});
	});
};