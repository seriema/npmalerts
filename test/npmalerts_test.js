'use strict';

//var npmalerts = require('../lib/npmalerts.js');
var githubWrapper = require('../lib/github.js');
var npmWrapper = require('../lib/npm.js');

var semver = require('semver');
var _ = require('underscore');


var sampleGithubUrls = [
    'http://github.com/seriema/seriema.github.io.git',
    'https://github.com/seriema/seriema.github.io.git',
    'http://github.com/seriema/seriema.github.io',
    'https://github.com/seriema/seriema.github.io',
    'http://www.github.com/seriema/seriema.github.io',
    'https://www.github.com/seriema/seriema.github.io',
    'git://github.com/seriema/seriema.github.io.git'
];

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
	'get package.json in Github repo': function(test) {
		test.expect(1);
		githubWrapper.getPackageJson('seriema', 'prim.js', function(error) {
			test.ok(!error, error);
			test.done();
		});
	},
	'read package.json in Github repo': function(test) {
		test.expect(2);
		githubWrapper.getPackageJson('seriema', 'prim.js', function(error, json) {
			test.notEqual(json, undefined);
			test.strictEqual(typeof json, 'object');
			test.done();
		});
	},
	'parse username from Github address': function(test) {
		test.expect(sampleGithubUrls.length);
        _.forEach(sampleGithubUrls, function(address) {
            test.strictEqual(githubWrapper.getUserFromUrl(address), 'seriema', address);
        });
        test.done();
	},
	'parse project name from Github adress': function(test) {
        test.expect(sampleGithubUrls.length);
        _.forEach(sampleGithubUrls, function(address) {
            test.strictEqual(githubWrapper.getRepoFromUrl(address), 'seriema.github.io', address);
        });
		test.done();
	},

	// Parsing package.json
	'find dependencies in package.json': function(test) {
		test.expect(1);
//		var packageHandler = new Package(mockPackageJson);
//		test.ok(packageHandler.hasDependencies());
		test.ok(mockPackageJson.dependencies);
		test.done();
	},
	'find devDependencies in package.json': function(test) {
		test.expect(1);
//		var packageHandler = new Package(mockPackageJson);
//		test.ok(packageHandler.hasDevDependencies());
		test.ok(mockPackageJson.devDependencies);
		test.done();
	},
	'parse package name and version from dependencies': function(test) {
		test.expect(3);
		var deps = mockPackageJson.dependencies;
		var packages = [];

		for (var dep in deps) {
			if (deps.hasOwnProperty(dep)) {
				packages.push( { name: dep, version: deps[dep] } );
			}
		}

		test.strictEqual(packages.length, 1);
		test.strictEqual(packages[0].name, 'github');
		test.strictEqual(packages[0].version, '~0.1.10');

		test.done();
	},

	// npm
	'get latest package version': function(test) {
		test.expect(2);
		npmWrapper.getLatestVersion('github', function(error, version) {
			test.ok(!error);
			test.ok(version);
			test.done();
		});
	},
	'get package versions from npm using package name': function(test) {
		test.expect(1);
		npmWrapper.getLatestVersion('github', function(error, version) {
			test.ok(version);
			test.done();
		});
	},

	// semver
	'check package version': function(test) {
		test.expect(1);
		test.ok(semver.valid('0.1.10'));
		test.done();
	},
	'detect new version available': function(test) {
		test.expect(1);
		test.ok(semver.lt('1.2.3', '9.8.7'));
		test.done();
	},
	'detect packages with same version': function(test) {
		test.expect(2);
		test.ok(!semver.lt('1.2.3', '1.2.3'));
		test.ok(!semver.gt('1.2.3', '1.2.3'));
		test.done();
	},
	'detect new version is within semver limits of package.json': function(test) {
		test.expect(1);
		test.ok(semver.satisfies('1.2.4', '~1.2.3'));
		test.done();
	},
	'detect new version is outside of semver limits of package.json': function(test) {
		test.expect(1);
		test.ok(!semver.satisfies('1.3.0', '~1.2.3'));
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
