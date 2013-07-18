'use strict';

//var npmalerts = require('../lib/npmalerts.js');
var npm = require('npm');
var GitHubApi = require('github');
var github = new GitHubApi({
	// required
	version: "3.0.0",
	// optional
	timeout: 5000
});



var mockPackageJson = {
  "devDependencies": {
    "grunt": "~0.4.1",
    "grunt-contrib-jshint": "~0.2.0",
    "grunt-contrib-nodeunit": "~0.1.2",
    "grunt-contrib-watch": "~0.4.4"
  },
  "dependencies": {
    "github": "~0.1.10"
  }
};


/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
	test.expect(numAssertions)
	test.done()
  Test assertions:
	test.ok(value, [message])
	test.equal(actual, expected, [message])
	test.notEqual(actual, expected, [message])
	test.deepEqual(actual, expected, [message])
	test.notDeepEqual(actual, expected, [message])
	test.strictEqual(actual, expected, [message])
	test.notStrictEqual(actual, expected, [message])
	test.throws(block, [error], [message])
	test.doesNotThrow(block, [error], [message])
	test.ifError(value)
*/

exports['npmalerts'] = {
	setUp: function(done) {
		// setup here
		done();
	},

	// GitHub
	'connect to GitHub repo': function(test) {
		test.expect(2);
		github.repos.get({
			user: 'seriema',
			repo: 'prim.js'
		}, function(error, result) {
			test.ok(!error, error);
			test.ok(result);
			test.done();
		});
	},
	'get package.json in Github repo': function(test) {
		test.expect(4);
		github.repos.getContent({
			user: 'seriema',
			repo: 'prim.js',
			path: 'package.json'
		}, function(error, result) {
			test.ok(!error, error);
			test.ok(result);
			test.done();
		});
	},
	'read package.json in Github repo': function(test) {
		test.expect(1);
		github.repos.getContent({
			user: 'seriema',
			repo: 'prim.js',
			path: 'package.json'
		}, function(error, result) {
			var jsonString = new Buffer(result.content, result.encoding).toString();
			test.ok(jsonString);
			test.done();
		});
	},

	// Parsing package.json
	'find dependencies in package.json': function(test) {
		test.expect(1);
		test.ok(mockPackageJson.dependencies);
		test.done();
	},
	'find devDependencies in package.json': function(test) {
		test.expect(1);
		test.ok(mockPackageJson.devDependencies);
		test.done();
	},
	'parse package name and version from dependencies': function(test) {
		test.expect(3);
		var names = [];
		var versions = [];

		for (var dep in mockPackageJson.dependencies) {
			if (mockPackageJson.dependencies.hasOwnProperty(dep)) {
				names.push(dep);
				versions.push(mockPackageJson.dependencies[dep]);				
			}
		}

		test.strictEqual(names.length, 1);
		test.strictEqual(names[0], 'github');
		test.strictEqual(versions[0], '~0.1.10');

		test.done();
	},

	// npm
	'load npm': function(test) {
		test.expect(1);
		npm.load({}, function(err) {
        test.ok(!err);
        test.done();
     });
	},
	'run npm show command': function(test) {
		test.expect(2);
		npm.load({}, function() {
			npm.commands.show(['github', 'versions'], true, function(error, result) {
				test.ok(!error);
				test.ok(result);
				test.done();
			});
		});
	},
	'get package versions from npm using package name': function(test) {
		test.expect(1);
		npm.load({}, function() {
			npm.commands.show(['github', 'versions'], true, function(error, result) {
				var versions = result[Object.keys(result)[0]].versions;
				test.ok(versions.length > 0);
				console.log('hi', versions[versions.length-1]);
				test.done();
			});
		});
	},
	'parse package version from npm': function(test) {
		test.expect(0);
		test.done();
	},
	'detect new version available': function(test) {
		test.expect(0);
		test.done();
	},
	'detect packages with same version': function(test) {
		test.expect(0);
		test.done();
	},
	'detect new version is within semver limits of package.json': function(test) {
		test.expect(0);
		test.done();
	},
	'detect new version is outside of semver limits of package.json': function(test) {
		test.expect(0);
		test.done();
	},

	// check package version with storage
	'get package version from storage using package name': function(test) {
		test.expect(0);
		test.done();
	},
	'do not check npm if stored info is less than 24h': function(test) {
		test.expect(0);
		test.done();
	},
	'check npm when data is old': function(test) {
		test.expect(0);
		test.done();
	},
	'compare latest package version to stored package version': function(test) {
		test.expect(0);
		test.done();
	},
	'detect new package release': function(test) {
		test.expect(0);
		test.done();
	},
	'detect new major version': function(test) {
		test.expect(0);
		test.done();
	},
	'detect new minor version': function(test) {
		test.expect(0);
		test.done();
	},
	'detect patch': function(test) {
		test.expect(0);
		test.done();
	},

	// notification system
	'send out email': function(test) {
		test.expect(0);
		test.done();
	},
	'detect email bounce': function(test) {
		test.expect(0);
		test.done();
	},
	'remove email from registry': function(test) {
		test.expect(0);
		test.done();
	},
	'add email and attached Github repository to registry': function(test) {
		test.expect(0);
		test.done();
	},
	'add Github repository to registry': function(test) {
		test.expect(0);
		test.done();
	},
	'remove Github repository from registry': function(test) {
		test.expect(0);
		test.done();
	},
	'detect dangling Github with no attached email': function(test) {
		test.expect(0);
		test.done();
	},
	'get list of Github repositories in registry': function(test) {
		test.expect(0);
		test.done();
	},
	'get list of emails attached to a Github repository': function(test) {
		test.expect(0);
		test.done();
	},
	'store latest notified version of package': function(test) {
		test.expect(0);
		test.done();
	},

	// end-to-end, integration tests
	'user registers': function(test) {
		test.expect(0);
		test.done();
	},
	'user unregisters': function(test) {
		test.expect(0);
		test.done();
	},
	'cron checks a Github repo': function(test) {
		test.expect(0);
		test.done();
	},
	'cron emails about new versions': function(test) {
		test.expect(0);
		test.done();
	},
	'cron removes dangling Github repos': function(test) {
		test.expect(0);
		test.done();
	},
	'cron goes back to sleep': function(test) {
		test.expect(0);
		test.done();
	},
	'cron wakes up': function(test) {
		test.expect(0);
		test.done();
	}

};
