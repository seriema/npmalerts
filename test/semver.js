var semver = require('../lib/semver.js');

exports['semver'] = {
	'version within range but lower is not new': function(test) {
		test.expect(1);
		var cached = '1.2.2';
		var versionRange = '~1.2.3';
		test.ok(!semver.isNew(cached, versionRange));
		test.done();
	},
	'version within range but greater is new': function(test) {
		test.expect(1);
		var cached = '1.2.4';
		var versionRange = '~1.2.3';
		test.ok(semver.isNew(cached, versionRange));
    test.done();
	},
	'version outside range but greater is new': function(test) {
		test.expect(1);
		var cached = '1.3.0';
		var versionRange = '~1.2.3';
		test.ok(semver.isNew(cached, versionRange));
		test.done();
	},
	'version same as base range is not new': function(test) {
		test.expect(1);
		var cached = '1.2.3';
		var versionRange = '~1.2.3';
		test.ok(!semver.isNew(cached, versionRange));
		test.done();
	}
};