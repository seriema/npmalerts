var npmWrapper = require('../lib/npm.js');


exports['npm'] = {
	'get latest package version': function(test) {
		test.expect(2);
		npmWrapper.getLatestVersion('github', function(error, version) {
			test.ok(!error);
			test.ok(version);
			test.done();
		});
	},
	'get all packages from npm': function(test) {
		test.expect(2);
		var yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);
		npmWrapper.getLatestPackages(yesterday, function(error, newPackages) {
			test.ok(!error);
			test.ok(newPackages);
			test.done();
		});
	}
};