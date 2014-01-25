var npmMock = require('npm-registry-mock');
var npmWrapper = require('../lib/npm.js');

var loadOptions = {registry: "http://localhost:1331"};
var mockOptions = {
	port: 1331,
	mocks: function (s) {
        s
            .filteringPathRegEx(/since\?stale=update_after&startkey=[^&]*/g,
                "since?stale=update_after&startkey=foo")
            .get("/-/all")
            .reply(200, {})
            .get("/-/all/since?stale=update_after&startkey=foo")
            .reply(200, {});
    }
};

exports['npm'] = {
    /*
	'get latest package version': function(test) {
		test.expect(2);
		npmMock(mockOptions, function (s) {
			npmWrapper.getLatestVersion('underscore', function(error, version) {
				test.ok(!error);
				test.ok(version);
				test.done();
				s.close();
			}, loadOptions);
		});
	},*/

	'get all packages from npm': function(test) {
		test.expect(2);
		var yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);
		npmMock(mockOptions, function (s) {
			npmWrapper.getLatestPackages(yesterday, function(error, newPackages) {
				test.ok(!error);
				test.ok(newPackages);
				test.done();
				s.close();
			}, loadOptions);
		});
	}
};