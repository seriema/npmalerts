'use strict';

var npmalerts = require('../lib/npmalerts.js');

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
  'no args': function(test) {
    test.expect(1);
    // tests here
    test.equal(npmalerts.awesome(), 'awesome', 'should be awesome.');
    test.done();
  },
  'connect to GitHub repo': function(test) {
      test.expect(0);
      test.done();
  },
  'read package.json in Github repo': function(test) {
      test.expect(0);
      test.done();
  },
  'find dependencies in package.json': function(test) {
      test.expect(0);
      test.done();
  },
  'find devDependencies in package.json': function(test) {
      test.expect(0);
      test.done();
  },
  'parse package name and version from dependencies': function(test) {
      test.expect(0);
      test.done();
  },
  'get package version from npm using package name': function(test) {
      test.expect(0);
      test.done();
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